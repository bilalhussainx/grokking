import { Module } from "../types";

export const module4: Module = {
  id: "generics-error-handling",
  title: "Generics, Error Handling & Context",
  description: "Go 1.18+ generics with type constraints, idiomatic error wrapping with %w, sentinel errors, custom error types, and context propagation for cancellation",
  lessons: [
    {
      id: "generics-errors",
      slug: "generics-errors",
      title: "Generics, Error Patterns & Context",
      content: `# Generics, Errors & Context

Go 1.18 brought generics — finally eliminating boilerplate for data structures. Go's error model is deliberate: errors are values, not magic control flow.

---

\`\`\`concept
{
  "title": "Go Errors Are Values",
  "variant": "mental-model",
  "content": "In Go, errors are just values implementing the 'error' interface (Error() string). Functions return (value, error) tuples. The caller decides how to handle the error — log it, wrap it, retry, propagate. This is verbose but explicit: you always know which functions can fail and exactly where the failure happened. No hidden exception paths."
}
\`\`\`

---

## Generics: Type Parameters

\`\`\`go
package main

import (
    "cmp"    // Go 1.21+
    "slices" // Go 1.21+
    "fmt"
)

// Generic function — works on any ordered type:
func Min[T cmp.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

// Generic Map (transforms a slice):
func Map[T, R any](slice []T, f func(T) R) []R {
    result := make([]R, len(slice))
    for i, v := range slice {
        result[i] = f(v)
    }
    return result
}

// Generic Filter:
func Filter[T any](slice []T, pred func(T) bool) []T {
    var result []T
    for _, v := range slice {
        if pred(v) {
            result = append(result, v)
        }
    }
    return result
}

// Generic Reduce:
func Reduce[T, R any](slice []T, initial R, f func(R, T) R) R {
    acc := initial
    for _, v := range slice {
        acc = f(acc, v)
    }
    return acc
}

// Type constraints:
type Number interface {
    int | int32 | int64 | float32 | float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

// Generic Set:
type Set[T comparable] struct {
    items map[T]struct{}
}

func NewSet[T comparable]() *Set[T] {
    return &Set[T]{items: make(map[T]struct{})}
}

func (s *Set[T]) Add(item T) { s.items[item] = struct{}{} }
func (s *Set[T]) Contains(item T) bool { _, ok := s.items[item]; return ok }
func (s *Set[T]) Size() int { return len(s.items) }

func main() {
    nums := []int{1, 2, 3, 4, 5, 6}
    doubled  := Map(nums, func(n int) int { return n * 2 })
    evens    := Filter(nums, func(n int) bool { return n%2 == 0 })
    total    := Reduce(nums, 0, func(acc, n int) int { return acc + n })
    fmt.Println(doubled, evens, total)  // [2 4 6 8 10 12] [2 4 6] 21

    fmt.Println(Sum([]float64{1.1, 2.2, 3.3}))  // 6.6

    s := NewSet[string]()
    s.Add("go"); s.Add("rust"); s.Add("go")
    fmt.Println(s.Size(), s.Contains("go"))  // 2 true
}
\`\`\`

## Error Handling Patterns

\`\`\`go
package main

import (
    "errors"
    "fmt"
)

// --- Sentinel errors (known, compareable errors) ---
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrTimeout      = errors.New("timeout")
)

// --- Custom error types (add context) ---
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Message)
}

type DatabaseError struct {
    Op  string
    Err error
}

func (e *DatabaseError) Error() string {
    return fmt.Sprintf("database %s: %v", e.Op, e.Err)
}

func (e *DatabaseError) Unwrap() error { return e.Err }  // enables errors.Is/As

// --- Wrapping errors with context ---
func getUser(id string) (*User, error) {
    user, err := db.Find(id)
    if err != nil {
        // %w wraps the error — errors.Is/As can unwrap through it:
        return nil, fmt.Errorf("getUser(%s): %w", id, err)
    }
    return user, nil
}

// --- Checking error types ---
func handleError(err error) {
    // errors.Is — checks wrapped chain for exact match:
    if errors.Is(err, ErrNotFound) {
        fmt.Println("404 — not found")
        return
    }

    // errors.As — unwraps chain looking for a type match:
    var valErr *ValidationError
    if errors.As(err, &valErr) {
        fmt.Printf("Invalid field '%s': %s\n", valErr.Field, valErr.Message)
        return
    }

    var dbErr *DatabaseError
    if errors.As(err, &dbErr) {
        fmt.Printf("DB operation '%s' failed: %v\n", dbErr.Op, dbErr.Err)
        return
    }

    fmt.Printf("Unexpected error: %v\n", err)
}
\`\`\`

## Context: Cancellation & Deadlines

\`\`\`go
package main

import (
    "context"
    "database/sql"
    "fmt"
    "net/http"
    "time"
)

// Context carries: cancellation signal, deadline, request-scoped values
// Pass ctx as the FIRST argument to EVERY function that does I/O

func fetchData(ctx context.Context, url string) ([]byte, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("create request: %w", err)
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("do request: %w", err)
    }
    defer resp.Body.Close()
    // ... read body
    return nil, nil
}

// HTTP handler — always use r.Context():
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()  // cancelled when client disconnects

    // Query with timeout (5s for this DB call):
    queryCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()  // ALWAYS defer cancel — prevents goroutine leak

    var user User
    err := db.QueryRowContext(queryCtx, "SELECT * FROM users WHERE id = \$1", userID).
        Scan(&user.ID, &user.Name)
    if err != nil {
        if errors.Is(err, context.DeadlineExceeded) {
            http.Error(w, "Database timeout", http.StatusGatewayTimeout)
            return
        }
        http.Error(w, "Internal error", http.StatusInternalServerError)
        return
    }

    // context.Value for request-scoped data (use sparingly):
    type ctxKey string
    const requestIDKey ctxKey = "requestID"

    requestID := ctx.Value(requestIDKey)
    fmt.Printf("Request %v: found user %s\n", requestID, user.Name)
}

// Propagate cancellation through goroutine tree:
func processAll(ctx context.Context, items []string) error {
    for _, item := range items {
        select {
        case <-ctx.Done():
            return fmt.Errorf("cancelled after %d items: %w", len(items), ctx.Err())
        default:
            if err := process(ctx, item); err != nil {
                return err
            }
        }
    }
    return nil
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between errors.Is() and errors.As() in Go?",
      "options": [
        "They are identical",
        "errors.Is checks for a specific error VALUE (including wrapped); errors.As unwraps the chain looking for a specific TYPE and populates a target pointer with that error",
        "errors.As only works with custom error types",
        "errors.Is only works with sentinel errors defined at package level"
      ],
      "answer": 1,
      "explanation": "errors.Is(err, target) walks the error chain (via Unwrap()) checking if any error in the chain == target. Perfect for sentinel errors like ErrNotFound. errors.As(err, &target) walks the chain checking if any error can be assigned to target's type. Perfect for custom error types where you want to access extra fields (like ValidationError.Field). Both respect error wrapping done with fmt.Errorf(\"%w\", err)."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
