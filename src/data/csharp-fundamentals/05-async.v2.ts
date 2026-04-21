import { Module } from "../types";

export const asyncModule: Module = {
  id: "csharp-async",
  title: "Async Programming",
  description: "Master asynchronous programming in C# — async/await, Task, and robust error handling.",
  lessons: [
    {
      id: "csharp-async-await",
      slug: "csharp-async-await",
      title: "Async / Await Introduction",
      content: `## Async / Await in C#

Asynchronous programming lets your program **do other work while waiting** for slow operations (network calls, file I/O, database queries) instead of blocking.

### Why Async?

Without async, a slow operation **freezes** your program:

\`\`\`csharp
// BLOCKING — the program waits 3 seconds doing nothing
Thread.Sleep(3000);
Console.WriteLine("Done!");
\`\`\`

With async, the program can continue doing other things while waiting.

### The \`async\` and \`await\` Keywords

\`\`\`csharp
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        Console.WriteLine("Starting download...");
        await DownloadFileAsync();
        Console.WriteLine("Download complete!");
    }

    static async Task DownloadFileAsync()
    {
        Console.WriteLine("Downloading...");
        await Task.Delay(2000); // Simulates a 2-second download
        Console.WriteLine("File saved.");
    }
}
\`\`\`

### How It Works

1. \`async\` marks a method as asynchronous
2. \`await\` pauses the method **without blocking the thread** until the awaited task completes
3. The method returns a \`Task\` (or \`Task<T>\` if it returns a value)

### Rules of Async

- An \`async\` method must return \`Task\`, \`Task<T>\`, or \`void\` (events only)
- You can only use \`await\` inside an \`async\` method
- Name async methods with the \`Async\` suffix by convention: \`FetchDataAsync()\`

### Sequential vs. Parallel Execution

\`\`\`csharp
// Sequential — one after the other (4 seconds total)
await Task.Delay(2000);
await Task.Delay(2000);

// Parallel — both at the same time (2 seconds total)
Task t1 = Task.Delay(2000);
Task t2 = Task.Delay(2000);
await Task.WhenAll(t1, t2);
\`\`\`

### Your Task

Create a program that simulates downloading multiple files asynchronously — both sequentially and in parallel — and compare the timing.`,
      starterCode: `using System;
using System.Threading.Tasks;
using System.Diagnostics;

class Program
{
    // Create an async method: SimulateDownloadAsync(string fileName, int milliseconds)
    // It should:
    //   1. Print "[fileName] download started..."
    //   2. await Task.Delay(milliseconds)
    //   3. Print "[fileName] download complete! ([milliseconds]ms)"

    static async Task Main()
    {
        Stopwatch sw = new Stopwatch();

        // PART 1: Sequential downloads
        // Download 3 files one after another:
        //   "report.pdf" (1500ms), "image.png" (1000ms), "data.csv" (2000ms)
        // Measure and print total time
        Console.WriteLine("=== Sequential Downloads ===");
        sw.Start();
        // ... your code here ...
        sw.Stop();
        Console.WriteLine($"Sequential total: {sw.ElapsedMilliseconds}ms\\n");

        // PART 2: Parallel downloads (same 3 files)
        // Start all 3 at once using Task.WhenAll
        // Measure and print total time
        Console.WriteLine("=== Parallel Downloads ===");
        sw.Restart();
        // ... your code here ...
        sw.Stop();
        Console.WriteLine($"Parallel total: {sw.ElapsedMilliseconds}ms");
    }
}`,
      solutionCode: `using System;
using System.Threading.Tasks;
using System.Diagnostics;

class Program
{
    static async Task SimulateDownloadAsync(string fileName, int milliseconds)
    {
        Console.WriteLine($"  {fileName} download started...");
        await Task.Delay(milliseconds);
        Console.WriteLine($"  {fileName} download complete! ({milliseconds}ms)");
    }

    static async Task Main()
    {
        Stopwatch sw = new Stopwatch();

        // PART 1: Sequential
        Console.WriteLine("=== Sequential Downloads ===");
        sw.Start();
        await SimulateDownloadAsync("report.pdf", 1500);
        await SimulateDownloadAsync("image.png", 1000);
        await SimulateDownloadAsync("data.csv", 2000);
        sw.Stop();
        Console.WriteLine($"Sequential total: {sw.ElapsedMilliseconds}ms\\n");

        // PART 2: Parallel
        Console.WriteLine("=== Parallel Downloads ===");
        sw.Restart();
        Task t1 = SimulateDownloadAsync("report.pdf", 1500);
        Task t2 = SimulateDownloadAsync("image.png", 1000);
        Task t3 = SimulateDownloadAsync("data.csv", 2000);
        await Task.WhenAll(t1, t2, t3);
        sw.Stop();
        Console.WriteLine($"Parallel total: {sw.ElapsedMilliseconds}ms");
    }
}`,
    },
    {
      id: "csharp-task",
      slug: "csharp-task",
      title: "Task & Task<T>",
      content: `## Task & Task<T>

### Task — Represents an Async Operation

\`Task\` is the return type for async methods that **don't return a value**:

\`\`\`csharp
async Task DoWorkAsync()
{
    await Task.Delay(1000);
    Console.WriteLine("Work done!");
}
\`\`\`

### Task<T> — Returns a Value

\`Task<T>\` is for async methods that **return a value**:

\`\`\`csharp
async Task<int> CalculateAsync(int x, int y)
{
    await Task.Delay(500); // Simulate processing
    return x + y;
}

// Usage:
int result = await CalculateAsync(5, 3);
Console.WriteLine(result); // 8
\`\`\`

### Creating Tasks

\`\`\`csharp
// From an async method
Task<string> task1 = FetchDataAsync();

// Run synchronous code on a background thread
Task<int> task2 = Task.Run(() =>
{
    // CPU-intensive work here
    int sum = 0;
    for (int i = 0; i < 1000000; i++)
        sum += i;
    return sum;
});

// Completed task (useful for testing or caching)
Task<string> task3 = Task.FromResult("cached value");
\`\`\`

### WhenAll — Wait for Multiple Tasks

\`\`\`csharp
Task<int> t1 = GetScoreAsync("Alice");
Task<int> t2 = GetScoreAsync("Bob");
Task<int> t3 = GetScoreAsync("Carol");

int[] results = await Task.WhenAll(t1, t2, t3);
Console.WriteLine($"Total: {results.Sum()}");
\`\`\`

### WhenAny — First to Finish

\`\`\`csharp
Task<string> fastest = await Task.WhenAny(
    FetchFromServerA(),
    FetchFromServerB()
);
string result = await fastest;
Console.WriteLine($"Fastest result: {result}");
\`\`\`

### Task Status

\`\`\`csharp
Task<int> task = CalculateAsync(5, 3);
Console.WriteLine(task.Status);     // WaitingForActivation
Console.WriteLine(task.IsCompleted); // false

int result = await task;
Console.WriteLine(task.Status);     // RanToCompletion
Console.WriteLine(task.IsCompleted); // true
\`\`\`

### Your Task

Build an async weather service that fetches temperatures from multiple cities in parallel using \`Task<T>\`.`,
      starterCode: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

class Program
{
    // Create: async Task<double> GetTemperatureAsync(string city)
    // Simulate fetching by:
    //   1. Delaying a random time (500-2000ms) — use: new Random().Next(500, 2000)
    //   2. Return a random temperature between -10 and 40
    //   3. Print: "Fetched [city]: [temp]°C"

    // Create: async Task<Dictionary<string, double>> GetAllTemperaturesAsync(string[] cities)
    // Fetch ALL cities in parallel using Task.WhenAll
    // Return a dictionary mapping city name -> temperature

    static async Task Main()
    {
        string[] cities = { "New York", "London", "Tokyo", "Sydney", "Paris" };

        Console.WriteLine("Fetching temperatures...\\n");

        // Call GetAllTemperaturesAsync and store results

        // Print all results sorted by temperature (coldest first)
        // Format: "  Tokyo: 15.3°C"

        // Print the hottest and coldest cities
        // Print the average temperature
    }
}`,
      solutionCode: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static async Task<double> GetTemperatureAsync(string city)
    {
        Random rng = new Random();
        int delay = rng.Next(500, 2000);
        await Task.Delay(delay);
        double temp = Math.Round(rng.NextDouble() * 50 - 10, 1);
        Console.WriteLine($"  Fetched {city}: {temp} C ({delay}ms)");
        return temp;
    }

    static async Task<Dictionary<string, double>> GetAllTemperaturesAsync(string[] cities)
    {
        var tasks = cities.Select(city =>
            GetTemperatureAsync(city).ContinueWith(t => new { City = city, Temp = t.Result })
        ).ToArray();

        var results = await Task.WhenAll(tasks);

        Dictionary<string, double> temps = new Dictionary<string, double>();
        foreach (var r in results)
        {
            temps[r.City] = r.Temp;
        }
        return temps;
    }

    static async Task Main()
    {
        string[] cities = { "New York", "London", "Tokyo", "Sydney", "Paris" };

        Console.WriteLine("Fetching temperatures...\\n");

        Dictionary<string, double> temperatures = await GetAllTemperaturesAsync(cities);

        Console.WriteLine("\\n=== Results (Coldest to Hottest) ===");
        var sorted = temperatures.OrderBy(kv => kv.Value);
        foreach (var kv in sorted)
        {
            Console.WriteLine($"  {kv.Key}: {kv.Value} C");
        }

        var coldest = sorted.First();
        var hottest = sorted.Last();
        double average = temperatures.Values.Average();

        Console.WriteLine($"\\nColdest: {coldest.Key} ({coldest.Value} C)");
        Console.WriteLine($"Hottest: {hottest.Key} ({hottest.Value} C)");
        Console.WriteLine($"Average: {Math.Round(average, 1)} C");
    }
}`,
    },
    {
      id: "csharp-error-handling",
      slug: "csharp-error-handling",
      title: "Error Handling with Try/Catch",
      content: `## Error Handling with Try/Catch

### Why Handle Errors?

Unhandled exceptions **crash your program**. Error handling lets you recover gracefully.

### Basic Try-Catch

\`\`\`csharp
try
{
    int result = 10 / 0; // This throws DivideByZeroException
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
\`\`\`

### Catching Multiple Exception Types

\`\`\`csharp
try
{
    string input = Console.ReadLine();
    int number = int.Parse(input);
    int[] arr = { 1, 2, 3 };
    Console.WriteLine(arr[number]);
}
catch (FormatException)
{
    Console.WriteLine("That's not a valid number!");
}
catch (IndexOutOfRangeException)
{
    Console.WriteLine("Index is out of bounds!");
}
catch (Exception ex)
{
    Console.WriteLine($"Unexpected error: {ex.Message}");
}
\`\`\`

### The Finally Block

\`finally\` runs **no matter what** — even if an exception occurs:

\`\`\`csharp
try
{
    // Open file, read data...
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
finally
{
    Console.WriteLine("Cleanup: closing resources...");
    // Close file, release connections, etc.
}
\`\`\`

### Throwing Exceptions

Use \`throw\` to signal an error:

\`\`\`csharp
void SetAge(int age)
{
    if (age < 0 || age > 150)
        throw new ArgumentException($"Invalid age: {age}");
}
\`\`\`

### Custom Exceptions

\`\`\`csharp
class InsufficientFundsException : Exception
{
    public decimal Balance { get; }
    public decimal Amount { get; }

    public InsufficientFundsException(decimal balance, decimal amount)
        : base($"Cannot withdraw \${amount}. Balance is \${balance}.")
    {
        Balance = balance;
        Amount = amount;
    }
}
\`\`\`

### Async Error Handling

\`try-catch\` works seamlessly with \`await\`:

\`\`\`csharp
try
{
    string data = await FetchDataAsync();
    Console.WriteLine(data);
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Network error: {ex.Message}");
}
\`\`\`

### Your Task

Build a robust user registration system with comprehensive error handling.`,
      starterCode: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;

// Create a custom exception: InvalidRegistrationException
// It should store a "Field" property (which field caused the error)

class UserRegistration
{
    private List<string> registeredEmails = new List<string>();

    // Create: async Task<string> RegisterUserAsync(string name, string email, int age)
    // Validate:
    //   - name is not null/empty (throw ArgumentException)
    //   - email contains "@" (throw InvalidRegistrationException with Field = "Email")
    //   - age is between 13 and 120 (throw InvalidRegistrationException with Field = "Age")
    //   - email is not already registered (throw InvalidOperationException)
    // If valid:
    //   - Simulate a 1-second async registration delay
    //   - Add email to registeredEmails
    //   - Return a confirmation message: "User [name] registered with [email]"
}

class Program
{
    static async Task Main()
    {
        UserRegistration reg = new UserRegistration();

        // Test these registrations with try-catch for each:
        // 1. Valid: "Alice", "alice@email.com", 25
        // 2. Invalid name: "", "bob@email.com", 30
        // 3. Invalid email: "Carol", "carol-no-at", 28
        // 4. Invalid age: "Dave", "dave@email.com", 10
        // 5. Duplicate email: "Eve", "alice@email.com", 22

        // Print success or the specific error for each attempt
    }
}`,
      solutionCode: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;

class InvalidRegistrationException : Exception
{
    public string Field { get; }

    public InvalidRegistrationException(string field, string message)
        : base(message)
    {
        Field = field;
    }
}

class UserRegistration
{
    private List<string> registeredEmails = new List<string>();

    public async Task<string> RegisterUserAsync(string name, string email, int age)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty.");

        if (!email.Contains("@"))
            throw new InvalidRegistrationException("Email", $"Invalid email format: {email}");

        if (age < 13 || age > 120)
            throw new InvalidRegistrationException("Age", $"Age must be between 13 and 120. Got: {age}");

        if (registeredEmails.Contains(email))
            throw new InvalidOperationException($"Email already registered: {email}");

        await Task.Delay(1000);
        registeredEmails.Add(email);
        return $"User {name} registered with {email}";
    }
}

class Program
{
    static async Task Main()
    {
        UserRegistration reg = new UserRegistration();

        string[][] testCases = new string[][]
        {
            new[] { "Alice", "alice@email.com", "25" },
            new[] { "", "bob@email.com", "30" },
            new[] { "Carol", "carol-no-at", "28" },
            new[] { "Dave", "dave@email.com", "10" },
            new[] { "Eve", "alice@email.com", "22" }
        };

        foreach (string[] tc in testCases)
        {
            try
            {
                string result = await reg.RegisterUserAsync(tc[0], tc[1], int.Parse(tc[2]));
                Console.WriteLine($"SUCCESS: {result}");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"VALIDATION ERROR: {ex.Message}");
            }
            catch (InvalidRegistrationException ex)
            {
                Console.WriteLine($"REGISTRATION ERROR [{ex.Field}]: {ex.Message}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"DUPLICATE ERROR: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UNEXPECTED ERROR: {ex.Message}");
            }
        }
    }
}`,
    },
  ],
};
