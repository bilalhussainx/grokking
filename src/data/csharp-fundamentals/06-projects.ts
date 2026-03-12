import { Module } from "../types";

export const projectsModule: Module = {
  id: "csharp-projects",
  title: "Mini Projects",
  description:
    "Apply everything you have learned by building real C# projects — a bank account system, grade tracker, and inventory manager.",
  lessons: [
    {
      id: "csharp-project-bank",
      slug: "csharp-project-bank",
      title: "Bank Account System",
      content: `## Project: Bank Account System

Build a complete banking system that handles multiple accounts with deposits, withdrawals, and transfers.

### Requirements

1. **BankAccount class** with:
   - Account number (auto-generated)
   - Owner name
   - Balance (private set)
   - Transaction history (list of strings)

2. **Methods:**
   - \`Deposit(amount)\` — adds funds, records transaction
   - \`Withdraw(amount)\` — removes funds if sufficient, records transaction
   - \`Transfer(amount, targetAccount)\` — transfers between accounts
   - \`GetStatement()\` — returns formatted transaction history

3. **Bank class** that manages multiple accounts:
   - \`CreateAccount(owner, initialDeposit)\`
   - \`GetAccount(accountNumber)\`
   - \`GetTotalAssets()\` — sum of all account balances

### Design Tips

- Use \`private set\` on Balance to prevent direct modification
- Store transactions with timestamps
- Validate all inputs (no negative amounts, sufficient funds for withdrawals)
- Use \`List<string>\` for transaction history

### Example Output

\`\`\`
=== Bank Statement for Alice (ACC-1001) ===
  [2024-01-15 10:00] DEPOSIT: +$1000.00 | Balance: $1000.00
  [2024-01-15 10:01] WITHDRAWAL: -$200.00 | Balance: $800.00
  [2024-01-15 10:02] TRANSFER OUT: -$300.00 to ACC-1002 | Balance: $500.00
Current Balance: $500.00
\`\`\``,
      starterCode: `using System;
using System.Collections.Generic;

class BankAccount
{
    private static int nextAccountNumber = 1001;

    public string AccountNumber { get; private set; }
    public string Owner { get; private set; }
    public decimal Balance { get; private set; }
    private List<string> transactions = new List<string>();

    public BankAccount(string owner, decimal initialDeposit)
    {
        // TODO: Initialize account number (ACC-1001, ACC-1002, etc.)
        // TODO: Set owner and initial balance
        // TODO: Record the initial deposit transaction
    }

    public void Deposit(decimal amount)
    {
        // TODO: Validate amount > 0
        // TODO: Add to balance
        // TODO: Record transaction with timestamp
    }

    public void Withdraw(decimal amount)
    {
        // TODO: Validate amount > 0
        // TODO: Check sufficient funds
        // TODO: Subtract from balance
        // TODO: Record transaction
    }

    public void Transfer(decimal amount, BankAccount target)
    {
        // TODO: Validate amount and funds
        // TODO: Withdraw from this account
        // TODO: Deposit to target account
        // TODO: Record transfer transactions on both accounts
    }

    public void PrintStatement()
    {
        // TODO: Print formatted statement with all transactions
    }
}

class Bank
{
    private List<BankAccount> accounts = new List<BankAccount>();

    public BankAccount CreateAccount(string owner, decimal initialDeposit)
    {
        // TODO: Create and store new account, return it
        return null;
    }

    public decimal GetTotalAssets()
    {
        // TODO: Sum all account balances
        return 0;
    }
}

class Program
{
    static void Main()
    {
        Bank bank = new Bank();

        // Create accounts for Alice ($1000) and Bob ($500)
        // Alice deposits $500
        // Bob withdraws $100
        // Alice transfers $300 to Bob
        // Print statements for both accounts
        // Print total bank assets
    }
}`,
      solutionCode: `using System;
using System.Collections.Generic;
using System.Linq;

class BankAccount
{
    private static int nextAccountNumber = 1001;

    public string AccountNumber { get; private set; }
    public string Owner { get; private set; }
    public decimal Balance { get; private set; }
    private List<string> transactions = new List<string>();

    public BankAccount(string owner, decimal initialDeposit)
    {
        AccountNumber = $"ACC-{nextAccountNumber++}";
        Owner = owner;
        Balance = initialDeposit;
        RecordTransaction($"INITIAL DEPOSIT: +\${initialDeposit:F2}");
    }

    private void RecordTransaction(string description)
    {
        string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        transactions.Add($"[{timestamp}] {description} | Balance: \${Balance:F2}");
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Error: Deposit amount must be positive.");
            return;
        }
        Balance += amount;
        RecordTransaction($"DEPOSIT: +\${amount:F2}");
        Console.WriteLine($"Deposited \${amount:F2} to {AccountNumber}");
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Error: Withdrawal amount must be positive.");
            return;
        }
        if (amount > Balance)
        {
            Console.WriteLine($"Error: Insufficient funds. Balance: \${Balance:F2}, Requested: \${amount:F2}");
            return;
        }
        Balance -= amount;
        RecordTransaction($"WITHDRAWAL: -\${amount:F2}");
        Console.WriteLine($"Withdrew \${amount:F2} from {AccountNumber}");
    }

    public void Transfer(decimal amount, BankAccount target)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Error: Transfer amount must be positive.");
            return;
        }
        if (amount > Balance)
        {
            Console.WriteLine($"Error: Insufficient funds for transfer.");
            return;
        }
        Balance -= amount;
        RecordTransaction($"TRANSFER OUT: -\${amount:F2} to {target.AccountNumber}");

        target.Balance += amount;
        target.RecordTransaction($"TRANSFER IN: +\${amount:F2} from {AccountNumber}");

        Console.WriteLine($"Transferred \${amount:F2} from {AccountNumber} to {target.AccountNumber}");
    }

    public void PrintStatement()
    {
        Console.WriteLine($"\\n=== Bank Statement for {Owner} ({AccountNumber}) ===");
        foreach (string t in transactions)
        {
            Console.WriteLine($"  {t}");
        }
        Console.WriteLine($"Current Balance: \${Balance:F2}");
    }
}

class Bank
{
    private List<BankAccount> accounts = new List<BankAccount>();

    public BankAccount CreateAccount(string owner, decimal initialDeposit)
    {
        BankAccount account = new BankAccount(owner, initialDeposit);
        accounts.Add(account);
        Console.WriteLine($"Created account {account.AccountNumber} for {owner}");
        return account;
    }

    public decimal GetTotalAssets()
    {
        return accounts.Sum(a => a.Balance);
    }
}

class Program
{
    static void Main()
    {
        Bank bank = new Bank();

        BankAccount alice = bank.CreateAccount("Alice", 1000m);
        BankAccount bob = bank.CreateAccount("Bob", 500m);

        Console.WriteLine();
        alice.Deposit(500m);
        bob.Withdraw(100m);
        alice.Transfer(300m, bob);

        alice.PrintStatement();
        bob.PrintStatement();

        Console.WriteLine($"\\nTotal Bank Assets: \${bank.GetTotalAssets():F2}");
    }
}`,
    },
    {
      id: "csharp-project-grades",
      slug: "csharp-project-grades",
      title: "Student Grade Tracker",
      content: `## Project: Student Grade Tracker

Build a system to track student grades across multiple subjects, calculate averages, and generate report cards.

### Requirements

1. **Student class:**
   - Name, student ID
   - Dictionary of subject grades: \`Dictionary<string, List<double>>\`
   - Methods: \`AddGrade\`, \`GetSubjectAverage\`, \`GetOverallGPA\`, \`GetReportCard\`

2. **Classroom class:**
   - List of students
   - Methods: \`GetTopStudent\`, \`GetClassAverage\`, \`GetSubjectRanking\`

3. **Grading scale:**
   - A: 90-100
   - B: 80-89
   - C: 70-79
   - D: 60-69
   - F: Below 60

### Features to Implement

- Add multiple grades per subject
- Calculate weighted or simple averages
- Generate formatted report cards
- Rank students by GPA
- Find the class average per subject`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name { get; private set; }
    public string StudentId { get; private set; }
    private Dictionary<string, List<double>> grades = new Dictionary<string, List<double>>();

    public Student(string name, string studentId)
    {
        // TODO: Initialize properties
    }

    public void AddGrade(string subject, double grade)
    {
        // TODO: Validate grade (0-100)
        // TODO: Add grade to the subject's list
        // TODO: Create the subject list if it doesn't exist
    }

    public double GetSubjectAverage(string subject)
    {
        // TODO: Return the average for a subject
        // TODO: Return 0 if subject not found
        return 0;
    }

    public double GetOverallGPA()
    {
        // TODO: Return the average across all subjects
        return 0;
    }

    public static string GetLetterGrade(double average)
    {
        // TODO: Convert numeric average to letter grade (A/B/C/D/F)
        return "";
    }

    public void PrintReportCard()
    {
        // TODO: Print formatted report card with:
        //   - Student name and ID
        //   - Each subject with average and letter grade
        //   - Overall GPA
    }
}

class Classroom
{
    private List<Student> students = new List<Student>();

    public void AddStudent(Student student)
    {
        // TODO: Add student to list
    }

    public Student GetTopStudent()
    {
        // TODO: Return the student with the highest GPA
        return null;
    }

    public void PrintClassRanking()
    {
        // TODO: Print all students ranked by GPA (highest first)
    }
}

class Program
{
    static void Main()
    {
        // Create a Classroom with 3 students
        // Add grades for Math, Science, and English
        // Print each student's report card
        // Print the class ranking
    }
}`,
      solutionCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name { get; private set; }
    public string StudentId { get; private set; }
    private Dictionary<string, List<double>> grades = new Dictionary<string, List<double>>();

    public Student(string name, string studentId)
    {
        Name = name;
        StudentId = studentId;
    }

    public void AddGrade(string subject, double grade)
    {
        if (grade < 0 || grade > 100)
        {
            Console.WriteLine($"Invalid grade: {grade}. Must be 0-100.");
            return;
        }
        if (!grades.ContainsKey(subject))
        {
            grades[subject] = new List<double>();
        }
        grades[subject].Add(grade);
    }

    public double GetSubjectAverage(string subject)
    {
        if (!grades.ContainsKey(subject) || grades[subject].Count == 0)
            return 0;
        return Math.Round(grades[subject].Average(), 1);
    }

    public double GetOverallGPA()
    {
        if (grades.Count == 0) return 0;
        double total = grades.Values.Sum(g => g.Average());
        return Math.Round(total / grades.Count, 1);
    }

    public static string GetLetterGrade(double average)
    {
        if (average >= 90) return "A";
        if (average >= 80) return "B";
        if (average >= 70) return "C";
        if (average >= 60) return "D";
        return "F";
    }

    public void PrintReportCard()
    {
        Console.WriteLine($"\\n{'='} Report Card: {Name} ({StudentId}) {'='}");
        Console.WriteLine($"  {"Subject",-15} {"Average",-10} {"Grade",-5}");
        Console.WriteLine($"  {new string('-', 30)}");

        foreach (var subject in grades.Keys.OrderBy(k => k))
        {
            double avg = GetSubjectAverage(subject);
            string letter = GetLetterGrade(avg);
            Console.WriteLine($"  {subject,-15} {avg,-10:F1} {letter,-5}");
        }

        double gpa = GetOverallGPA();
        Console.WriteLine($"  {new string('-', 30)}");
        Console.WriteLine($"  {"Overall GPA",-15} {gpa,-10:F1} {GetLetterGrade(gpa),-5}");
    }
}

class Classroom
{
    private List<Student> students = new List<Student>();

    public void AddStudent(Student student)
    {
        students.Add(student);
    }

    public Student GetTopStudent()
    {
        return students.OrderByDescending(s => s.GetOverallGPA()).FirstOrDefault();
    }

    public void PrintClassRanking()
    {
        Console.WriteLine("\\n=== Class Ranking ===");
        var ranked = students.OrderByDescending(s => s.GetOverallGPA()).ToList();
        for (int i = 0; i < ranked.Count; i++)
        {
            double gpa = ranked[i].GetOverallGPA();
            Console.WriteLine($"  {i + 1}. {ranked[i].Name} - GPA: {gpa:F1} ({Student.GetLetterGrade(gpa)})");
        }
    }
}

class Program
{
    static void Main()
    {
        Classroom classroom = new Classroom();

        Student alice = new Student("Alice Johnson", "S001");
        alice.AddGrade("Math", 95);
        alice.AddGrade("Math", 88);
        alice.AddGrade("Science", 92);
        alice.AddGrade("Science", 96);
        alice.AddGrade("English", 85);
        alice.AddGrade("English", 90);

        Student bob = new Student("Bob Smith", "S002");
        bob.AddGrade("Math", 78);
        bob.AddGrade("Math", 82);
        bob.AddGrade("Science", 70);
        bob.AddGrade("Science", 75);
        bob.AddGrade("English", 88);
        bob.AddGrade("English", 92);

        Student carol = new Student("Carol White", "S003");
        carol.AddGrade("Math", 90);
        carol.AddGrade("Math", 93);
        carol.AddGrade("Science", 88);
        carol.AddGrade("Science", 85);
        carol.AddGrade("English", 95);
        carol.AddGrade("English", 98);

        classroom.AddStudent(alice);
        classroom.AddStudent(bob);
        classroom.AddStudent(carol);

        alice.PrintReportCard();
        bob.PrintReportCard();
        carol.PrintReportCard();

        classroom.PrintClassRanking();

        Student top = classroom.GetTopStudent();
        Console.WriteLine($"\\nTop Student: {top.Name} with GPA {top.GetOverallGPA():F1}");
    }
}`,
    },
    {
      id: "csharp-project-inventory",
      slug: "csharp-project-inventory",
      title: "Inventory Management System",
      content: `## Project: Inventory Management System

Build a complete inventory management system for a store with products, categories, and stock tracking.

### Requirements

1. **Product class:**
   - Id, Name, Category, Price, Quantity
   - Methods: \`Restock\`, \`Sell\`, \`GetTotalValue\`

2. **Inventory class using LINQ:**
   - Add/remove products
   - Search by name or category
   - Get low-stock alerts (below threshold)
   - Generate inventory reports with totals
   - Sort and filter using LINQ

3. **Features:**
   - Prevent selling more than available stock
   - Track total inventory value
   - Category-based reporting
   - Find most/least valuable products

### This project combines:
- Classes and OOP
- Collections (List, Dictionary)
- LINQ queries
- Error handling
- String formatting`,
      starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    private static int nextId = 1;

    public int Id { get; private set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; private set; }

    public Product(string name, string category, decimal price, int quantity)
    {
        // TODO: Auto-assign Id, set all properties
    }

    public decimal GetTotalValue()
    {
        // TODO: Return Price * Quantity
        return 0;
    }

    public void Restock(int amount)
    {
        // TODO: Validate amount > 0, increase quantity
    }

    public bool Sell(int amount)
    {
        // TODO: Validate amount, check stock, decrease quantity
        // Return true if successful, false if insufficient stock
        return false;
    }

    public override string ToString()
    {
        // TODO: Return formatted product string
        return "";
    }
}

class Inventory
{
    private List<Product> products = new List<Product>();

    public void AddProduct(Product product)
    {
        // TODO: Add product to list
    }

    public List<Product> SearchByName(string query)
    {
        // TODO: Use LINQ to find products whose name contains the query (case-insensitive)
        return new List<Product>();
    }

    public List<Product> GetByCategory(string category)
    {
        // TODO: Use LINQ to filter by category
        return new List<Product>();
    }

    public List<Product> GetLowStock(int threshold = 10)
    {
        // TODO: Use LINQ to find products with quantity below threshold
        return new List<Product>();
    }

    public void PrintInventoryReport()
    {
        // TODO: Print a formatted report with:
        //   - All products sorted by category then name
        //   - Total products count
        //   - Total inventory value
        //   - Value per category
        //   - Most and least expensive products
    }
}

class Program
{
    static void Main()
    {
        Inventory inventory = new Inventory();

        // Add at least 8 products across 3 categories
        // Sell some items
        // Restock some items
        // Search for a product by name
        // Print low stock alerts
        // Print the full inventory report
    }
}`,
      solutionCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    private static int nextId = 1;

    public int Id { get; private set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; private set; }

    public Product(string name, string category, decimal price, int quantity)
    {
        Id = nextId++;
        Name = name;
        Category = category;
        Price = price;
        Quantity = quantity;
    }

    public decimal GetTotalValue()
    {
        return Price * Quantity;
    }

    public void Restock(int amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Restock amount must be positive.");
            return;
        }
        Quantity += amount;
        Console.WriteLine($"Restocked {Name}: +{amount} (now {Quantity})");
    }

    public bool Sell(int amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Sell amount must be positive.");
            return false;
        }
        if (amount > Quantity)
        {
            Console.WriteLine($"Cannot sell {amount}x {Name}. Only {Quantity} in stock.");
            return false;
        }
        Quantity -= amount;
        Console.WriteLine($"Sold {amount}x {Name} (remaining: {Quantity})");
        return true;
    }

    public override string ToString()
    {
        return $"[{Id}] {Name} ({Category}) - \${Price:F2} x {Quantity} = \${GetTotalValue():F2}";
    }
}

class Inventory
{
    private List<Product> products = new List<Product>();

    public void AddProduct(Product product)
    {
        products.Add(product);
    }

    public List<Product> SearchByName(string query)
    {
        return products
            .Where(p => p.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public List<Product> GetByCategory(string category)
    {
        return products
            .Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public List<Product> GetLowStock(int threshold = 10)
    {
        return products
            .Where(p => p.Quantity < threshold)
            .OrderBy(p => p.Quantity)
            .ToList();
    }

    public void PrintInventoryReport()
    {
        Console.WriteLine("\\n{'=','=','=','='} INVENTORY REPORT {'=','=','=','='}\\n");

        var sorted = products.OrderBy(p => p.Category).ThenBy(p => p.Name);
        string currentCategory = "";

        foreach (Product p in sorted)
        {
            if (p.Category != currentCategory)
            {
                currentCategory = p.Category;
                Console.WriteLine($"\\n  --- {currentCategory} ---");
            }
            Console.WriteLine($"    {p}");
        }

        Console.WriteLine($"\\n  Total Products: {products.Count}");
        Console.WriteLine($"  Total Inventory Value: \${products.Sum(p => p.GetTotalValue()):F2}");

        Console.WriteLine("\\n  Value by Category:");
        var categoryGroups = products.GroupBy(p => p.Category);
        foreach (var group in categoryGroups.OrderBy(g => g.Key))
        {
            decimal catValue = group.Sum(p => p.GetTotalValue());
            Console.WriteLine($"    {group.Key}: \${catValue:F2} ({group.Count()} products)");
        }

        var mostExpensive = products.OrderByDescending(p => p.Price).First();
        var leastExpensive = products.OrderBy(p => p.Price).First();
        Console.WriteLine($"\\n  Most Expensive: {mostExpensive.Name} (\${mostExpensive.Price:F2})");
        Console.WriteLine($"  Least Expensive: {leastExpensive.Name} (\${leastExpensive.Price:F2})");
    }
}

class Program
{
    static void Main()
    {
        Inventory inventory = new Inventory();

        inventory.AddProduct(new Product("Laptop", "Electronics", 999.99m, 25));
        inventory.AddProduct(new Product("Mouse", "Electronics", 29.99m, 150));
        inventory.AddProduct(new Product("Keyboard", "Electronics", 79.99m, 8));
        inventory.AddProduct(new Product("Desk", "Furniture", 249.99m, 15));
        inventory.AddProduct(new Product("Chair", "Furniture", 199.99m, 20));
        inventory.AddProduct(new Product("Lamp", "Furniture", 49.99m, 5));
        inventory.AddProduct(new Product("Notebook", "Stationery", 4.99m, 200));
        inventory.AddProduct(new Product("Pen Set", "Stationery", 12.99m, 3));

        Console.WriteLine("=== Transactions ===");
        inventory.SearchByName("Laptop").FirstOrDefault()?.Sell(5);
        inventory.SearchByName("Mouse").FirstOrDefault()?.Sell(30);
        inventory.SearchByName("Pen Set").FirstOrDefault()?.Restock(50);
        inventory.SearchByName("Lamp").FirstOrDefault()?.Sell(10);

        Console.WriteLine("\\n=== Search Results for 'key' ===");
        var results = inventory.SearchByName("key");
        foreach (var p in results)
            Console.WriteLine($"  {p}");

        Console.WriteLine("\\n=== Low Stock Alert (< 10) ===");
        var lowStock = inventory.GetLowStock(10);
        foreach (var p in lowStock)
            Console.WriteLine($"  WARNING: {p.Name} - only {p.Quantity} left!");

        inventory.PrintInventoryReport();
    }
}`,
    },
  ],
};
