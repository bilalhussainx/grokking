import { Module } from "../types";

export const module5: Module = {
  id: "testing-benchmarking",
  title: "Testing, Benchmarks & Profiling",
  description: "Go's built-in testing framework, table-driven tests, subtests, mocks, benchmarking with pprof, and race detector",
  lessons: [
    {
      id: "testing-benchmarks",
      slug: "testing-benchmarks",
      title: "Testing, Benchmarks & Profiling",
      content: `# Testing & Benchmarks in Go

Go ships testing out of the box — no framework needed. The \`testing\` package handles unit tests, benchmarks, fuzz tests, and examples all in one.

---

\`\`\`concept
{
  "title": "Go's Testing Philosophy",
  "variant": "mental-model",
  "content": "Go tests live in *_test.go files alongside production code. No test class hierarchy, no annotations — just functions named Test*(t *testing.T). Table-driven tests are idiomatic Go: define a slice of test cases, loop over them with t.Run() subtests. This scales to hundreds of cases without repetition and gives you precise failure reporting."
}
\`\`\`

---

## Unit Tests & Table-Driven Pattern

\`\`\`go
package calc

import (
    "testing"
    "errors"
)

func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Table-driven test — idiomatic Go:
func TestDivide(t *testing.T) {
    tests := []struct {
        name    string
        a, b    float64
        want    float64
        wantErr bool
    }{
        {"positive", 10, 2, 5, false},
        {"negative", -10, 2, -5, false},
        {"zero divisor", 10, 0, 0, true},
        {"float result", 7, 2, 3.5, false},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got, err := Divide(tc.a, tc.b)

            if (err != nil) != tc.wantErr {
                t.Errorf("Divide(%v, %v) error = %v, wantErr %v", tc.a, tc.b, err, tc.wantErr)
                return
            }

            if !tc.wantErr && got != tc.want {
                t.Errorf("Divide(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
            }
        })
    }
}

// Run: go test ./...
// Run specific test: go test -run TestDivide/zero_divisor
// Verbose output: go test -v ./...
// With race detector: go test -race ./...
\`\`\`

## Testing HTTP Handlers

\`\`\`go
package handlers

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
    var body struct{ Name string }
    json.NewDecoder(r.Body).Decode(&body)
    if body.Name == "" {
        http.Error(w, "name required", http.StatusBadRequest)
        return
    }
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"name": body.Name})
}

func TestCreateUser(t *testing.T) {
    tests := []struct {
        name       string
        body       string
        wantStatus int
    }{
        {"valid user", \`{"name":"alice"}\`, http.StatusCreated},
        {"missing name", \`{}\`, http.StatusBadRequest},
        {"empty body", \`\`, http.StatusBadRequest},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            // httptest.NewRecorder — captures response without a real server:
            w := httptest.NewRecorder()
            r := httptest.NewRequest("POST", "/users", strings.NewReader(tc.body))
            r.Header.Set("Content-Type", "application/json")

            CreateUser(w, r)

            if w.Code != tc.wantStatus {
                t.Errorf("status = %d, want %d", w.Code, tc.wantStatus)
            }
        })
    }
}
\`\`\`

## Interfaces for Testability

\`\`\`go
// Define an interface to decouple from real dependencies:
type UserRepo interface {
    FindByID(id string) (*User, error)
    Save(u *User) error
}

type UserService struct {
    repo UserRepo
}

func (s *UserService) GetProfile(id string) (*UserProfile, error) {
    user, err := s.repo.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("get profile: %w", err)
    }
    return &UserProfile{Name: user.Name, ID: user.ID}, nil
}

// --- In tests: ---
type mockRepo struct {
    users map[string]*User
    err   error
}

func (m *mockRepo) FindByID(id string) (*User, error) {
    if m.err != nil { return nil, m.err }
    u, ok := m.users[id]
    if !ok { return nil, ErrNotFound }
    return u, nil
}

func (m *mockRepo) Save(u *User) error { return m.err }

func TestGetProfile(t *testing.T) {
    svc := &UserService{repo: &mockRepo{
        users: map[string]*User{"u1": {ID: "u1", Name: "Alice"}},
    }}

    profile, err := svc.GetProfile("u1")
    if err != nil || profile.Name != "Alice" {
        t.Errorf("unexpected: profile=%v err=%v", profile, err)
    }

    // Test error path:
    svc2 := &UserService{repo: &mockRepo{err: ErrNotFound}}
    _, err = svc2.GetProfile("x")
    if !errors.Is(err, ErrNotFound) {
        t.Errorf("expected ErrNotFound, got %v", err)
    }
}
\`\`\`

## Benchmarks

\`\`\`go
package strings_bench

import (
    "strings"
    "testing"
    "bytes"
    "fmt"
)

// Benchmark: string concatenation approaches
func BenchmarkConcatPlus(b *testing.B) {
    // b.N is set by the testing framework — it increases until stable
    for i := 0; i < b.N; i++ {
        var s string
        for j := 0; j < 100; j++ {
            s += "x"
        }
        _ = s
    }
}

func BenchmarkConcatBuilder(b *testing.B) {
    for i := 0; i < b.N; i++ {
        var sb strings.Builder
        for j := 0; j < 100; j++ {
            sb.WriteByte('x')
        }
        _ = sb.String()
    }
}

func BenchmarkConcatBuffer(b *testing.B) {
    for i := 0; i < b.N; i++ {
        var buf bytes.Buffer
        for j := 0; j < 100; j++ {
            buf.WriteByte('x')
        }
        _ = buf.String()
    }
}

// Run: go test -bench=. -benchmem
// Output:
// BenchmarkConcatPlus-8      100000   15432 ns/op  5040 B/op  99 allocs/op
// BenchmarkConcatBuilder-8  1000000    1203 ns/op   512 B/op   6 allocs/op
// BenchmarkConcatBuffer-8    500000    2891 ns/op  1280 B/op  12 allocs/op

// b.ResetTimer() — exclude setup from measurement:
func BenchmarkWithSetup(b *testing.B) {
    data := make([]int, 1000)
    for i := range data { data[i] = i }
    b.ResetTimer()  // start timing HERE, not during setup

    for i := 0; i < b.N; i++ {
        sum := 0
        for _, v := range data { sum += v }
        _ = sum
    }
}

// b.ReportAllocs() — explicitly track allocations:
func BenchmarkAllocs(b *testing.B) {
    b.ReportAllocs()
    for i := 0; i < b.N; i++ {
        _ = fmt.Sprintf("hello %d", i)
    }
}
\`\`\`

## pprof Profiling

\`\`\`go
// Add pprof HTTP endpoint to any Go server:
import _ "net/http/pprof"  // side-effect import registers handlers

func main() {
    // pprof listens on separate port:
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // ... your real server
}

// CPU profile: captures where time is spent
// go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
// > web  (opens flame graph in browser)
// > top  (shows top functions by CPU time)

// Heap profile: captures allocations
// go tool pprof http://localhost:6060/debug/pprof/heap
// > alloc_objects → count of allocations
// > alloc_space   → bytes allocated

// Goroutine dump: see all running goroutines
// curl http://localhost:6060/debug/pprof/goroutine?debug=1

// From benchmark:
// go test -bench=BenchmarkFoo -cpuprofile=cpu.prof
// go tool pprof cpu.prof
\`\`\`

## Race Detector

\`\`\`go
// The race detector finds concurrent data races at runtime:
// go test -race ./...
// go run -race main.go

// Example race condition:
var counter int

func increment() {
    counter++  // NOT safe — read-modify-write is not atomic
}

func main() {
    for i := 0; i < 1000; i++ {
        go increment()
    }
    time.Sleep(time.Second)
    fmt.Println(counter)  // race detected!
}

// Fix with sync/atomic:
var counter int64
atomic.AddInt64(&counter, 1)  // atomic — safe from multiple goroutines

// Fix with mutex:
var (
    mu      sync.Mutex
    counter int
)
func increment() {
    mu.Lock()
    counter++
    mu.Unlock()
}

// Fix with channel:
func main() {
    ch := make(chan struct{}, 1000)
    counter := 0
    for i := 0; i < 1000; i++ {
        ch <- struct{}{}
        go func() {
            counter++  // protected by channel
            <-ch
        }()
    }
}
\`\`\`

\`\`\`takeaways
["Table-driven tests with t.Run() are idiomatic Go — name each case for precise failure messages.", "Use interfaces to inject dependencies — swap real DB for mock in tests without reflection magic.", "httptest.NewRecorder() + httptest.NewRequest() let you test handlers without starting a server.", "go test -race catches data races at runtime — always run it in CI even if tests pass clean.", "BenchmarkXxx(b *testing.B) — loop b.N times, use b.ResetTimer() to exclude setup, b.ReportAllocs() for memory.", "go tool pprof turns CPU/heap profiles into flame graphs — find the real bottleneck before optimizing."]
\`\`\`
`,
    },
  ],
};
