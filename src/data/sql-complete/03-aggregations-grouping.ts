import { Module } from "../types";

export const module3: Module = {
  id: "aggregations-grouping",
  title: "Aggregations, GROUP BY & HAVING",
  description: "COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, ROLLUP, and aggregate patterns",
  lessons: [
    {
      id: "aggregate-functions",
      slug: "aggregate-functions",
      title: "Aggregate Functions & GROUP BY",
      content: `
# Aggregations & GROUP BY

## Aggregate Functions

\`\`\`sql
-- Aggregate functions compute a single result from a set of rows:
SELECT
  COUNT(*)                    AS total_orders,
  COUNT(DISTINCT user_id)     AS unique_customers,
  SUM(amount)                 AS total_revenue,
  AVG(amount)                 AS avg_order_value,
  MIN(amount)                 AS smallest_order,
  MAX(amount)                 AS largest_order,
  ROUND(AVG(amount), 2)       AS avg_rounded,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_amount
FROM orders
WHERE status = 'completed';

-- COUNT(*) counts all rows including NULLs
-- COUNT(column) counts non-NULL values only:
SELECT
  COUNT(*) AS total_rows,
  COUNT(phone) AS rows_with_phone  -- NULLs not counted
FROM users;

-- FILTER clause (PostgreSQL) — conditional aggregation:
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'active')    AS active,
  COUNT(*) FILTER (WHERE status = 'inactive')  AS inactive,
  SUM(amount) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') AS revenue_30d
FROM users;
\`\`\`

## GROUP BY

\`\`\`sql
-- GROUP BY: split rows into groups, apply aggregate to each group
-- Rule: every column in SELECT must either be in GROUP BY or be an aggregate

-- Revenue by country:
SELECT
  country,
  COUNT(*) AS user_count,
  COUNT(DISTINCT city) AS city_count,
  AVG(age) AS avg_age
FROM users
GROUP BY country
ORDER BY user_count DESC;

-- Orders by month:
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS order_count,
  SUM(amount) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Multi-column grouping:
SELECT
  category,
  status,
  COUNT(*) AS count,
  SUM(amount) AS total
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY category, status
ORDER BY category, count DESC;

-- GROUP BY with JOIN:
SELECT
  d.name AS department,
  COUNT(e.id) AS headcount,
  AVG(e.salary) AS avg_salary,
  SUM(e.salary) AS total_payroll
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY total_payroll DESC;
\`\`\`

## HAVING — Filtering Groups

\`\`\`sql
-- WHERE filters individual rows (before grouping)
-- HAVING filters groups (after grouping)

-- Customers who spent more than $1000 total:
SELECT
  user_id,
  COUNT(*) AS order_count,
  SUM(amount) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 1000
ORDER BY total_spent DESC;

-- Products ordered more than 50 times:
SELECT
  product_id,
  COUNT(*) AS times_ordered,
  SUM(quantity) AS units_sold
FROM order_items
GROUP BY product_id
HAVING COUNT(*) > 50
ORDER BY units_sold DESC;

-- Departments with more than 10 employees AND average salary > 70000:
SELECT
  department,
  COUNT(*) AS headcount,
  AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 10 AND AVG(salary) > 70000;

-- WHERE vs HAVING — use both:
SELECT
  country,
  COUNT(*) AS order_count,
  AVG(amount) AS avg_amount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'completed'        -- filter rows before grouping
  AND o.created_at > '2024-01-01'
GROUP BY country
HAVING COUNT(*) >= 10               -- filter groups after aggregating
ORDER BY avg_amount DESC;
\`\`\`

## ROLLUP & CUBE (Subtotals)

\`\`\`sql
-- ROLLUP: generates subtotals and grand total
SELECT
  category,
  subcategory,
  SUM(amount) AS revenue
FROM sales
GROUP BY ROLLUP(category, subcategory);
-- Produces rows for: each (category, subcategory), each category total, grand total

-- Identify totals with GROUPING():
SELECT
  CASE WHEN GROUPING(category) = 1 THEN 'ALL' ELSE category END AS category,
  CASE WHEN GROUPING(subcategory) = 1 THEN 'ALL' ELSE subcategory END AS subcategory,
  SUM(amount)
FROM sales
GROUP BY ROLLUP(category, subcategory);

-- CUBE: all possible subtotal combinations
GROUP BY CUBE(year, quarter, region);
-- Subtotals for every combination of dimensions
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between WHERE and HAVING?",
      "options": [
        "They are identical",
        "WHERE filters individual rows before grouping; HAVING filters groups after aggregation",
        "HAVING is faster than WHERE",
        "WHERE works with aggregates, HAVING doesn't"
      ],
      "answer": 1,
      "explanation": "WHERE runs first — it filters individual rows before GROUP BY is applied. HAVING runs after GROUP BY — it filters the grouped results. You cannot use aggregate functions in WHERE (e.g., WHERE COUNT(*) > 5 is invalid). Use HAVING SUM(amount) > 100 for aggregate conditions."
    },
    {
      "q": "What does COUNT(*) vs COUNT(column) return differently?",
      "options": [
        "No difference",
        "COUNT(*) counts all rows including NULLs; COUNT(column) only counts non-NULL values in that column",
        "COUNT(column) is always larger",
        "COUNT(*) is deprecated"
      ],
      "answer": 1,
      "explanation": "COUNT(*) counts every row regardless of NULL values. COUNT(column_name) only counts rows where that specific column is NOT NULL. Use COUNT(DISTINCT column) to count unique non-null values."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
