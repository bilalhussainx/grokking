import { Module } from "../types";

export const module1: Module = {
  id: "go-fundamentals",
  title: "Go Fundamentals: Syntax, Types & Tooling",
  description: "Go's type system, zero values, defer/panic/recover, slices vs arrays, maps, and the Go toolchain",
  lessons: [
    {
      id: "go-syntax-types",
      slug: "go-syntax-types",
      title: "Go Syntax & the Type System",
      content: `# Go: A Language Designed for Scale

Go was designed at Google to solve real engineering problems: slow compilation, complex dependency management, and difficult concurrency. It achieves simplicity through deliberate constraints.

---

\`\`\`concept
{
  "title": "Go's Design Philosophy",
  "variant": "mental-model",
  "content": "Go has one way to do things. No classes — only structs and methods. No inheritance — only interfaces (implicit, not explicit). No exceptions — only error return values. No generics until Go 1.18. The language spec fits in a web page. The result: Go code written by anyone looks the same, compiles in seconds, and runs fast."
}
\`\`\`

---

## Variables, Types & Zero Values

\`\`\`go
package main

import (
    "fmt"
    "math"
)

func main() {
    // var declaration (explicit type):
    var name string = "Alice"
    var age  int    = 30

    // Short declaration (inferred type — most common):
    city := "London"
    pi   := 3.14159

    // Zero values — Go initializes everything:
    var x int       // 0
    var s string    // ""
    var b bool      // false
    var p *int      // nil

    // Multiple assignment:
    a, b := 10, 20
    a, b = b, a    // swap — no temp variable!

    // Constants:
    const MaxConnections = 100
    const (
        StatusOK  = 200
        StatusNotFound = 404
    )

    // iota (auto-incrementing constant):
    const (
        Sunday = iota   // 0
        Monday          // 1
        Tuesday         // 2
    )

    fmt.Println(name, age, city, pi, x, s, b, p)
    fmt.Println(math.Sqrt(2))
}
\`\`\`

## Functions & Error Handling

\`\`\`go
package main

import (
    "errors"
    "fmt"
)

// Functions are first-class; multiple return values (error idiom):
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Named return values (document what each return means):
func stats(nums []float64) (mean, std float64, err error) {
    if len(nums) == 0 {
        err = errors.New("empty slice")
        return  // naked return — returns named values
    }
    // ... compute mean and std
    return
}

// Variadic function:
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

// Function as value:
type Transformer func(int) int

func apply(nums []int, transform Transformer) []int {
    result := make([]int, len(nums))
    for i, n := range nums {
        result[i] = transform(n)
    }
    return result
}

func main() {
    result, err := divide(10, 3)
    if err != nil {         // ALWAYS check errors — Go enforces explicit handling
        fmt.Println("Error:", err)
        return
    }
    fmt.Printf("%.4f\\n", result)   // 3.3333

    doubled := apply([]int{1, 2, 3}, func(n int) int { return n * 2 })
    fmt.Println(doubled)            // [2 4 6]
}
\`\`\`

## Slices, Maps & Structs

\`\`\`go
// --- SLICES ---
// Dynamic arrays — backed by an array, but with length and capacity
s := []int{1, 2, 3, 4, 5}
s = append(s, 6, 7)           // append may allocate new backing array

sub := s[1:4]    // [2 3 4] — slice of slice (shares memory!)
sub[0] = 99      // modifies s[1] too!

// Safe copy:
dst := make([]int, len(s))
copy(dst, s)

// 2D slice (slice of slices):
matrix := make([][]int, 3)
for i := range matrix {
    matrix[i] = make([]int, 3)
}

// --- MAPS ---
m := map[string]int{
    "alice": 30,
    "bob":   25,
}
m["carol"] = 35

// Check if key exists (zero value ambiguity):
age, ok := m["dave"]
if !ok {
    fmt.Println("dave not found")
}
delete(m, "alice")

// --- STRUCTS ---
type User struct {
    ID       int
    Name     string
    Email    string
    IsAdmin  bool
}

// Constructor pattern (no constructor keyword):
func NewUser(id int, name, email string) *User {
    return &User{
        ID:    id,
        Name:  name,
        Email: email,
    }
}

// Methods:
func (u *User) Display() string {
    return fmt.Sprintf("User(%d): %s <%s>", u.ID, u.Name, u.Email)
}

// Embedding (composition, not inheritance):
type Admin struct {
    User                // embed User — all User methods promoted
    Permissions []string
}
\`\`\`

## defer, panic & recover

\`\`\`go
func readFile(path string) (string, error) {
    f, err := os.Open(path)
    if err != nil {
        return "", fmt.Errorf("readFile: %w", err)
    }
    defer f.Close()  // ALWAYS runs when function returns, even on error
    // defer is LIFO — multiple defers run in reverse order

    // ...read content...
    return content, nil
}

// panic is like an exception — only for unrecoverable programming errors:
func mustPositive(n int) int {
    if n <= 0 {
        panic(fmt.Sprintf("n must be positive, got %d", n))
    }
    return n
}

// recover in a deferred function catches panics:
func safeCall(f func()) (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered from panic: %v", r)
        }
    }()
    f()
    return nil
}

// Rule: use errors for expected failures, panic only for programming bugs
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the zero value of a bool, int, string, and pointer in Go?",
      "options": [
        "null, null, null, null",
        "false, 0, empty string, nil",
        "undefined for all",
        "You must initialize all variables explicitly"
      ],
      "answer": 1,
      "explanation": "Go zero-initializes all variables: bool=false, int/float=0, string='', pointer/map/slice/channel/function=nil. This is a deliberate design decision — no uninitialized variable bugs. A struct's zero value has all fields zero-initialized. This is why 'var m map[string]int' is nil (not empty) and panics on write — use 'make(map[string]int)' or 'm := map[string]int{}' to initialize."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
