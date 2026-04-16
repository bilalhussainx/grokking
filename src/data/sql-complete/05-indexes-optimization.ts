import { Module } from "../types";

export const module5: Module = {
  id: "indexes-optimization",
  title: "Indexes, Query Optimization & Transactions",
  description: "B-tree indexes, composite indexes, EXPLAIN ANALYZE, query optimization, ACID transactions, and isolation levels",
  lessons: [
    {
      id: "performance-transactions",
      slug: "performance-transactions",
      title: "Indexes, EXPLAIN ANALYZE & ACID Transactions",
      content: `
# SQL Performance & Transactions

## Indexes

\`\`\`sql
-- B-tree index (default) — for equality, range, sorting:
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Unique index (also enforces uniqueness constraint):
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Composite index (column ORDER matters!):
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Useful for: WHERE user_id = 1 AND status = 'active'
-- Useful for: WHERE user_id = 1 (leftmost prefix rule)
-- NOT useful for: WHERE status = 'active' alone

-- Partial index (only indexes rows matching condition):
CREATE INDEX idx_active_users ON users(created_at)
WHERE is_active = TRUE;
-- Smaller index, faster queries for active users only

-- Covering index (includes extra columns to avoid table lookup):
CREATE INDEX idx_orders_covering ON orders(user_id)
INCLUDE (amount, status, created_at);
-- Query: SELECT amount FROM orders WHERE user_id = 1
-- Can be answered entirely from the index — no heap fetch!

-- Full-text search index (PostgreSQL):
CREATE INDEX idx_posts_search ON posts USING GIN(
  to_tsvector('english', title || ' ' || content)
);
-- Query with full-text search:
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('javascript tutorial');

-- Check if index is used:
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';
-- Look for: "Index Scan" or "Index Only Scan" (good) vs "Seq Scan" (potential problem)
\`\`\`

## EXPLAIN ANALYZE

\`\`\`sql
-- EXPLAIN: shows the query plan (no execution)
-- EXPLAIN ANALYZE: executes AND shows plan with actual timings

EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.country = 'US'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;

-- Key things to look for:
-- Node types:
--   Seq Scan       — scans entire table (OK for small tables)
--   Index Scan     — uses index to find rows, then fetches from heap
--   Index Only Scan — answers query from index alone (fastest!)
--   Bitmap Heap Scan — combines index scan with heap access
--   Hash Join      — builds hash table from smaller relation
--   Nested Loop    — for each outer row, scans inner (good with indexes)
--   Merge Join     — sort both sides, merge (good for large sorted sets)
--
-- Key metrics:
--   rows=actual   — actual rows (if estimate >> actual, stats are stale → ANALYZE)
--   cost=X..Y     — X=startup cost, Y=total cost (in arbitrary units)
--   actual time   — in milliseconds
--
-- Run ANALYZE to update statistics:
ANALYZE users; -- update stats for one table
ANALYZE;       -- update stats for all tables

-- Common optimization patterns:
-- 1. Add missing indexes on JOIN and WHERE columns
-- 2. Use covering indexes for frequently accessed column sets
-- 3. Rewrite correlated subqueries as JOINs or CTEs
-- 4. Use LIMIT to reduce result sets
-- 5. Avoid SELECT * — fetch only needed columns
\`\`\`

## Transactions & ACID

\`\`\`sql
-- ACID: Atomicity, Consistency, Isolation, Durability

-- Atomicity: all operations succeed or all are rolled back
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  -- If anything fails, ROLLBACK undoes everything:
COMMIT;
-- OR:
ROLLBACK; -- undo everything

-- Error handling in transactions:
BEGIN;
  SAVEPOINT before_transfer;

  UPDATE accounts SET balance = balance - 100 WHERE id = 1;

  -- Check constraint:
  SELECT balance FROM accounts WHERE id = 1;
  -- If balance < 0:
  -- ROLLBACK TO SAVEPOINT before_transfer; -- rollback to savepoint only
  -- ELSE:

  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

## Isolation Levels

\`\`\`concept
{
  "title": "SQL Isolation Levels",
  "description": "Control how transactions see each other's changes — higher isolation = fewer concurrency issues but lower throughput",
  "points": [
    "READ UNCOMMITTED: sees uncommitted changes from other transactions (dirty reads) — rarely used",
    "READ COMMITTED (default PostgreSQL): only sees committed data, but non-repeatable reads possible",
    "REPEATABLE READ: snapshot of data at start of transaction — phantom reads possible in some DBs",
    "SERIALIZABLE: fully isolated — behaves as if transactions ran one at a time (highest safety, lowest throughput)"
  ]
}
\`\`\`

\`\`\`sql
-- Set isolation level:
BEGIN ISOLATION LEVEL SERIALIZABLE;
  -- All reads are consistent within this transaction
  SELECT balance FROM accounts WHERE id = 1; -- reads consistent snapshot
  -- ... do work ...
COMMIT;

-- FOR UPDATE: lock rows to prevent concurrent modification
BEGIN;
  SELECT * FROM accounts WHERE id = 1 FOR UPDATE; -- locks the row!
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
-- No other transaction can UPDATE this row until COMMIT

-- FOR UPDATE SKIP LOCKED: skip locked rows (useful for job queues):
BEGIN;
  SELECT * FROM jobs WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED; -- grab first unlocked job
COMMIT;
\`\`\`

## Schema Design

\`\`\`sql
-- Data types:
-- Integer: SMALLINT (2B), INTEGER (4B), BIGINT (8B), SERIAL (auto-increment)
-- Text: VARCHAR(n), TEXT (unlimited), CHAR(n) (fixed, pads with spaces)
-- Numbers: NUMERIC(precision, scale), REAL, DOUBLE PRECISION
-- Time: DATE, TIME, TIMESTAMP, TIMESTAMPTZ (with timezone — ALWAYS use this!)
-- Boolean: BOOLEAN (true/false/null)
-- UUID: UUID (use gen_random_uuid())
-- JSON: JSON (stored as text), JSONB (binary, indexable — prefer JSONB)

CREATE TABLE posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,
  status      VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata    JSONB
);

-- Automatically update updated_at:
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
\`\`\`

\`\`\`takeaways
["B-tree indexes: add them on columns in WHERE, JOIN ON, and ORDER BY clauses", "Composite index column order matters — most selective or most commonly filtered column first", "EXPLAIN ANALYZE reveals actual vs estimated rows — big discrepancy means stale stats (run ANALYZE)", "Transactions are ACID: all operations commit together or none do (atomicity)", "Use TIMESTAMPTZ (not TIMESTAMP) to store dates with timezone — avoids daylight saving bugs", "FOR UPDATE locks rows within a transaction; SKIP LOCKED enables concurrent job queues", "JSONB is better than JSON — binary storage, indexable with GIN, supports operators like @>", "Covering indexes (INCLUDE columns) enable Index Only Scans — zero heap access"]
\`\`\`
`,
    },
  ],
};
