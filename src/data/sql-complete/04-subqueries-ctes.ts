import { Module } from "../types";

export const module4: Module = {
  id: "subqueries-ctes",
  title: "Subqueries, CTEs & Window Functions",
  description: "Subqueries (correlated and non-correlated), Common Table Expressions (WITH), and powerful window functions",
  lessons: [
    {
      id: "subqueries",
      slug: "subqueries",
      title: "Subqueries & CTEs",
      content: `
# Subqueries & Common Table Expressions

## Subqueries

\`\`\`sql
-- Non-correlated subquery (runs once):
-- Find users who have placed orders above the average order value:
SELECT name, email
FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  WHERE amount > (SELECT AVG(amount) FROM orders) -- scalar subquery
);

-- Subquery in FROM clause (derived table):
SELECT
  category,
  avg_price,
  RANK() OVER (ORDER BY avg_price DESC) AS rank
FROM (
  SELECT
    category,
    AVG(price) AS avg_price
  FROM products
  GROUP BY category
) category_averages;

-- Subquery in SELECT (scalar — returns one value):
SELECT
  p.name,
  p.price,
  (SELECT AVG(price) FROM products WHERE category = p.category) AS category_avg,
  p.price - (SELECT AVG(price) FROM products WHERE category = p.category) AS vs_avg
FROM products p;

-- Correlated subquery (runs once per row — can be slow!):
SELECT
  e.name,
  e.salary,
  e.department
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department = e.department  -- references outer query's row!
);
-- Use with caution on large tables — JOIN + subquery often faster

-- EXISTS vs IN:
-- EXISTS: stops as soon as it finds a match (usually faster)
SELECT name FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.amount > 500
);

-- NOT EXISTS: find users with no large orders
SELECT name FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.amount > 500
);
\`\`\`

## Common Table Expressions (WITH)

\`\`\`sql
-- CTE: name a subquery for readability and reuse

-- Simple CTE:
WITH high_value_orders AS (
  SELECT user_id, SUM(amount) AS total_spent
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
  HAVING SUM(amount) > 1000
)
SELECT u.name, u.email, hvo.total_spent
FROM users u
JOIN high_value_orders hvo ON u.id = hvo.user_id
ORDER BY hvo.total_spent DESC;

-- Multiple CTEs:
WITH
monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1
),
revenue_with_growth AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND(
      100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) /
      NULLIF(LAG(revenue) OVER (ORDER BY month), 0),
      2
    ) AS growth_pct
  FROM monthly_revenue
)
SELECT * FROM revenue_with_growth
ORDER BY month;

-- Recursive CTE (for hierarchical data):
WITH RECURSIVE org_tree AS (
  -- Base case: root nodes (employees with no manager)
  SELECT id, name, manager_id, 0 AS depth, name::text AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: employees whose manager is already in the tree
  SELECT
    e.id,
    e.name,
    e.manager_id,
    ot.depth + 1,
    ot.path || ' > ' || e.name
  FROM employees e
  JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT depth, name, path
FROM org_tree
ORDER BY path;
\`\`\`

## Window Functions

\`\`\`sql
-- Window functions: compute over a "window" of rows without collapsing into groups
-- Syntax: function() OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)

-- Ranking functions:
SELECT
  name,
  department,
  salary,
  ROW_NUMBER()  OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
  RANK()        OVER (PARTITION BY department ORDER BY salary DESC) AS rank,    -- gaps for ties
  DENSE_RANK()  OVER (PARTITION BY department ORDER BY salary DESC) AS d_rank,  -- no gaps
  NTILE(4)      OVER (ORDER BY salary DESC) AS quartile  -- split into 4 groups
FROM employees;

-- Offset functions:
SELECT
  month,
  revenue,
  LAG(revenue, 1, 0) OVER (ORDER BY month) AS prev_month,   -- previous row
  LEAD(revenue) OVER (ORDER BY month) AS next_month,          -- next row
  FIRST_VALUE(revenue) OVER (ORDER BY month) AS first_month_rev,
  LAST_VALUE(revenue) OVER (
    ORDER BY month
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS last_month_rev
FROM monthly_stats;

-- Aggregate window functions (running totals, moving averages):
SELECT
  order_date,
  amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total,
  AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d,
  SUM(amount) OVER (PARTITION BY user_id ORDER BY order_date) AS user_running_total
FROM orders
ORDER BY order_date;

-- Top N per group using window functions:
SELECT * FROM (
  SELECT
    product_name,
    category,
    revenue,
    RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rank_in_category
  FROM product_sales
) ranked
WHERE rank_in_category <= 3;
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the key difference between GROUP BY aggregates and window functions?",
      "options": [
        "Window functions are slower",
        "GROUP BY collapses rows into one per group; window functions compute over rows without reducing them",
        "They are identical",
        "GROUP BY can only use COUNT, window functions can use more"
      ],
      "answer": 1,
      "explanation": "GROUP BY + aggregate: 100 rows → 5 category rows (collapsed). Window functions: 100 rows → still 100 rows, but each row now has a column showing e.g. the category total or its rank within the category. Window functions don't eliminate rows."
    },
    {
      "q": "What is the difference between RANK() and DENSE_RANK()?",
      "options": [
        "No difference",
        "RANK() leaves gaps in ranking after ties (1,2,2,4); DENSE_RANK() doesn't (1,2,2,3)",
        "DENSE_RANK() leaves gaps",
        "RANK() can't handle ties"
      ],
      "answer": 1,
      "explanation": "If two rows tie for rank 2: RANK() gives them both 2, then the next row gets 4 (skipping 3). DENSE_RANK() gives them both 2, then the next row gets 3 (no gaps). Use RANK() for competition rankings, DENSE_RANK() when you don't want gaps."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
