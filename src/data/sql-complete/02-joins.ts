import { Module } from "../types";

export const module2: Module = {
  id: "joins",
  title: "JOINs: Combining Tables",
  description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, self-joins, and multi-table JOINs",
  lessons: [
    {
      id: "joins-mastery",
      slug: "joins-mastery",
      title: "All Types of SQL JOINs",
      content: `
# SQL JOINs

JOINs combine rows from two or more tables based on a related column.

## Understanding JOINs with a Schema

\`\`\`sql
-- Example schema we'll use throughout:
-- users:   id, name, email, department_id
-- orders:  id, user_id, amount, status, created_at
-- products: id, name, price, category_id
-- order_items: order_id, product_id, quantity, unit_price
-- departments: id, name, manager_id
\`\`\`

## INNER JOIN — Only Matching Rows

\`\`\`sql
-- INNER JOIN: returns rows where the join condition is met in BOTH tables
SELECT
  u.name,
  u.email,
  o.id     AS order_id,
  o.amount,
  o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
-- Users with no orders: NOT included
-- Orders with no matching user: NOT included

-- Multiple JOINs:
SELECT
  u.name         AS customer,
  o.id           AS order_id,
  p.name         AS product,
  oi.quantity,
  oi.unit_price,
  oi.quantity * oi.unit_price AS line_total
FROM orders o
JOIN users u       ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p    ON oi.product_id = p.id
WHERE o.status = 'completed';
\`\`\`

## LEFT JOIN — All from Left Table

\`\`\`sql
-- LEFT JOIN: all rows from left table + matching from right (NULL if no match)
-- Most commonly used JOIN type!

-- Find users with and without orders:
SELECT
  u.name,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- Users who have NEVER placed an order:
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;  -- the key: null join means no match!

-- Products never ordered:
SELECT p.name, p.price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.product_id IS NULL;
\`\`\`

## RIGHT JOIN & FULL OUTER JOIN

\`\`\`sql
-- RIGHT JOIN: all from right table + matching from left
-- (Rarely used — just flip the table order and use LEFT JOIN instead)
SELECT u.name, d.name AS department
FROM departments d
RIGHT JOIN users u ON d.id = u.department_id;
-- Same as:
SELECT u.name, d.name AS department
FROM users u
LEFT JOIN departments d ON u.department_id = d.id;

-- FULL OUTER JOIN: all rows from both tables (null where no match)
SELECT
  u.name    AS user_name,
  d.name    AS department_name
FROM users u
FULL OUTER JOIN departments d ON u.department_id = d.id;
-- Shows users without department AND departments without users

-- Symmetric difference: rows in one but not both:
SELECT u.name, d.name
FROM users u
FULL OUTER JOIN departments d ON u.department_id = d.id
WHERE u.id IS NULL OR d.id IS NULL;
\`\`\`

## Self-JOIN & Cross JOIN

\`\`\`sql
-- Self-JOIN: join a table with itself
-- Find employees and their managers (same table!):
SELECT
  emp.name  AS employee,
  mgr.name  AS manager
FROM employees emp
LEFT JOIN employees mgr ON emp.manager_id = mgr.id;

-- Find users in the same city:
SELECT
  a.name AS user1,
  b.name AS user2,
  a.city
FROM users a
JOIN users b ON a.city = b.city AND a.id < b.id; -- avoid duplicates and self-pairs

-- CROSS JOIN: every combination of rows (Cartesian product)
-- Use sparingly — can produce huge result sets!
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c;
-- 3 sizes × 4 colors = 12 rows

-- Useful for generating test data or date ranges:
SELECT
  d::date AS day
FROM generate_series('2024-01-01', '2024-12-31', '1 day'::interval) d;
-- PostgreSQL specific — generates all days in 2024
\`\`\`

## JOIN Performance Tips

\`\`\`sql
-- JOIN columns should be indexed:
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Explain plans show how the DB executes your JOINs:
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
-- Look for: "Seq Scan" (bad for large tables) vs "Index Scan" (good)
-- Hash Join vs Nested Loop Join vs Merge Join

-- Filter early to reduce JOIN cost:
-- ❌ Slower — joins everything then filters:
SELECT u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed' AND u.country = 'US';

-- ✅ Same result but optimizer does it efficiently — use EXPLAIN to verify
-- (Modern optimizers push filters down automatically, but be aware)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "How do you find rows that exist in table A but NOT in table B?",
      "options": [
        "Use EXCEPT",
        "LEFT JOIN B ON A.id = B.ref_id WHERE B.ref_id IS NULL",
        "Both A and B work",
        "NOT IN (SELECT id FROM B)"
      ],
      "answer": 2,
      "explanation": "Both methods work: LEFT JOIN ... WHERE B.key IS NULL and NOT IN (SELECT...) or NOT EXISTS find rows in A without matches in B. LEFT JOIN with NULL check is often more efficient. NOT IN can be slow on large tables and has NULL pitfalls (use NOT EXISTS instead)."
    },
    {
      "q": "What does INNER JOIN return when there are no matching rows?",
      "options": [
        "NULL values",
        "An empty result set — INNER JOIN only returns rows where the join condition matches in BOTH tables",
        "All rows from the left table",
        "An error"
      ],
      "answer": 1,
      "explanation": "INNER JOIN is exclusive — if a row in the left table has no matching row in the right table (or vice versa), neither row appears in the result. Use LEFT JOIN to include all rows from the left table regardless of matches."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
