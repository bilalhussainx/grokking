# Feature 6.4: School List Generator — Design Spec

**Date:** 2026-04-17
**Status:** Approved

## Goal

Let students search, browse, and build a balanced college list (reach/match/safety) from the `cc_schools` database. AI-powered list generation recommends schools based on the student's profile.

## Existing Infrastructure

- **DB tables:** `cc_schools` (50 rows seeded), `cc_student_schools` (junction with chancing_band, status, net_price_estimate)
- **API stubs:** `/api/cc/schools/search`, `/api/cc/schools/[id]`, `/api/cc/school-list/add`, `/api/cc/school-list/generate`, `/api/cc/school-list/[id]`
- **Seed script:** `scripts/seed-schools.ts` — 50 top US schools with acceptance rates, net prices, deadlines, test policies

## Architecture

### 1. School Search API (`/api/cc/schools/search`)

- **Method:** POST
- **Body:** `{ query?: string, state?: string, type?: "public"|"private", test_policy?: string, limit?: number }`
- **Implementation:** Query `cc_schools` with ILIKE on `name` + optional filters
- **No auth required** — public browsing

### 2. School Detail API (`/api/cc/schools/[id]`)

- **Method:** GET
- **Implementation:** Select single school by UUID from `cc_schools`
- **No auth required**

### 3. School List Management APIs

**Add school (`/api/cc/school-list/add`):**
- POST, auth required
- Body: `{ school_id: string, chancing_band?: "reach"|"match"|"safety"|"unknown" }`
- Inserts into `cc_student_schools`, deduplicates by (student_id, school_id)

**Get list (`/api/cc/school-list` — new route):**
- GET, auth required
- Joins `cc_student_schools` with `cc_schools` to return full school data + student-specific fields (chancing_band, status, net_price_estimate)

**Remove school (`/api/cc/school-list/[id]`):**
- DELETE, auth required
- Deletes from `cc_student_schools` by id with ownership check

### 4. AI List Generator (`/api/cc/school-list/generate`)

- POST, auth required
- Reads student profile (identity + academic + financial) from DB
- Sends to Moonshot (Kimi K2) with a prompt that categorizes into reach/match/safety
- Matches AI suggestions against `cc_schools` by name
- Returns suggested schools with chancing bands and reasoning
- Does NOT auto-add — returns suggestions for student to review

### 5. School Browse Page (`/schools`)

- Search bar with real-time filtering
- Filter chips: state, type (public/private), test policy
- School cards: name, location, acceptance rate, avg net price, test policy
- "Add to my list" button on each card
- No auth required to browse; auth required to add

### 6. My School List Page (`/my-schools`)

- Auth required
- Shows added schools grouped by chancing band (Reach / Match / Safety)
- Each card: school name, acceptance rate, deadline, status dropdown
- "Generate suggestions" button → calls AI generator → shows modal with recommendations
- Remove button per school
- Balance indicator: warns if list is too reach-heavy or has no safety schools

## Data Flow

```
Student browses /schools → search API → school cards → "Add" → school-list/add API
Student visits /my-schools → school-list GET → grouped list view
Student clicks "Generate" → profile + school-list/generate API → AI suggestions modal → student picks → add API
```

## Non-Goals

- No chancing calculation (Feature 6.5 scope — requires SAT percentile matching)
- No net price calculator (requires CSS Profile integration)
- No expanding school DB beyond 50 seeded schools (separate task)

## Files to Create/Modify

**APIs (implement existing stubs):**
- `src/app/api/cc/schools/search/route.ts` — real Supabase query
- `src/app/api/cc/schools/[id]/route.ts` — real detail fetch
- `src/app/api/cc/school-list/add/route.ts` — real insert
- `src/app/api/cc/school-list/[id]/route.ts` — real delete
- `src/app/api/cc/school-list/route.ts` — NEW: GET user's list
- `src/app/api/cc/school-list/generate/route.ts` — AI generation

**Pages:**
- `src/app/schools/page.tsx` — browse + search
- `src/app/schools/layout.tsx` — metadata
- `src/app/my-schools/page.tsx` — user's list management
- `src/app/my-schools/layout.tsx` — metadata

**Components:**
- `src/components/cc/SchoolCard.tsx` — reusable school card
- `src/components/cc/SchoolSuggestionModal.tsx` — AI suggestion review modal
