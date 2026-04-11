# Seeding Interview Problems

## Overview

The seed file `supabase/migrations/025_seed_problems.sql` contains **266 interview
coding problems** with full Python, Java, and JavaScript solutions. The file is too
large to paste into the Supabase SQL editor (~1.7 MB), so we run it programmatically.

## Files

| File | Purpose |
|------|---------|
| `supabase/migrations/025_seed_problems.sql` | Original seed (Python solutions only, Java/JS stubs) |
| `supabase/migrations/025_seed_problems_translated.sql` | Final seed with real Python + Java + JavaScript solutions |
| `scripts/translate-solutions.mjs` | First-pass: batch-translates Python → Java/JS via Gemini |
| `scripts/retry-failed-translations.mjs` | Re-runs problems where the first pass hit token limits |
| `scripts/seed-via-supabase-api.mjs` | Executes the SQL against Supabase via direct Postgres |

## Workflow

### Step 1 — Translate Python solutions to Java + JavaScript

The first run uses batch size 8 with 8k output tokens (fast for simple problems):

```bash
node scripts/translate-solutions.mjs
```

This reads `025_seed_problems.sql`, calls Gemini to translate each Python solution,
and writes `025_seed_problems_translated.sql`. Some problems with large
implementations (data structures, DP) hit the token limit and are left as stubs.

### Step 2 — Retry failed translations

The retry script uses batch size 3 with 32k output tokens for the holdouts:

```bash
node scripts/retry-failed-translations.mjs
```

This finds problems whose Java solution still says `// TODO: Implement Java solution`,
re-translates them, and writes back to the same file.

### Step 3 — Seed Supabase

You need a database connection string. Add ONE of these to `.env.local`:

```bash
# Option A: Full connection string (preferred)
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres

# Option B: Just the password (uses NEXT_PUBLIC_SUPABASE_URL to derive the rest)
SUPABASE_DB_PASSWORD=<your-database-password>
```

You can find the connection string in:
**Supabase Dashboard → Project Settings → Database → Connection string (URI tab)**

Then run:

```bash
node scripts/seed-via-supabase-api.mjs
```

The script will:
1. Split the SQL into individual statements (ALTER, DELETE, INSERT)
2. Connect to Postgres directly
3. Execute each statement with progress logging
4. Print a summary of successes and failures

If any inserts fail, the slugs and errors are written to `scripts/seed-failures.json`.

## Schema

The `interview_problems` table columns added by this migration:

```sql
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS function_name TEXT;
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS starter_code_js TEXT;
ALTER TABLE interview_problems ADD COLUMN IF NOT EXISTS solution_code_js TEXT;
```

Each problem has these code fields:
- `function_name` — snake_case function name for harness execution
- `starter_code_python` / `solution_code_python`
- `starter_code_java` / `solution_code_java`
- `starter_code_js` / `solution_code_js`
