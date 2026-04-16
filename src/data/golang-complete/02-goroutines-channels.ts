import { Module } from "../types";

export const module2: Module = {
  id: "goroutines-channels",
  title: "Goroutines, Channels & Concurrency",
  description: "Go's concurrency model: goroutines, channels, select, sync primitives, and building concurrent pipelines",
  lessons: [
    {
      id: "concurrency-model",
      slug: "concurrency-model",
      title: "Go Concurrency: Goroutines & Channels",
      content: `# Go Concurrency

Go's tagline: "Don't communicate by sharing memory; share memory by communicating." Goroutines and channels make concurrent code readable and safe.

---

\`\`\`concept
{
  "title": "Goroutines vs Threads",
  "variant": "mental-model",
  "content": "OS threads: 1-8MB stack, expensive to create (~1ms), scheduled by OS. Goroutines: 2KB initial stack (grows dynamically), nanoseconds to create, scheduled by Go runtime (M:N scheduling — M goroutines on N OS threads). You can run 1 million goroutines — try that with threads."
}
\`\`\`

---

## Goroutines

\`\`\`go
package main

import (
    "fmt"
    "sync"
    "time"
)

func fetchURL(url string, wg *sync.WaitGroup, results chan<- string) {
    defer wg.Done()
    // Simulate HTTP fetch:
    time.Sleep(100 * time.Millisecond)
    results <- fmt.Sprintf("Got response from %s", url)
}

func main() {
    urls := []string{
        "https://api1.example.com",
        "https://api2.example.com",
        "https://api3.example.com",
    }

    results := make(chan string, len(urls))  // Buffered channel
    var wg sync.WaitGroup

    // Launch goroutines concurrently:
    for _, url := range urls {
        wg.Add(1)
        go fetchURL(url, &wg, results)  // 'go' keyword = start goroutine
    }

    // Close channel when all goroutines done:
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results:
    for result := range results {
        fmt.Println(result)
    }
    // All 3 URLs fetched in ~100ms (parallel), not 300ms (sequential)
}
\`\`\`

## Channels

\`\`\`go
// Channels are typed conduits for communication between goroutines

// Unbuffered: sender blocks until receiver is ready (synchronous)
ch := make(chan int)

// Buffered: sender blocks only when buffer is full
buffered := make(chan int, 10)

// Directional channel types in function signatures (better documentation):
func producer(out chan<- int) {    // can only SEND
    for i := 0; i < 5; i++ {
        out <- i
    }
    close(out)
}

func consumer(in <-chan int) {    // can only RECEIVE
    for v := range in {           // range on channel reads until closed
        fmt.Println(v)
    }
}

// Select: multiplex across multiple channels
func fanIn(c1, c2 <-chan string) <-chan string {
    out := make(chan string)
    go func() {
        defer close(out)
        for {
            select {
            case v, ok := <-c1:
                if !ok { c1 = nil }  // Nil channel never selects
                else { out <- v }
            case v, ok := <-c2:
                if !ok { c2 = nil }
                else { out <- v }
            }
            if c1 == nil && c2 == nil { return }
        }
    }()
    return out
}

// Timeout pattern:
select {
case result := <-ch:
    fmt.Println(result)
case <-time.After(5 * time.Second):
    fmt.Println("timeout!")
}

// Context for cancellation (preferred over raw channels):
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case result := <-ch:
    fmt.Println(result)
case <-ctx.Done():
    fmt.Println("cancelled:", ctx.Err())
}
\`\`\`

## sync Package: Low-Level Primitives

\`\`\`go
import "sync"

// Mutex: protect shared state
type SafeCounter struct {
    mu sync.Mutex
    count int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

func (c *SafeCounter) Value() int {
    c.mu.RLock()    // Read lock (multiple readers OK)
    defer c.mu.RUnlock()
    return c.count
}

// sync.Once: run initialization exactly once
var (
    instance *DB
    once     sync.Once
)

func GetDB() *DB {
    once.Do(func() {
        instance = connectDB()  // Called exactly once, even across goroutines
    })
    return instance
}

// sync.Map: concurrent-safe map
var m sync.Map
m.Store("key", "value")
v, ok := m.Load("key")
m.Range(func(k, v any) bool {
    fmt.Println(k, v)
    return true  // continue iteration
})
\`\`\`

## Pipeline Pattern

\`\`\`go
// Pipelines: chain of goroutines connected by channels
// Each stage: reads from upstream channel, processes, sends to downstream

func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

func filter(in <-chan int, pred func(int) bool) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            if pred(n) {
                out <- n
            }
        }
    }()
    return out
}

func main() {
    // Pipeline: generate → square → filter (>10)
    nums := generate(1, 2, 3, 4, 5)
    squares := square(nums)
    large := filter(squares, func(n int) bool { return n > 10 })

    for n := range large {
        fmt.Println(n)   // 16, 25
    }
}
\`\`\`

\`\`\`takeaways
["Goroutines cost 2KB; threads cost 1-8MB — you can have millions of goroutines", "Always use WaitGroup or channel to wait for goroutines — otherwise main() exits and kills them", "Buffered channel = async queue. Unbuffered channel = synchronous rendezvous (both must be ready)", "Select with nil channel: nil channel never selects — use this to 'disable' a case without removing it", "Prefer context.WithTimeout/Cancel over time.After for cancellation — context propagates through call stack", "sync.Once guarantees an initialization function runs exactly once — the correct singleton pattern in Go"]
\`\`\`
`,
    },
  ],
};
