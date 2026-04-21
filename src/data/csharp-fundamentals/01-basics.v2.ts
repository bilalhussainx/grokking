import { Module } from "../types";

export const csharpBasicsModule: Module = {
  id: "csharp-basics",
  title: "C# Basics",
  description: "Get started with C# programming — write your first program, learn about variables, types, operators, and type conversions.",
  lessons: [
    {
      id: "csharp-hello-world",
      slug: "csharp-hello-world",
      title: "Hello World & Setup",
      content: `## Your First C# Program

Every C# journey starts with the classic **Hello World** program. Let's understand its structure.

### The Simplest C# Program

\`\`\`csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}
\`\`\`

### Breaking It Down

| Part | Purpose |
|------|---------|
| \`using System;\` | Imports the System namespace (gives us \`Console\`) |
| \`class Program\` | Every C# program lives inside a class |
| \`static void Main()\` | The entry point — where your program starts running |
| \`Console.WriteLine()\` | Prints text to the console and adds a new line |

### Console.Write vs Console.WriteLine

- \`Console.WriteLine("Hi")\` — prints text **with** a newline at the end
- \`Console.Write("Hi")\` — prints text **without** a newline

\`\`\`csharp
Console.Write("Hello, ");
Console.WriteLine("World!");
// Output: Hello, World!
\`\`\`

### Reading User Input

Use \`Console.ReadLine()\` to get input from the user:

\`\`\`csharp
Console.Write("What is your name? ");
string name = Console.ReadLine();
Console.WriteLine("Hello, " + name + "!");
\`\`\`

### String Interpolation

Instead of concatenating with \`+\`, use \`$\` for cleaner string formatting:

\`\`\`csharp
string name = "Alice";
int age = 25;
Console.WriteLine($"My name is {name} and I am {age} years old.");
\`\`\`

### Your Task

Write a program that:
1. Asks the user for their name
2. Asks the user for their favorite language
3. Prints a greeting using string interpolation`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        // Step 1: Print "What is your name? " and read input

        // Step 2: Print "What is your favorite language? " and read input

        // Step 3: Print "Hello, [name]! You love [language]!" using string interpolation

    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        Console.Write("What is your name? ");
        string name = Console.ReadLine();

        Console.Write("What is your favorite language? ");
        string language = Console.ReadLine();

        Console.WriteLine($"Hello, {name}! You love {language}!");
    }
}`,
    },
    {
      id: "csharp-variables-types",
      slug: "csharp-variables-types",
      title: "Variables & Data Types",
      content: `## Variables & Data Types in C#

C# is a **statically typed** language — every variable must have a declared type, and that type cannot change.

### Declaring Variables

\`\`\`csharp
int age = 25;
double price = 19.99;
string name = "Alice";
bool isActive = true;
char grade = 'A';
\`\`\`

### Common Data Types

| Type | Size | Range / Example |
|------|------|-----------------|
| \`int\` | 4 bytes | -2.1B to 2.1B |
| \`long\` | 8 bytes | Very large integers |
| \`float\` | 4 bytes | \`3.14f\` (note the \`f\` suffix) |
| \`double\` | 8 bytes | \`3.14\` (default decimal type) |
| \`decimal\` | 16 bytes | \`19.99m\` (best for money) |
| \`bool\` | 1 byte | \`true\` or \`false\` |
| \`char\` | 2 bytes | Single character: \`'A'\` |
| \`string\` | varies | Text: \`"Hello"\` |

### The \`var\` Keyword

C# can **infer** the type when you initialize a variable:

\`\`\`csharp
var age = 25;          // int
var name = "Alice";    // string
var price = 9.99;      // double
\`\`\`

The type is still fixed — \`var\` just lets the compiler figure it out.

### Constants

Use \`const\` for values that never change:

\`\`\`csharp
const double Pi = 3.14159;
const int MaxRetries = 3;
// Pi = 3.0; // ERROR — cannot reassign a constant
\`\`\`

### Default Values

Uninitialized fields get default values:
- \`int\` → \`0\`
- \`double\` → \`0.0\`
- \`bool\` → \`false\`
- \`string\` → \`null\`

### Your Task

Declare variables to represent a product in an online store, then print all the product details.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        // Declare the following variables:
        // productName (string) = "Wireless Mouse"
        // price (decimal) = 29.99m
        // quantity (int) = 150
        // isInStock (bool) = true
        // rating (double) = 4.7

        // Calculate totalValue = price * quantity

        // Print all details using string interpolation:
        // "Product: Wireless Mouse"
        // "Price: $29.99"
        // "Quantity: 150"
        // "In Stock: True"
        // "Rating: 4.7/5"
        // "Total Value: $4498.50"
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        string productName = "Wireless Mouse";
        decimal price = 29.99m;
        int quantity = 150;
        bool isInStock = true;
        double rating = 4.7;

        decimal totalValue = price * quantity;

        Console.WriteLine($"Product: {productName}");
        Console.WriteLine($"Price: \${price}");
        Console.WriteLine($"Quantity: {quantity}");
        Console.WriteLine($"In Stock: {isInStock}");
        Console.WriteLine($"Rating: {rating}/5");
        Console.WriteLine($"Total Value: \${totalValue}");
    }
}`,
    },
    {
      id: "csharp-operators",
      slug: "csharp-operators",
      title: "Operators & Expressions",
      content: `## Operators & Expressions

Operators let you perform calculations, comparisons, and logical decisions in C#.

### Arithmetic Operators

\`\`\`csharp
int a = 10, b = 3;
Console.WriteLine(a + b);   // 13   Addition
Console.WriteLine(a - b);   // 7    Subtraction
Console.WriteLine(a * b);   // 30   Multiplication
Console.WriteLine(a / b);   // 3    Integer division (truncates)
Console.WriteLine(a % b);   // 1    Modulus (remainder)
\`\`\`

**Watch out:** Integer division truncates! \`10 / 3\` gives \`3\`, not \`3.33\`.

To get a decimal result, at least one operand must be a floating-point type:

\`\`\`csharp
Console.WriteLine(10.0 / 3);   // 3.3333...
Console.WriteLine((double)10 / 3);  // 3.3333...
\`\`\`

### Comparison Operators

\`\`\`csharp
Console.WriteLine(5 == 5);   // True
Console.WriteLine(5 != 3);   // True
Console.WriteLine(5 > 3);    // True
Console.WriteLine(5 < 3);    // False
Console.WriteLine(5 >= 5);   // True
Console.WriteLine(5 <= 4);   // False
\`\`\`

### Logical Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`&&\` | AND | \`true && false\` → \`false\` |
| \`\\|\\|\` | OR | \`true \\|\\| false\` → \`true\` |
| \`!\` | NOT | \`!true\` → \`false\` |

### Assignment Operators

\`\`\`csharp
int x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x %= 4;   // x = 2
\`\`\`

### Increment & Decrement

\`\`\`csharp
int count = 5;
count++;   // 6  (post-increment)
count--;   // 5  (post-decrement)
++count;   // 6  (pre-increment)
\`\`\`

### Your Task

Build a simple calculator that takes two numbers and performs all arithmetic operations.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        double num1 = 25;
        double num2 = 7;

        // Calculate and print:
        // "25 + 7 = 32"
        // "25 - 7 = 18"
        // "25 * 7 = 175"
        // "25 / 7 = 3.5714..." (use Math.Round to 2 decimal places)
        // "25 % 7 = 4"

        // Also determine and print:
        // "Is num1 greater than num2? True"
        // "Is num1 equal to num2? False"
        // "Are both positive? True" (use && operator)
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        double num1 = 25;
        double num2 = 7;

        Console.WriteLine($"{num1} + {num2} = {num1 + num2}");
        Console.WriteLine($"{num1} - {num2} = {num1 - num2}");
        Console.WriteLine($"{num1} * {num2} = {num1 * num2}");
        Console.WriteLine($"{num1} / {num2} = {Math.Round(num1 / num2, 2)}");
        Console.WriteLine($"{num1} % {num2} = {num1 % num2}");

        Console.WriteLine($"Is num1 greater than num2? {num1 > num2}");
        Console.WriteLine($"Is num1 equal to num2? {num1 == num2}");
        Console.WriteLine($"Are both positive? {num1 > 0 && num2 > 0}");
    }
}`,
    },
    {
      id: "csharp-type-casting",
      slug: "csharp-type-casting",
      title: "Type Casting & Conversion",
      content: `## Type Casting & Conversion

C# is strict about types. You often need to convert between them explicitly.

### Implicit Casting (Automatic)

C# automatically converts when there's **no risk of data loss** (smaller → larger type):

\`\`\`csharp
int num = 42;
double result = num;      // int → double (safe, automatic)
long bigNum = num;         // int → long (safe, automatic)
\`\`\`

### Explicit Casting (Manual)

When you might **lose data**, you must cast explicitly:

\`\`\`csharp
double pi = 3.14159;
int rounded = (int)pi;    // 3 — decimal part is lost!

long big = 1000000;
int smaller = (int)big;   // Works if value fits in int
\`\`\`

### Parsing Strings to Numbers

Use \`int.Parse()\`, \`double.Parse()\`, etc.:

\`\`\`csharp
string input = "42";
int number = int.Parse(input);        // 42
double price = double.Parse("19.99"); // 19.99
\`\`\`

**Problem:** \`Parse\` throws an exception if the string is not valid.

### Safe Parsing with TryParse

\`TryParse\` returns \`true\`/\`false\` instead of throwing:

\`\`\`csharp
string input = "abc";
bool success = int.TryParse(input, out int result);
// success = false, result = 0
\`\`\`

### Convert Class

The \`Convert\` class handles many conversions:

\`\`\`csharp
string s = "123";
int n = Convert.ToInt32(s);
double d = Convert.ToDouble(s);
bool b = Convert.ToBoolean("true");
string back = Convert.ToString(42);
\`\`\`

### ToString()

Every type has \`ToString()\`:

\`\`\`csharp
int age = 25;
string text = age.ToString();      // "25"
double pi = 3.14159;
string formatted = pi.ToString("F2");  // "3.14" (2 decimal places)
\`\`\`

### Your Task

Write a temperature converter that converts between Celsius and Fahrenheit using proper type handling.`,
      starterCode: `using System;

class Program
{
    static void Main()
    {
        // Given a temperature string in Celsius:
        string celsiusInput = "37.5";

        // Step 1: Parse the string to a double

        // Step 2: Convert to Fahrenheit using: F = (C * 9/5) + 32

        // Step 3: Cast the Fahrenheit result to an int (truncate)

        // Step 4: Print all three values:
        // "Celsius (string): 37.5"
        // "Fahrenheit (double): 99.5"
        // "Fahrenheit (int): 99"

        // Step 5: Try parsing an invalid string "not_a_number"
        // Print whether the parse succeeded or failed
    }
}`,
      solutionCode: `using System;

class Program
{
    static void Main()
    {
        string celsiusInput = "37.5";

        double celsius = double.Parse(celsiusInput);
        double fahrenheit = (celsius * 9.0 / 5.0) + 32;
        int fahrenheitInt = (int)fahrenheit;

        Console.WriteLine($"Celsius (string): {celsiusInput}");
        Console.WriteLine($"Fahrenheit (double): {fahrenheit}");
        Console.WriteLine($"Fahrenheit (int): {fahrenheitInt}");

        string invalid = "not_a_number";
        bool success = double.TryParse(invalid, out double parsed);
        Console.WriteLine($"Parsing \\"{invalid}\\": Success = {success}, Value = {parsed}");
    }
}`,
    },
  ],
};
