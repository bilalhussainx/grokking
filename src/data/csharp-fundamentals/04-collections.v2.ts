import { Module } from "../types";

export const collectionsModule: Module = {
  id: "csharp-collections",
  title: "Collections",
  description: "Work with C# collections — arrays, List<T>, Dictionary, HashSet, and LINQ for querying data.",
  lessons: [
    {
      id: "csharp-list-arrays",
      slug: "csharp-list-arrays",
      title: "List<T> & Arrays",
      content: `## Arrays and Lists

### Arrays

Arrays have a **fixed size** and hold elements of the same type:

\`\`\`csharp
// Declare and initialize
int[] numbers = { 10, 20, 30, 40, 50 };
string[] names = new string[3]; // empty array of size 3

// Access by index (0-based)
Console.WriteLine(numbers[0]); // 10
names[0] = "Alice";

// Array length
Console.WriteLine(numbers.Length); // 5
\`\`\`

### Common Array Operations

\`\`\`csharp
int[] nums = { 5, 2, 8, 1, 9 };

Array.Sort(nums);           // {1, 2, 5, 8, 9}
Array.Reverse(nums);        // {9, 8, 5, 2, 1}
int index = Array.IndexOf(nums, 5); // 2
bool exists = Array.Exists(nums, x => x > 7); // true
\`\`\`

### List<T> — Dynamic Arrays

\`List<T>\` is like an array that can **grow and shrink**:

\`\`\`csharp
using System.Collections.Generic;

List<string> fruits = new List<string>();
fruits.Add("Apple");
fruits.Add("Banana");
fruits.Add("Cherry");

Console.WriteLine(fruits[0]);     // "Apple"
Console.WriteLine(fruits.Count);  // 3

fruits.Remove("Banana");          // Remove by value
fruits.RemoveAt(0);               // Remove by index
fruits.Insert(0, "Avocado");      // Insert at position

bool has = fruits.Contains("Cherry"); // true
\`\`\`

### Initializing a List

\`\`\`csharp
List<int> scores = new List<int> { 95, 87, 92, 78, 100 };

// Or from an array
int[] arr = { 1, 2, 3 };
List<int> list = new List<int>(arr);
\`\`\`

### Iterating

\`\`\`csharp
List<string> colors = new List<string> { "Red", "Green", "Blue" };

// foreach
foreach (string color in colors)
    Console.WriteLine(color);

// for loop with index
for (int i = 0; i < colors.Count; i++)
    Console.WriteLine($"{i}: {colors[i]}");
\`\`\`

### Useful List Methods

| Method | Description |
|--------|-------------|
| \`Add(item)\` | Append to end |
| \`Insert(index, item)\` | Insert at position |
| \`Remove(item)\` | Remove first match |
| \`RemoveAt(index)\` | Remove by index |
| \`Contains(item)\` | Check existence |
| \`IndexOf(item)\` | Find index |
| \`Sort()\` | Sort in place |
| \`Reverse()\` | Reverse in place |
| \`Clear()\` | Remove all items |

### Your Task

Build a to-do list manager using \`List<string>\`.`,
      starterCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string>();

        // Step 1: Add these tasks: "Buy groceries", "Clean house", "Read book", "Exercise", "Cook dinner"

        // Step 2: Print all tasks with numbers (1. Buy groceries, 2. Clean house, etc.)

        // Step 3: Mark "Clean house" as done (remove it)

        // Step 4: Add "Call dentist" at position index 1 (second item)

        // Step 5: Sort the remaining tasks alphabetically

        // Step 6: Print the updated list with numbers

        // Step 7: Print the total number of tasks remaining
    }
}`,
      solutionCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string>();

        // Step 1
        todos.Add("Buy groceries");
        todos.Add("Clean house");
        todos.Add("Read book");
        todos.Add("Exercise");
        todos.Add("Cook dinner");

        // Step 2
        Console.WriteLine("=== Initial To-Do List ===");
        for (int i = 0; i < todos.Count; i++)
        {
            Console.WriteLine($"{i + 1}. {todos[i]}");
        }

        // Step 3
        todos.Remove("Clean house");

        // Step 4
        todos.Insert(1, "Call dentist");

        // Step 5
        todos.Sort();

        // Step 6
        Console.WriteLine("\\n=== Updated To-Do List ===");
        for (int i = 0; i < todos.Count; i++)
        {
            Console.WriteLine($"{i + 1}. {todos[i]}");
        }

        // Step 7
        Console.WriteLine($"\\nTotal tasks remaining: {todos.Count}");
    }
}`,
    },
    {
      id: "csharp-dictionary-hashset",
      slug: "csharp-dictionary-hashset",
      title: "Dictionary & HashSet",
      content: `## Dictionary<TKey, TValue> & HashSet<T>

### Dictionary — Key-Value Pairs

A \`Dictionary\` maps **unique keys** to values. Think of it like a real dictionary: word → definition.

\`\`\`csharp
using System.Collections.Generic;

Dictionary<string, int> ages = new Dictionary<string, int>();
ages["Alice"] = 30;
ages["Bob"] = 25;
ages.Add("Charlie", 35);

Console.WriteLine(ages["Alice"]); // 30
Console.WriteLine(ages.Count);    // 3
\`\`\`

### Safe Access with TryGetValue

\`\`\`csharp
if (ages.TryGetValue("Dave", out int age))
{
    Console.WriteLine($"Dave is {age}");
}
else
{
    Console.WriteLine("Dave not found");
}
\`\`\`

### Iterating a Dictionary

\`\`\`csharp
foreach (KeyValuePair<string, int> pair in ages)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}");
}

// Or with var:
foreach (var pair in ages)
{
    Console.WriteLine($"{pair.Key} is {pair.Value} years old");
}
\`\`\`

### Common Dictionary Methods

| Method | Description |
|--------|-------------|
| \`Add(key, value)\` | Add new entry (throws if key exists) |
| \`[key] = value\` | Add or update |
| \`Remove(key)\` | Remove by key |
| \`ContainsKey(key)\` | Check if key exists |
| \`ContainsValue(value)\` | Check if value exists |
| \`TryGetValue(key, out val)\` | Safe lookup |
| \`Keys\` | Get all keys |
| \`Values\` | Get all values |

### HashSet<T> — Unique Collections

A \`HashSet\` stores **unique values only**. Duplicates are automatically ignored:

\`\`\`csharp
HashSet<string> tags = new HashSet<string>();
tags.Add("csharp");
tags.Add("dotnet");
tags.Add("csharp"); // Ignored — already exists!

Console.WriteLine(tags.Count);        // 2
Console.WriteLine(tags.Contains("csharp")); // True
\`\`\`

### Set Operations

\`\`\`csharp
HashSet<int> setA = new HashSet<int> { 1, 2, 3, 4, 5 };
HashSet<int> setB = new HashSet<int> { 4, 5, 6, 7, 8 };

setA.IntersectWith(setB);  // {4, 5} — in both
// or
setA.UnionWith(setB);      // {1,2,3,4,5,6,7,8} — in either
// or
setA.ExceptWith(setB);     // {1, 2, 3} — in A but not B
\`\`\`

### Your Task

Build a word frequency counter using Dictionary and a unique-word tracker using HashSet.`,
      starterCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string text = "the cat sat on the mat the cat likes the mat";
        string[] words = text.Split(' ');

        // Step 1: Count the frequency of each word using Dictionary<string, int>
        // Print each word and its count

        // Step 2: Find the most frequent word and its count
        // Print: "Most frequent: 'the' (4 times)"

        // Step 3: Use a HashSet<string> to get all unique words
        // Print: "Unique words: cat, likes, mat, on, sat, the"
        // (sorted alphabetically)

        // Step 4: Create a second text and find words common to both
        string text2 = "the dog sat on the log";
        // Print: "Common words: on, sat, the"
    }
}`,
      solutionCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string text = "the cat sat on the mat the cat likes the mat";
        string[] words = text.Split(' ');

        // Step 1: Word frequency
        Dictionary<string, int> frequency = new Dictionary<string, int>();
        foreach (string word in words)
        {
            if (frequency.ContainsKey(word))
                frequency[word]++;
            else
                frequency[word] = 1;
        }

        Console.WriteLine("=== Word Frequencies ===");
        foreach (var pair in frequency)
        {
            Console.WriteLine($"  {pair.Key}: {pair.Value}");
        }

        // Step 2: Most frequent word
        string mostFrequent = "";
        int maxCount = 0;
        foreach (var pair in frequency)
        {
            if (pair.Value > maxCount)
            {
                mostFrequent = pair.Key;
                maxCount = pair.Value;
            }
        }
        Console.WriteLine($"\\nMost frequent: '{mostFrequent}' ({maxCount} times)");

        // Step 3: Unique words with HashSet
        HashSet<string> uniqueWords = new HashSet<string>(words);
        List<string> sortedUnique = new List<string>(uniqueWords);
        sortedUnique.Sort();
        Console.WriteLine($"\\nUnique words: {string.Join(", ", sortedUnique)}");

        // Step 4: Common words between two texts
        string text2 = "the dog sat on the log";
        string[] words2 = text2.Split(' ');
        HashSet<string> set1 = new HashSet<string>(words);
        HashSet<string> set2 = new HashSet<string>(words2);
        set1.IntersectWith(set2);
        List<string> common = new List<string>(set1);
        common.Sort();
        Console.WriteLine($"\\nCommon words: {string.Join(", ", common)}");
    }
}`,
    },
    {
      id: "csharp-linq-basics",
      slug: "csharp-linq-basics",
      title: "LINQ Basics",
      content: `## LINQ — Language Integrated Query

LINQ lets you query collections using a clean, SQL-like syntax built right into C#.

### Getting Started

\`\`\`csharp
using System;
using System.Linq;
using System.Collections.Generic;
\`\`\`

### Method Syntax (Fluent)

\`\`\`csharp
List<int> numbers = new List<int> { 5, 12, 8, 3, 17, 9, 1, 14 };

// Filter
var evens = numbers.Where(n => n % 2 == 0);        // {12, 8, 14}

// Transform
var doubled = numbers.Select(n => n * 2);           // {10, 24, 16, ...}

// Sort
var sorted = numbers.OrderBy(n => n);               // {1, 3, 5, 8, ...}
var descending = numbers.OrderByDescending(n => n); // {17, 14, 12, ...}

// Aggregate
int sum = numbers.Sum();              // 69
double avg = numbers.Average();       // 8.625
int max = numbers.Max();              // 17
int min = numbers.Min();              // 1
int count = numbers.Count();          // 8
\`\`\`

### Lambda Expressions

The \`=>\` creates a small inline function:

\`\`\`csharp
// n => n > 10 means "given n, return whether n > 10"
var bigNumbers = numbers.Where(n => n > 10).ToList();
\`\`\`

### Chaining Methods

LINQ methods can be chained together:

\`\`\`csharp
var result = numbers
    .Where(n => n > 5)
    .OrderBy(n => n)
    .Select(n => n * 10)
    .ToList();
// {80, 90, 120, 140, 170}
\`\`\`

### Common LINQ Methods

| Method | Description |
|--------|-------------|
| \`Where(predicate)\` | Filter elements |
| \`Select(transform)\` | Transform each element |
| \`OrderBy(key)\` | Sort ascending |
| \`OrderByDescending(key)\` | Sort descending |
| \`First()\` / \`FirstOrDefault()\` | Get first element |
| \`Last()\` / \`LastOrDefault()\` | Get last element |
| \`Any(predicate)\` | True if any match |
| \`All(predicate)\` | True if all match |
| \`Count(predicate)\` | Count matches |
| \`Sum()\` / \`Average()\` / \`Min()\` / \`Max()\` | Aggregates |
| \`Take(n)\` | Take first n elements |
| \`Skip(n)\` | Skip first n elements |
| \`Distinct()\` | Remove duplicates |
| \`ToList()\` / \`ToArray()\` | Convert to List or Array |

### LINQ with Objects

\`\`\`csharp
class Student
{
    public string Name { get; set; }
    public int Grade { get; set; }
}

List<Student> students = new List<Student>
{
    new Student { Name = "Alice", Grade = 92 },
    new Student { Name = "Bob", Grade = 78 },
    new Student { Name = "Carol", Grade = 95 },
    new Student { Name = "Dave", Grade = 65 }
};

var honors = students
    .Where(s => s.Grade >= 90)
    .OrderByDescending(s => s.Grade)
    .Select(s => s.Name)
    .ToList();
// ["Carol", "Alice"]
\`\`\`

### Your Task

Use LINQ to analyze a list of products — filter, sort, aggregate, and transform.`,
      starterCode: `using System;
using System.Linq;
using System.Collections.Generic;

class Product
{
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product { Name = "Laptop", Category = "Electronics", Price = 999.99m, Stock = 25 },
            new Product { Name = "Mouse", Category = "Electronics", Price = 29.99m, Stock = 150 },
            new Product { Name = "Desk", Category = "Furniture", Price = 249.99m, Stock = 40 },
            new Product { Name = "Chair", Category = "Furniture", Price = 199.99m, Stock = 35 },
            new Product { Name = "Monitor", Category = "Electronics", Price = 449.99m, Stock = 60 },
            new Product { Name = "Keyboard", Category = "Electronics", Price = 79.99m, Stock = 100 },
            new Product { Name = "Bookshelf", Category = "Furniture", Price = 149.99m, Stock = 20 },
            new Product { Name = "Headphones", Category = "Electronics", Price = 199.99m, Stock = 75 }
        };

        // 1. Find all electronics under $200, sorted by price ascending
        //    Print each product name and price

        // 2. Get the average price of all products

        // 3. Find the most expensive product (use OrderByDescending + First)

        // 4. Get the total value of all inventory (Price * Stock for each, then sum)

        // 5. Group products by category and print count per category

        // 6. Get the top 3 most stocked products' names as a comma-separated string
    }
}`,
      solutionCode: `using System;
using System.Linq;
using System.Collections.Generic;

class Product
{
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product { Name = "Laptop", Category = "Electronics", Price = 999.99m, Stock = 25 },
            new Product { Name = "Mouse", Category = "Electronics", Price = 29.99m, Stock = 150 },
            new Product { Name = "Desk", Category = "Furniture", Price = 249.99m, Stock = 40 },
            new Product { Name = "Chair", Category = "Furniture", Price = 199.99m, Stock = 35 },
            new Product { Name = "Monitor", Category = "Electronics", Price = 449.99m, Stock = 60 },
            new Product { Name = "Keyboard", Category = "Electronics", Price = 79.99m, Stock = 100 },
            new Product { Name = "Bookshelf", Category = "Furniture", Price = 149.99m, Stock = 20 },
            new Product { Name = "Headphones", Category = "Electronics", Price = 199.99m, Stock = 75 }
        };

        // 1. Electronics under $200
        Console.WriteLine("=== Electronics Under $200 ===");
        var cheapElectronics = products
            .Where(p => p.Category == "Electronics" && p.Price < 200)
            .OrderBy(p => p.Price)
            .ToList();
        foreach (var p in cheapElectronics)
        {
            Console.WriteLine($"  {p.Name}: \${p.Price}");
        }

        // 2. Average price
        decimal avgPrice = products.Average(p => p.Price);
        Console.WriteLine($"\\nAverage price: \${avgPrice:F2}");

        // 3. Most expensive product
        var mostExpensive = products.OrderByDescending(p => p.Price).First();
        Console.WriteLine($"Most expensive: {mostExpensive.Name} (\${mostExpensive.Price})");

        // 4. Total inventory value
        decimal totalValue = products.Sum(p => p.Price * p.Stock);
        Console.WriteLine($"Total inventory value: \${totalValue:F2}");

        // 5. Products per category
        Console.WriteLine("\\n=== Products Per Category ===");
        var grouped = products.GroupBy(p => p.Category);
        foreach (var group in grouped)
        {
            Console.WriteLine($"  {group.Key}: {group.Count()} products");
        }

        // 6. Top 3 most stocked
        var topStocked = products
            .OrderByDescending(p => p.Stock)
            .Take(3)
            .Select(p => p.Name);
        Console.WriteLine($"\\nTop 3 most stocked: {string.Join(", ", topStocked)}");
    }
}`,
    },
  ],
};
