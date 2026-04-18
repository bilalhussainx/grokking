# Feature 6.6: Timeline/Deadline Ledger — Design Spec

**Date:** 2026-04-17
**Status:** Approved

## Goal

Show students a chronological view of upcoming deadlines and tasks. Auto-generate tasks from their school list's deadlines. Let them add custom tasks.

## Existing Infrastructure

- **DB table:** `cc_tasks` (student_id, school_id, task_type, title, due_date, status, priority)
- **API stubs:** `/api/cc/timeline` (GET), `/api/cc/timeline/generate` (POST)
- **School data:** `cc_schools` has `regular_deadline` and `early_deadline` fields

## Architecture

### 1. Timeline GET API (`/api/cc/timeline`)
- Auth required
- Returns all `cc_tasks` for the student, joined with `cc_schools` for school name
- Sorted by `due_date` ascending (upcoming first)
- Include overdue tasks (due_date < today, status != 'completed')

### 2. Timeline Generate API (`/api/cc/timeline/generate`)
- Auth required
- Reads student's `cc_student_schools` list
- For each school, creates tasks from deadlines:
  - "Submit [School] application" (regular_deadline)
  - "[School] early deadline" (early_deadline, if exists)
  - "Request [School] transcript" (2 weeks before regular deadline)
- Deduplicates: skip if task with same school_id + task_type already exists
- Returns created task count

### 3. Task CRUD API (`/api/cc/timeline/task`)
- POST: create custom task (title, due_date, description, priority)
- PATCH: update status (pending → completed), edit title/due_date
- DELETE: remove task

### 4. Timeline Page (`/timeline`)
- Grouped by month
- Each task: title, school name (if linked), due date, status toggle
- Overdue tasks highlighted at top
- "Generate from school list" button
- "Add task" inline form
- Color coding: overdue=red, due soon (7 days)=amber, completed=muted

## Files

- `src/app/api/cc/timeline/route.ts` — implement GET
- `src/app/api/cc/timeline/generate/route.ts` — implement POST
- `src/app/api/cc/timeline/task/route.ts` — NEW: CRUD
- `src/app/timeline/page.tsx` + `layout.tsx` — timeline page
