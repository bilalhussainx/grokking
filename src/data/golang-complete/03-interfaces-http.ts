import { Module } from "../types";

export const module3: Module = {
  id: "interfaces-http",
  title: "Interfaces, HTTP Servers & Go in Production",
  description: "Go interfaces (implicit satisfaction), the io.Reader/Writer contract, building HTTP APIs with net/http and Chi, testing, and production patterns",
  lessons: [
    {
      id: "interfaces-patterns",
      slug: "interfaces-patterns",
      title: "Interfaces, HTTP APIs & Production Go",
      content: `# Go Interfaces & HTTP Servers

Go's interface system is implicit — no explicit 'implements' keyword. If your type has the methods, it satisfies the interface. This enables loose coupling without ceremony.

---

## Interfaces: Implicit Satisfaction

\`\`\`go
package main

import (
    "fmt"
    "math"
    "strings"
    "io"
)

// Interface: just a method set
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Circle satisfies Shape — no explicit declaration!
type Circle struct{ Radius float64 }
func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

// Rectangle also satisfies Shape:
type Rectangle struct{ Width, Height float64 }
func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

func printShape(s Shape) {
    fmt.Printf("Area=%.2f, Perimeter=%.2f\\n", s.Area(), s.Perimeter())
}

// The power: ANY type with Area() and Perimeter() works
func main() {
    shapes := []Shape{
        Circle{Radius: 5},
        Rectangle{Width: 4, Height: 6},
    }
    for _, s := range shapes {
        printShape(s)
    }
}

// Standard library interfaces you'll use constantly:
// io.Reader:  Read(p []byte) (n int, err error)
// io.Writer:  Write(p []byte) (n int, err error)
// io.Closer:  Close() error
// fmt.Stringer: String() string

// Any type that implements Read() can be passed to:
// json.NewDecoder(), bufio.NewReader(), io.Copy(), etc.
\`\`\`

## Building HTTP APIs

\`\`\`go
package main

import (
    "encoding/json"
    "log/slog"
    "net/http"
    "os"
    "time"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

type User struct {
    ID    string \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

type UserHandler struct {
    store UserStore   // Interface — not a concrete type
    log   *slog.Logger
}

// Respond helper — DRY JSON responses:
func respond(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    if err := json.NewEncoder(w).Encode(v); err != nil {
        slog.Error("encode response", "err", err)
    }
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    userID := chi.URLParam(r, "id")
    user, err := h.store.GetByID(r.Context(), userID)
    if err != nil {
        respond(w, http.StatusNotFound, map[string]string{"error": "user not found"})
        return
    }
    respond(w, http.StatusOK, user)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Name  string \`json:"name"\`
        Email string \`json:"email"\`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        respond(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
        return
    }
    // Validate:
    if req.Name == "" || req.Email == "" {
        respond(w, http.StatusBadRequest, map[string]string{"error": "name and email required"})
        return
    }
    user, err := h.store.Create(r.Context(), req.Name, req.Email)
    if err != nil {
        h.log.Error("create user", "err", err)
        respond(w, http.StatusInternalServerError, map[string]string{"error": "internal error"})
        return
    }
    respond(w, http.StatusCreated, user)
}

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

    h := &UserHandler{
        store: NewPostgresUserStore(os.Getenv("DATABASE_URL")),
        log:   logger,
    }

    r := chi.NewRouter()

    // Middleware:
    r.Use(middleware.RequestID)
    r.Use(middleware.RealIP)
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)   // Recover from panics — return 500 instead of crashing
    r.Use(middleware.Timeout(30 * time.Second))

    // Routes:
    r.Route("/api/v1", func(r chi.Router) {
        r.Get("/users/{id}", h.GetUser)
        r.Post("/users", h.CreateUser)
    })

    server := &http.Server{
        Addr:         ":8080",
        Handler:      r,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    logger.Info("Server starting", "addr", ":8080")
    if err := server.ListenAndServe(); err != nil {
        logger.Error("server error", "err", err)
        os.Exit(1)
    }
}
\`\`\`

## Testing in Go

\`\`\`go
// user_test.go — Go testing is built-in, no framework needed
package main

import (
    "context"
    "testing"
    "net/http"
    "net/http/httptest"
    "encoding/json"
    "strings"
)

// Table-driven tests — idiomatic Go test style:
func TestDivide(t *testing.T) {
    tests := []struct {
        name    string
        a, b    float64
        want    float64
        wantErr bool
    }{
        {"positive", 10, 3, 3.333, false},
        {"negative", -6, 2, -3.0, false},
        {"div by zero", 5, 0, 0, true},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got, err := divide(tc.a, tc.b)
            if (err != nil) != tc.wantErr {
                t.Errorf("divide() error = %v, wantErr %v", err, tc.wantErr)
            }
            if !tc.wantErr && math.Abs(got-tc.want) > 0.001 {
                t.Errorf("divide() = %v, want %v", got, tc.want)
            }
        })
    }
}

// HTTP handler test using httptest.NewRecorder:
func TestGetUser(t *testing.T) {
    store := &MockUserStore{
        users: map[string]*User{"1": {ID: "1", Name: "Alice"}},
    }
    h := &UserHandler{store: store, log: slog.Default()}

    req := httptest.NewRequest("GET", "/api/v1/users/1", nil)
    req = req.WithContext(context.Background())
    rec := httptest.NewRecorder()

    r := chi.NewRouter()
    r.Get("/api/v1/users/{id}", h.GetUser)
    r.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Errorf("got status %d, want 200", rec.Code)
    }
    var user User
    json.NewDecoder(rec.Body).Decode(&user)
    if user.Name != "Alice" {
        t.Errorf("got name %q, want Alice", user.Name)
    }
}

// Run tests:
// go test ./...           — all packages
// go test -v ./...        — verbose
// go test -race ./...     — race condition detector
// go test -bench=. ./...  — benchmarks
\`\`\`

\`\`\`takeaways
["Interfaces are satisfied implicitly — no 'implements' keyword. Any type with the right methods satisfies.", "Accept interfaces, return concrete types — functions that accept interfaces are more reusable", "Chi router: lightweight, fast, compatible with net/http — prefer over Gin/Echo for standard library compatibility", "Always set ReadTimeout/WriteTimeout on http.Server — default is no timeout (DoS vulnerability)", "Table-driven tests are idiomatic Go — one test function covers many cases cleanly", "go test -race is essential — enable it in CI to catch data races that only appear under concurrency"]
\`\`\`
`,
    },
  ],
};
