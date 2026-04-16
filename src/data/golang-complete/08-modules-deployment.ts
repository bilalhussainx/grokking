import { Module } from "../types";

export const module8: Module = {
  id: "modules-deployment",
  title: "Go Modules, CLI Tools & Production Deployment",
  description: "Go module system, workspace mode, building CLI tools with Cobra, cross-compilation, Docker multi-stage builds, and production deployment patterns",
  lessons: [
    {
      id: "modules-deployment",
      slug: "modules-deployment",
      title: "Modules, CLI & Deployment",
      content: `# Go Modules, CLI Tools & Deployment

Go modules are the official dependency management system. Combined with Go's static binaries and cross-compilation, deploying Go to production is simpler than almost any other language.

---

\`\`\`concept
{
  "title": "Go Modules vs GOPATH",
  "variant": "mental-model",
  "content": "Before Go 1.11, all Go code lived in \\\$GOPATH/src — a global workspace. Modules replaced this: each project has its own go.mod declaring its module path and dependencies. You can work anywhere on the filesystem. Versions are pinned in go.sum (cryptographic checksums). go get downloads, go mod tidy cleans up, go mod vendor copies deps locally — zero magic, full reproducibility."
}
\`\`\`

---

## Go Module Basics

\`\`\`go
// go.mod — created by: go mod init github.com/yourorg/myapp
module github.com/yourorg/myapp

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/jmoiron/sqlx v1.3.5
    google.golang.org/grpc v1.60.0
)

require (
    // Indirect deps (auto-managed by go mod tidy):
    golang.org/x/net v0.17.0 // indirect
)
\`\`\`

\`\`\`bash
# Common module commands:
go mod init github.com/yourorg/myapp   # create new module
go mod tidy                            # add missing, remove unused deps
go get github.com/pkg/errors@v0.9.1   # add/upgrade dependency
go get github.com/pkg/errors@none      # remove dependency
go mod vendor                          # copy deps to vendor/ (for air-gapped builds)
go mod download                        # pre-download all deps
go list -m all                         # list all dependencies + versions

# Replace a dep with a local fork:
# In go.mod:
# replace github.com/original/pkg => ../my-fork
\`\`\`

## Workspace Mode (Go 1.18+)

\`\`\`bash
# Workspace — work on multiple modules simultaneously without replace directives:
go work init ./myapp ./shared-lib

# go.work is created:
go 1.22
use (
    ./myapp
    ./shared-lib
)

# Now myapp can import shared-lib as if it were published — no local replace needed
# go.work is NOT committed to git — it's per-developer
\`\`\`

## Building CLI Tools with Cobra

\`\`\`go
// go get github.com/spf13/cobra

// cmd/root.go:
package cmd

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
    "github.com/spf13/viper"
)

var (
    cfgFile string
    verbose bool
)

var rootCmd = &cobra.Command{
    Use:   "myapp",
    Short: "My CLI application",
    Long:  \`A complete CLI application built with Cobra\`,
    // PersistentPreRun runs before any subcommand:
    PersistentPreRun: func(cmd *cobra.Command, args []string) {
        if verbose {
            fmt.Println("Verbose mode enabled")
        }
    },
}

func Execute() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}

func init() {
    cobra.OnInitialize(initConfig)
    rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default: \$HOME/.myapp.yaml)")
    rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "verbose output")
}

// cmd/serve.go:
var serveCmd = &cobra.Command{
    Use:   "serve",
    Short: "Start the HTTP server",
    RunE: func(cmd *cobra.Command, args []string) error {
        port, _ := cmd.Flags().GetInt("port")
        return startServer(port)
    },
}

func init() {
    rootCmd.AddCommand(serveCmd)
    serveCmd.Flags().IntP("port", "p", 8080, "Port to listen on")
}

// cmd/migrate.go:
var migrateCmd = &cobra.Command{
    Use:   "migrate [up|down|status]",
    Short: "Database migrations",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        switch args[0] {
        case "up":   return runMigrationsUp()
        case "down": return runMigrationsDown()
        default:     return fmt.Errorf("unknown direction: %s", args[0])
        }
    },
}
\`\`\`

## Cross-Compilation

\`\`\`bash
# Go compiles to any target from any machine:
# Set GOOS (target OS) and GOARCH (target architecture)

# Build for Linux from macOS/Windows:
GOOS=linux GOARCH=amd64 go build -o bin/myapp-linux-amd64 ./cmd/myapp

# Build for macOS:
GOOS=darwin GOARCH=arm64 go build -o bin/myapp-darwin-arm64 ./cmd/myapp  # M1/M2

# Build for Windows:
GOOS=windows GOARCH=amd64 go build -o bin/myapp.exe ./cmd/myapp

# All platform build script:
platforms=("linux/amd64" "linux/arm64" "darwin/amd64" "darwin/arm64" "windows/amd64")
for platform in "\${platforms[@]}"; do
    GOOS=\${platform%/*} GOARCH=\${platform#*/} go build \\
        -ldflags="-s -w -X main.version=\$(git describe --tags)" \\
        -o "dist/myapp-\${platform//\\//-}" ./cmd/myapp
done

# -s -w: strip debug info (reduces binary size 30-40%)
# -X main.version: embed version string at compile time
\`\`\`

## Docker Multi-Stage Build

\`\`\`dockerfile
# Dockerfile — multi-stage build for minimal production images:

# Stage 1: Build
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download                    # cache deps layer separately

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \\
    -ldflags="-s -w" \\
    -o /app/server ./cmd/server

# Stage 2: Run — scratch or distroless for minimum size
FROM gcr.io/distroless/static-debian12
# FROM scratch  # even smaller, but no shell at all

WORKDIR /
COPY --from=builder /app/server /server
COPY --from=builder /app/configs /configs

# Non-root user (security best practice):
USER nonroot:nonroot

EXPOSE 8080
ENTRYPOINT ["/server"]

# Result: ~15MB image vs ~800MB if you shipped the builder stage
# CGO_ENABLED=0: statically linked binary — no glibc dependency
\`\`\`

## Configuration with Viper

\`\`\`go
// go get github.com/spf13/viper

// Viper reads config from: env vars > config file > defaults
func initConfig() {
    viper.SetDefault("server.port", 8080)
    viper.SetDefault("db.max_conns", 25)

    if cfgFile != "" {
        viper.SetConfigFile(cfgFile)
    } else {
        viper.SetConfigName("config")
        viper.SetConfigType("yaml")
        viper.AddConfigPath(".")
        viper.AddConfigPath("\$HOME/.myapp")
    }

    // Auto-read from env: SERVER_PORT maps to server.port
    viper.SetEnvPrefix("MYAPP")
    viper.AutomaticEnv()
    viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

    if err := viper.ReadInConfig(); err == nil {
        fmt.Printf("Using config: %s\\n", viper.ConfigFileUsed())
    }
}

// config.yaml:
// server:
//   port: 8080
//   read_timeout: 30s
// db:
//   url: postgres://localhost/myapp
//   max_conns: 25

type Config struct {
    Server struct {
        Port        int           \`mapstructure:"port"\`
        ReadTimeout time.Duration \`mapstructure:"read_timeout"\`
    } \`mapstructure:"server"\`
    DB struct {
        URL      string \`mapstructure:"url"\`
        MaxConns int    \`mapstructure:"max_conns"\`
    } \`mapstructure:"db"\`
}

var cfg Config
viper.Unmarshal(&cfg)
\`\`\`

## Graceful Shutdown

\`\`\`go
func main() {
    srv := &http.Server{Addr: ":8080", Handler: router}

    // Start server in goroutine:
    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatalf("server: %v", err)
        }
    }()
    log.Println("Server running on :8080")

    // Wait for SIGINT or SIGTERM:
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    // Graceful shutdown — wait up to 30s for in-flight requests:
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("forced shutdown: %v", err)
    }

    // Close DB pool, flush metrics, etc:
    db.Close()
    log.Println("Server exited cleanly")
}
\`\`\`

\`\`\`takeaways
["go mod tidy after every dependency change — it adds missing imports and removes unused ones.", "CGO_ENABLED=0 produces a fully static binary — no shared libraries, works in scratch/distroless containers.", "Multi-stage Dockerfile: build in golang:alpine (800MB), copy binary to distroless (15MB) — 50x smaller.", "Cobra PersistentFlags are available to all subcommands; Flags are local to that command only.", "GOOS + GOARCH enables cross-compilation from any machine — build Linux binaries on macOS with no extra tooling.", "Graceful shutdown: http.Server.Shutdown(ctx) drains existing connections before closing — always implement this."]
\`\`\`
`,
    },
  ],
};
