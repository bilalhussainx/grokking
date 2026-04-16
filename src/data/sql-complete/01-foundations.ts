import { Module } from "../types";

export const module1: Module = {
  id: "sql-foundations",
  title: "SQL Foundations: Queries, Filtering & Sorting",
  description: "SELECT, WHERE, ORDER BY, LIMIT, OFFSET — the building blocks of every SQL query",
  lessons: [
    {
      id: "basic-queries",
      slug: "basic-queries",
      title: "SELECT, WHERE, ORDER BY & LIMIT",
      content: `
# SQL Foundations

SQL (Structured Query Language) is the language of relational databases. Learning it once lets you work with PostgreSQL, MySQL, SQLite, and SQL Server.

## SELECT Basics

\`\`\`sql
-- Select all columns:
SELECT * FROM users;

-- Select specific columns:
SELECT id, name, email FROM users;

-- Aliases:
SELECT
  id,
  first_name || ' ' || last_name AS full_name,
  LOWER(email)                   AS email_lower,
  ROUND(salary / 12.0, 2)        AS monthly_salary
FROM employees;

-- Distinct values:
SELECT DISTINCT country FROM users;
SELECT DISTINCT country, city FROM users; -- unique (country, city) combinations

-- Computed columns:
SELECT
  product_name,
  price,
  price * 0.9 AS discounted_price,
  price * quantity AS total_value
FROM products;
\`\`\`

## WHERE — Filtering

\`\`\`sql
-- Comparison operators: = <> != < > <= >=
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE country = 'US';
SELECT * FROM users WHERE country != 'US';

-- AND, OR, NOT:
SELECT * FROM users WHERE age >= 18 AND country = 'US';
SELECT * FROM users WHERE city = 'NYC' OR city = 'LA';
SELECT * FROM users WHERE NOT (country = 'US' OR country = 'CA');

-- IN — shorthand for multiple OR:
SELECT * FROM users WHERE country IN ('US', 'CA', 'UK', 'AU');
SELECT * FROM users WHERE id NOT IN (1, 2, 3);

-- BETWEEN (inclusive on both ends):
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';
SELECT * FROM products WHERE price BETWEEN 10 AND 100;

-- LIKE — pattern matching:
SELECT * FROM users WHERE name LIKE 'A%';    -- starts with A
SELECT * FROM users WHERE name LIKE '%son';  -- ends with son
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE name LIKE '_a%';  -- 2nd char is 'a'
-- ILIKE in PostgreSQL for case-insensitive
SELECT * FROM users WHERE name ILIKE '%alice%';

-- NULL handling — always use IS NULL / IS NOT NULL:
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;
-- WHERE phone = NULL is ALWAYS FALSE! NULL ≠ NULL
\`\`\`

## ORDER BY & LIMIT

\`\`\`sql
-- ORDER BY (ASC is default):
SELECT * FROM products ORDER BY price;
SELECT * FROM products ORDER BY price DESC;
SELECT * FROM products ORDER BY category ASC, price DESC; -- multi-column sort

-- NULL ordering (PostgreSQL):
SELECT * FROM products ORDER BY price NULLS LAST;

-- LIMIT & OFFSET (pagination):
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;          -- first 10
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20; -- page 3 (0-indexed)

-- Keyset pagination (better for large datasets):
-- Instead of OFFSET, use the last seen ID:
SELECT * FROM posts
WHERE created_at < '2024-01-15 12:00:00'  -- last seen timestamp
ORDER BY created_at DESC
LIMIT 10;
-- More efficient than OFFSET for deep pagination!

-- TOP N per group (using LIMIT with subquery):
-- Get top 3 products by price per category:
SELECT * FROM (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM products
) ranked
WHERE rn <= 3;
\`\`\`

## String & Date Functions

\`\`\`sql
-- String functions (PostgreSQL):
SELECT UPPER(name), LOWER(email), LENGTH(name) FROM users;
SELECT TRIM(' hello world ');        -- 'hello world'
SELECT LTRIM('   hello'), RTRIM('world   ');
SELECT SUBSTRING(email, 1, 5);       -- first 5 chars
SELECT REPLACE(bio, 'badword', '***');
SELECT SPLIT_PART(email, '@', 2);    -- domain part
SELECT STRING_AGG(name, ', ') FROM users; -- aggregate into CSV

-- Date/time:
SELECT NOW();                         -- current timestamp with timezone
SELECT CURRENT_DATE;                  -- current date only
SELECT EXTRACT(YEAR FROM created_at) AS year FROM posts;
SELECT EXTRACT(MONTH FROM created_at) AS month FROM posts;
SELECT DATE_TRUNC('month', created_at) FROM posts; -- truncate to month start
SELECT created_at + INTERVAL '7 days' AS expires_at FROM subscriptions;
SELECT AGE(NOW(), birth_date) AS user_age FROM users; -- 'X years Y months...'
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why does WHERE phone = NULL never return results?",
      "options": [
        "NULL is a reserved keyword",
        "NULL represents unknown — comparisons with NULL always return NULL (not true). Use IS NULL instead.",
        "= doesn't work with NULL columns",
        "NULL is always false in WHERE"
      ],
      "answer": 1,
      "explanation": "In SQL, NULL means 'unknown value.' Comparing anything to NULL (including NULL = NULL) returns NULL, not TRUE. The WHERE clause only includes rows where the condition is TRUE. Always use IS NULL or IS NOT NULL for null checks."
    },
    {
      "q": "What is the performance problem with OFFSET-based pagination on large tables?",
      "options": [
        "OFFSET is not supported in PostgreSQL",
        "The database must scan and discard all OFFSET rows — getting page 1000 is 1000x slower than page 1",
        "OFFSET only works with integers",
        "No performance difference"
      ],
      "answer": 1,
      "explanation": "OFFSET tells the database to skip N rows, but it still has to scan them. For OFFSET 10000, the DB scans 10,010 rows and discards 10,000. Keyset pagination (WHERE id > last_id) jumps directly to the next page via an index — O(log n) instead of O(n)."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
