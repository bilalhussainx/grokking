import { Module } from "../types";

export const module5: Module = {
  id: "exceptions",
  title: "Exception Handling",
  description: "Master Java's exception hierarchy, checked vs unchecked exceptions, try-with-resources, and custom exceptions",
  lessons: [
    {
      id: "exception-hierarchy",
      slug: "exception-hierarchy",
      title: "Exception Hierarchy & Handling",
      content: `
# Exception Handling in Java

Java's exception mechanism is one of the most important concepts for both production code and technical interviews.

\`\`\`concept
{
  "title": "Exception Hierarchy",
  "description": "All exceptions extend Throwable. Errors are JVM-level (don't catch). RuntimeException and its subclasses are unchecked. Everything else is checked.",
  "points": [
    "Throwable → Error (OOM, StackOverflow — don't catch) OR Exception",
    "Exception → RuntimeException (unchecked) OR checked exceptions",
    "Checked: compiler forces you to handle or declare (throws)",
    "Unchecked (RuntimeException): programmer error — no forced handling",
    "Common checked: IOException, SQLException, ParseException, InterruptedException",
    "Common unchecked: NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException, IllegalStateException, ClassCastException"
  ]
}
\`\`\`

## Exception Hierarchy

\`\`\`mermaid
graph TD
  T[Throwable] --> E[Exception]
  T --> Er[Error]
  E --> RE[RuntimeException]
  E --> CE[Checked Exceptions]
  RE --> NPE[NullPointerException]
  RE --> AIOBE[ArrayIndexOutOfBoundsException]
  RE --> IAE[IllegalArgumentException]
  RE --> CCE[ClassCastException]
  CE --> IOE[IOException]
  CE --> SQL[SQLException]
  Er --> OOM[OutOfMemoryError]
  Er --> SOF[StackOverflowError]

  style Er fill:#f87171,color:#000
  style RE fill:#fbbf24,color:#000
  style CE fill:#60a5fa,color:#000
\`\`\`

## try-catch-finally

\`\`\`tabs
[
  {
    "label": "Basic try-catch",
    "content": "try {\\n    int result = 10 / 0;  // throws ArithmeticException\\n    String s = null;\\n    s.length();            // throws NullPointerException\\n} catch (ArithmeticException e) {\\n    System.out.println(\\"Math error: \\" + e.getMessage());\\n} catch (NullPointerException e) {\\n    System.out.println(\\"Null: \\" + e.getMessage());\\n} catch (Exception e) {\\n    // Catch-all — catches anything not caught above\\n    System.out.println(\\"Unknown error: \\" + e.getMessage());\\n} finally {\\n    // ALWAYS runs — even if exception not caught or return called\\n    System.out.println(\\"Cleanup in finally\\");\\n}"
  },
  {
    "label": "Multi-catch (Java 7+)",
    "content": "// Catch multiple exception types with one catch block:\\ntry {\\n    riskyOperation();\\n} catch (IOException | SQLException e) {\\n    // e is effectively final\\n    log.error(\\"Data error\\", e);\\n    throw new ServiceException(\\"Data layer failed\\", e);\\n}"
  },
  {
    "label": "Rethrowing",
    "content": "// Wrap lower-level exceptions in higher-level ones (layering):\\npublic User findUser(int id) throws UserNotFoundException {\\n    try {\\n        return database.query(\\"SELECT * FROM users WHERE id=?\\" id);\\n    } catch (SQLException e) {\\n        // Wrap with cause preserved:\\n        throw new UserNotFoundException(\\"User \\" + id + \\" not found\\", e);\\n    }\\n}\\n\\n// Caller sees UserNotFoundException (not SQL details)\\n// but the original cause is available via getCause()"
  }
]
\`\`\`

## try-with-resources (AutoCloseable)

\`\`\`java
// BEFORE Java 7 — manual close, verbose and error-prone:
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("file.txt"));
    String line = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try { reader.close(); } catch (IOException e) { /* ignored */ }
    }
}

// Java 7+ try-with-resources: ALWAYS closes the resource:
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
    // reader.close() called automatically — even if exception thrown
} catch (IOException e) {
    e.printStackTrace();
}

// Multiple resources (closed in reverse order):
try (
    Connection conn = dataSource.getConnection();
    PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users");
    ResultSet rs = stmt.executeQuery()
) {
    while (rs.next()) { ... }
} catch (SQLException e) { ... }
// rs, stmt, conn closed in that order automatically

// Any class implementing AutoCloseable works:
class Resource implements AutoCloseable {
    @Override
    public void close() { System.out.println("Resource closed"); }
}
try (Resource r = new Resource()) { ... }
\`\`\`

## Custom Exceptions

\`\`\`java
// Custom checked exception:
public class InsufficientFundsException extends Exception {
    private final double amount;
    private final double balance;

    public InsufficientFundsException(double amount, double balance) {
        super(String.format("Cannot withdraw %.2f: balance is %.2f", amount, balance));
        this.amount = amount;
        this.balance = balance;
    }

    public double getAmount() { return amount; }
    public double getBalance() { return balance; }
}

// Custom unchecked exception:
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) { super(message); }
    public UserNotFoundException(String message, Throwable cause) { super(message, cause); }
}

// Usage:
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException(amount, balance);
    }
    balance -= amount;
}
\`\`\`

## Best Practices

\`\`\`concept
{
  "title": "Exception Best Practices",
  "description": "Rules that separate professional Java code from amateur code",
  "points": [
    "Never catch Exception or Throwable unless at a top-level boundary (e.g., request handler)",
    "Never swallow exceptions silently — catch (Exception e) {}",
    "Always log or rethrow — never both (double logging)",
    "Use specific exception types — IllegalArgumentException for bad params, IllegalStateException for bad state",
    "Include context in exception messages — 'User 42 not found' not just 'not found'",
    "Prefer unchecked for programming errors, checked for recoverable conditions",
    "Always use try-with-resources for Closeable resources",
    "Preserve exception cause when wrapping: throw new MyException('msg', originalException)"
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between checked and unchecked exceptions?",
      "options": [
        "Checked are faster",
        "Checked exceptions must be declared in the method signature (throws) or caught; unchecked (RuntimeException) do not",
        "Checked exceptions cannot be caught",
        "Unchecked exceptions are always fatal"
      ],
      "answer": 1,
      "explanation": "Checked exceptions are verified by the compiler — you must catch them or declare 'throws' in the method signature. Unchecked exceptions (extending RuntimeException) have no such requirement."
    },
    {
      "q": "When does the 'finally' block NOT execute?",
      "options": ["When an exception is thrown", "When return is called in try", "When System.exit() is called", "When catch block runs"],
      "answer": 2,
      "explanation": "finally executes in almost all cases — even if return or an exception occurs. The rare exception is System.exit() (terminates the JVM) or a JVM crash."
    },
    {
      "q": "What does try-with-resources guarantee?",
      "options": ["No exceptions will be thrown", "The resource's close() method is called even if an exception occurs", "The finally block won't run", "Resources are shared between threads"],
      "answer": 1,
      "explanation": "try-with-resources ensures close() is called on any AutoCloseable resource regardless of whether an exception is thrown. The resource is closed before any catch/finally blocks run."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
