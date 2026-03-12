import { Module } from "../types";

export const controlFlowModule: Module = {
  id: "csharp-control-flow",
  title: "Control Flow",
  description:
    "Master decision-making and repetition in C# — if/else, switch, and all types of loops.",
  lessons: [
    {
      id: "csharp-if-else",
      slug: "csharp-if-else",
      title: "If / Else & Ternary Operator",
      content: `## Conditional Statements

Conditional statements let your program make decisions based on conditions.

### Basic If Statement

\`\`\`csharp
int age = 18;
if (age >= 18)
{
    Console.WriteLine("You are an adult.");
}
\`\`\`

### If-Else

\`\`\`csharp
int temperature = 30;
if (temperature > 25)
{
    Console.WriteLine("It's hot outside!");
}
else
{
    Console.WriteLine("It's cool outside.");
}
\`\`\`

### If-Else If-Else Chain

\`\`\`csharp
int score = 85;
if (score >= 90)
{
    Console.WriteLine("Grade: A");
}
else if (score >= 80)
{
    Console.WriteLine("Grade: B");
}
else if (score >= 70)
{
    Console.WriteLine("Grade: C");
}
else
{
    Console.WriteLine("Grade: F");
}
\`\`\`

### Nested If Statements

\`\`\`csharp
bool hasTicket = true;
int age = 15;

if (hasTicket)
{
    if (age >= 18)
        Console.WriteLine("Welcome to the movie!");
    else
        Console.WriteLine("You need a parent's permission.");
}
else
{
    Console.WriteLine("Please buy a ticket first.");
}
\`\`\`

### The Ternary Operator

A compact way to write simple if-else:

\`\`\`csharp
int age = 20;
string status = age >= 18 ? "Adult" : "Minor";
Console.WriteLine(status);  // "Adult"
\`\`\`

### Your Task

Build a ticket pricing system. Determine the ticket price based on age and whether it is a weekend.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        int age = 15;
        bool isWeekend = true;

        // Pricing rules:
        // Children (0-12): $8 (weekday) or $10 (weekend)
        // Teens (13-17): $12 (weekday) or $15 (weekend)
        // Adults (18-64): $16 (weekday) or $20 (weekend)
        // Seniors (65+): $10 (weekday) or $12 (weekend)

        // Step 1: Determine the base category using if-else if-else
        // Step 2: Apply weekend pricing
        // Step 3: Print: "Age: 15, Weekend: True, Price: $15"

        // Bonus: Use ternary operator to print "Weekend" or "Weekday"
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        int age = 15;
        bool isWeekend = true;

        decimal price;

        if (age <= 12)
        {
            price = isWeekend ? 10m : 8m;
        }
        else if (age <= 17)
        {
            price = isWeekend ? 15m : 12m;
        }
        else if (age <= 64)
        {
            price = isWeekend ? 20m : 16m;
        }
        else
        {
            price = isWeekend ? 12m : 10m;
        }

        string dayType = isWeekend ? "Weekend" : "Weekday";
        Console.WriteLine($"Age: {age}, {dayType}, Price: \${price}");
    }
}`,
    },
    {
      id: "csharp-switch",
      slug: "csharp-switch",
      title: "Switch Statements",
      content: `## Switch Statements

When you have many conditions based on a single value, \`switch\` is cleaner than a long if-else chain.

### Basic Switch

\`\`\`csharp
int day = 3;
switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 2:
        Console.WriteLine("Tuesday");
        break;
    case 3:
        Console.WriteLine("Wednesday");
        break;
    default:
        Console.WriteLine("Other day");
        break;
}
\`\`\`

**Important:** Every \`case\` needs a \`break\` (or \`return\`). Forgetting it causes a compile error in C#.

### Grouping Cases

Multiple cases can share the same code:

\`\`\`csharp
char grade = 'B';
switch (grade)
{
    case 'A':
    case 'B':
        Console.WriteLine("Great job!");
        break;
    case 'C':
        Console.WriteLine("Satisfactory.");
        break;
    case 'D':
    case 'F':
        Console.WriteLine("Needs improvement.");
        break;
    default:
        Console.WriteLine("Invalid grade.");
        break;
}
\`\`\`

### Switch with Strings

\`\`\`csharp
string command = "start";
switch (command.ToLower())
{
    case "start":
        Console.WriteLine("Starting the engine...");
        break;
    case "stop":
        Console.WriteLine("Stopping the engine...");
        break;
    case "status":
        Console.WriteLine("Engine is running.");
        break;
    default:
        Console.WriteLine("Unknown command.");
        break;
}
\`\`\`

### Switch Expressions (C# 8+)

A more concise syntax for returning values:

\`\`\`csharp
int month = 3;
string season = month switch
{
    12 or 1 or 2 => "Winter",
    3 or 4 or 5 => "Spring",
    6 or 7 or 8 => "Summer",
    9 or 10 or 11 => "Autumn",
    _ => "Invalid month"
};
Console.WriteLine(season); // "Spring"
\`\`\`

### Your Task

Build a simple menu-driven calculator using a switch statement.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        double num1 = 20;
        double num2 = 4;
        string operation = "divide";

        // Use a switch statement on "operation" to:
        // "add" -> print "20 + 4 = 24"
        // "subtract" -> print "20 - 4 = 16"
        // "multiply" -> print "20 * 4 = 80"
        // "divide" -> print "20 / 4 = 5" (check for division by zero!)
        // "modulus" -> print "20 % 4 = 0"
        // default -> print "Unknown operation: [operation]"

        // Then use a switch EXPRESSION to get the number of days in a month
        int month = 2;
        int year = 2024;
        // Print "February 2024 has 29 days"
        // (Hint: leap year check for February)
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        double num1 = 20;
        double num2 = 4;
        string operation = "divide";

        switch (operation)
        {
            case "add":
                Console.WriteLine($"{num1} + {num2} = {num1 + num2}");
                break;
            case "subtract":
                Console.WriteLine($"{num1} - {num2} = {num1 - num2}");
                break;
            case "multiply":
                Console.WriteLine($"{num1} * {num2} = {num1 * num2}");
                break;
            case "divide":
                if (num2 != 0)
                    Console.WriteLine($"{num1} / {num2} = {num1 / num2}");
                else
                    Console.WriteLine("Error: Division by zero!");
                break;
            case "modulus":
                Console.WriteLine($"{num1} % {num2} = {num1 % num2}");
                break;
            default:
                Console.WriteLine($"Unknown operation: {operation}");
                break;
        }

        int month = 2;
        int year = 2024;
        int days = month switch
        {
            1 or 3 or 5 or 7 or 8 or 10 or 12 => 31,
            4 or 6 or 9 or 11 => 30,
            2 => DateTime.IsLeapYear(year) ? 29 : 28,
            _ => 0
        };

        string monthName = month switch
        {
            1 => "January", 2 => "February", 3 => "March",
            4 => "April", 5 => "May", 6 => "June",
            7 => "July", 8 => "August", 9 => "September",
            10 => "October", 11 => "November", 12 => "December",
            _ => "Unknown"
        };

        Console.WriteLine($"{monthName} {year} has {days} days");
    }
}`,
    },
    {
      id: "csharp-loops",
      slug: "csharp-loops",
      title: "While, For & Foreach Loops",
      content: `## Loops in C#

Loops let you repeat code. C# offers \`while\`, \`do-while\`, \`for\`, and \`foreach\`.

### While Loop

Repeats **while** a condition is true:

\`\`\`csharp
int count = 1;
while (count <= 5)
{
    Console.WriteLine($"Count: {count}");
    count++;
}
\`\`\`

### Do-While Loop

Runs at least **once**, then checks the condition:

\`\`\`csharp
int number;
do
{
    Console.Write("Enter a positive number: ");
    number = int.Parse(Console.ReadLine());
} while (number <= 0);
\`\`\`

### For Loop

Best when you know **how many times** to repeat:

\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Iteration {i}");
}
\`\`\`

### Foreach Loop

Iterates over every element in a collection:

\`\`\`csharp
string[] fruits = { "Apple", "Banana", "Cherry" };
foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}
\`\`\`

### Break and Continue

- \`break\` — exits the loop entirely
- \`continue\` — skips to the next iteration

\`\`\`csharp
for (int i = 1; i <= 10; i++)
{
    if (i == 5) continue;  // skip 5
    if (i == 8) break;     // stop at 8
    Console.Write($"{i} ");
}
// Output: 1 2 3 4 6 7
\`\`\`

### Nested Loops

\`\`\`csharp
for (int row = 1; row <= 3; row++)
{
    for (int col = 1; col <= 3; col++)
    {
        Console.Write($"({row},{col}) ");
    }
    Console.WriteLine();
}
\`\`\`

### Your Task

Build a number-guessing game and a multiplication table printer using different loop types.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        // PART 1: FizzBuzz (1 to 20) using a for loop
        // For each number:
        //   Divisible by 3 AND 5 -> print "FizzBuzz"
        //   Divisible by 3 only -> print "Fizz"
        //   Divisible by 5 only -> print "Buzz"
        //   Otherwise -> print the number
        // Print all on separate lines

        Console.WriteLine("--- FizzBuzz ---");

        // PART 2: Multiplication table for 7 (1-10) using a while loop
        // Print: "7 x 1 = 7", "7 x 2 = 14", etc.

        Console.WriteLine("\\n--- Multiplication Table for 7 ---");

        // PART 3: Use foreach to find the longest word in an array
        string[] words = { "cat", "elephant", "dog", "hippopotamus", "ant" };
        // Print: "Longest word: hippopotamus (12 characters)"

        Console.WriteLine("\\n--- Longest Word ---");
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("--- FizzBuzz ---");
        for (int i = 1; i <= 20; i++)
        {
            if (i % 3 == 0 && i % 5 == 0)
                Console.WriteLine("FizzBuzz");
            else if (i % 3 == 0)
                Console.WriteLine("Fizz");
            else if (i % 5 == 0)
                Console.WriteLine("Buzz");
            else
                Console.WriteLine(i);
        }

        Console.WriteLine("\\n--- Multiplication Table for 7 ---");
        int n = 1;
        while (n <= 10)
        {
            Console.WriteLine($"7 x {n} = {7 * n}");
            n++;
        }

        Console.WriteLine("\\n--- Longest Word ---");
        string[] words = { "cat", "elephant", "dog", "hippopotamus", "ant" };
        string longest = "";
        foreach (string word in words)
        {
            if (word.Length > longest.Length)
            {
                longest = word;
            }
        }
        Console.WriteLine($"Longest word: {longest} ({longest.Length} characters)");
    }
}`,
    },
  ],
};
