import { Module } from "../types";

export const module6: Module = {
  id: "database-sqlx",
  title: "Database Access: database/sql, sqlx & pgx",
  description: "Connect to PostgreSQL with database/sql and sqlx, write safe parameterized queries, handle transactions, and use connection pools correctly",
  lessons: [
    {
      id: "database-sqlx",
      slug: "database-sqlx",
      title: "Database Access in Go",
      content: `# Database Access in Go

Go's \`database/sql\` package provides a clean abstraction over any SQL database. The \`sqlx\` and \`pgx\` libraries add ergonomics without hiding what's happening.

---

\`\`\`concept
{
  "title": "database/sql Design Philosophy",
  "variant": "mental-model",
  "content": "database/sql is deliberately minimal — it manages a connection pool, marshals query parameters, and scans rows into values. You write real SQL, not an ORM. This means queries are readable, portable, and easy to optimize with EXPLAIN ANALYZE. The trade-off is more boilerplate than an ORM — but the explicit control pays off at scale."
}
\`\`\`

---

## Connecting & Connection Pool

\`\`\`go
package main

import (
    "database/sql"
    "log"
    "time"

    _ "github.com/lib/pq"          // PostgreSQL driver (side-effect import)
    // OR use: github.com/jackc/pgx/v5/stdlib
)

func main() {
    db, err := sql.Open("postgres", "host=localhost user=app dbname=appdb sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Verify connection:
    if err := db.Ping(); err != nil {
        log.Fatal("cannot connect to DB:", err)
    }

    // Connection pool tuning (CRITICAL for production):
    db.SetMaxOpenConns(25)         // max concurrent connections
    db.SetMaxIdleConns(25)         // keep idle connections alive
    db.SetConnMaxLifetime(5 * time.Minute)  // recycle old connections
    db.SetConnMaxIdleTime(5 * time.Minute)  // close idle connections

    // Rule of thumb: MaxOpenConns = (PostgreSQL max_connections) / (number of app instances)
    // Default PostgreSQL max_connections = 100
    // 4 app instances → 25 each
}
\`\`\`

## CRUD with database/sql

\`\`\`go
type User struct {
    ID        int
    Name      string
    Email     string
    CreatedAt time.Time
}

// --- Query single row ---
func GetUser(db *sql.DB, id int) (*User, error) {
    u := &User{}
    // \$1 placeholder (PostgreSQL syntax — MySQL uses ?)
    err := db.QueryRow(
        "SELECT id, name, email, created_at FROM users WHERE id = \$1",
        id,
    ).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)

    if err == sql.ErrNoRows {
        return nil, nil  // not found, not an error
    }
    if err != nil {
        return nil, fmt.Errorf("GetUser(%d): %w", id, err)
    }
    return u, nil
}

// --- Query multiple rows ---
func ListUsers(db *sql.DB, limit int) ([]User, error) {
    rows, err := db.Query(
        "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT \$1",
        limit,
    )
    if err != nil {
        return nil, fmt.Errorf("ListUsers: %w", err)
    }
    defer rows.Close()  // ALWAYS close rows

    var users []User
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt); err != nil {
            return nil, fmt.Errorf("scan: %w", err)
        }
        users = append(users, u)
    }
    return users, rows.Err()  // check for iteration errors
}

// --- Insert ---
func CreateUser(db *sql.DB, name, email string) (int, error) {
    var id int
    err := db.QueryRow(
        "INSERT INTO users (name, email) VALUES (\$1, \$2) RETURNING id",
        name, email,
    ).Scan(&id)
    return id, err
}

// --- Update ---
func UpdateEmail(db *sql.DB, id int, email string) error {
    result, err := db.Exec(
        "UPDATE users SET email = \$1 WHERE id = \$2",
        email, id,
    )
    if err != nil {
        return err
    }
    n, _ := result.RowsAffected()
    if n == 0 {
        return fmt.Errorf("user %d not found", id)
    }
    return nil
}
\`\`\`

## Transactions

\`\`\`go
// Transactions ensure multiple operations succeed or all roll back:
func TransferMoney(db *sql.DB, fromID, toID int, amount float64) error {
    // Begin transaction:
    tx, err := db.Begin()
    if err != nil {
        return fmt.Errorf("begin tx: %w", err)
    }
    // Defer rollback — if Commit() is called, this is a no-op:
    defer tx.Rollback()

    // Debit from sender:
    _, err = tx.Exec(
        "UPDATE accounts SET balance = balance - \$1 WHERE id = \$2 AND balance >= \$1",
        amount, fromID,
    )
    if err != nil {
        return fmt.Errorf("debit: %w", err)
    }

    // Credit to receiver:
    _, err = tx.Exec(
        "UPDATE accounts SET balance = balance + \$1 WHERE id = \$2",
        amount, toID,
    )
    if err != nil {
        return fmt.Errorf("credit: %w", err)
    }

    // Commit — if this fails, defer Rollback() cleans up:
    if err := tx.Commit(); err != nil {
        return fmt.Errorf("commit: %w", err)
    }
    return nil
}
\`\`\`

## sqlx: Ergonomic Scanning

\`\`\`go
import "github.com/jmoiron/sqlx"

// sqlx adds struct scanning and named queries:
type User struct {
    ID        int       \`db:"id"\`
    Name      string    \`db:"name"\`
    Email     string    \`db:"email"\`
    CreatedAt time.Time \`db:"created_at"\`
}

db, _ := sqlx.Connect("postgres", dsn)

// Get single row into struct:
var user User
err := db.Get(&user, "SELECT * FROM users WHERE id = \$1", 42)

// Get multiple rows into slice:
var users []User
err = db.Select(&users, "SELECT * FROM users ORDER BY name")

// Named parameters (use maps or structs):
_, err = db.NamedExec(
    "INSERT INTO users (name, email) VALUES (:name, :email)",
    map[string]interface{}{"name": "Alice", "email": "alice@example.com"},
)

// IN clause helper (expands a slice into \$1, \$2, \$3...):
ids := []int{1, 2, 3}
query, args, _ := sqlx.In("SELECT * FROM users WHERE id IN (?)", ids)
query = db.Rebind(query)  // converts ? to \$1, \$2... for PostgreSQL
db.Select(&users, query, args...)
\`\`\`

## pgx v5: High-Performance PostgreSQL

\`\`\`go
import (
    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"
)

// pgxpool — connection pool with pgx features:
pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
defer pool.Close()

// Collect rows into structs via pgx.CollectRows:
rows, _ := pool.Query(ctx, "SELECT id, name, email FROM users")
users, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])

// Batch queries — send multiple queries in one round trip:
batch := &pgx.Batch{}
batch.Queue("UPDATE users SET login_count = login_count + 1 WHERE id = \$1", userID)
batch.Queue("INSERT INTO audit_log (user_id, action) VALUES (\$1, 'login')", userID)

br := pool.SendBatch(ctx, batch)
defer br.Close()

_, err = br.Exec()  // process first query result
_, err = br.Exec()  // process second query result

// COPY protocol — bulk insert (orders of magnitude faster than INSERT):
_, err = pool.CopyFrom(ctx,
    pgx.Identifier{"users"},
    []string{"name", "email"},
    pgx.CopyFromRows([][]interface{}{
        {"Alice", "alice@example.com"},
        {"Bob", "bob@example.com"},
    }),
)
\`\`\`

\`\`\`compare
{
  "title": "database/sql vs sqlx vs pgx",
  "items": [
    {
      "name": "database/sql",
      "description": "Standard library, works with any SQL driver. Manual Scan() calls, no struct mapping. Best for: simple apps, maximum portability across databases."
    },
    {
      "name": "sqlx",
      "description": "Thin wrapper over database/sql. Adds struct scanning with db: tags, named queries, IN clause expansion. Best for: teams familiar with raw SQL who want less boilerplate."
    },
    {
      "name": "pgx v5",
      "description": "PostgreSQL-specific driver with full protocol support. Batch queries, COPY protocol, LISTEN/NOTIFY, array types, and pgxpool. Best for: high-throughput PostgreSQL apps where performance matters."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Always defer rows.Close() immediately after Query() — leaked rows hold a connection hostage.", "SetMaxOpenConns(25) + SetMaxIdleConns(25) — tune based on PostgreSQL max_connections divided by app instances.", "defer tx.Rollback() before any early return — it's a no-op if Commit() already succeeded.", "Never use fmt.Sprintf to build SQL — always use parameterized queries (\$1, \$2) to prevent SQL injection.", "sqlx struct tags (db:'column_name') eliminate manual Scan() — just call db.Get() or db.Select().", "pgx COPY protocol is 10-100x faster than batch INSERT — use it for bulk data loading."]
\`\`\`
`,
    },
  ],
};
