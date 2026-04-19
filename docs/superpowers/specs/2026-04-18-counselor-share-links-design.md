# Counselor-Share Links Design Spec

> **Date:** 2026-04-18
> **Status:** Approved
> **Feature:** Unified sharing system for CC student portfolios

## Goal

Let students generate a single share link that gives counselors, parents, and mentors a read-only view of selected CC data (essays, activities, school list, recommendations, interview scores) without needing an account. Students control which sections are visible via toggles.

## Architecture

### One Master Link with Section Toggles

Each student gets one share link (upsert pattern). The link URL is `/cc/shared/<token>`. The student controls visibility of 5 sections via toggles on a settings page. Changing toggles auto-saves; the URL stays the same. Revoking invalidates the token; regenerating creates a new one.

### Data Model

New table `cc_share_links`:

```sql
CREATE TABLE cc_share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id),
  share_token TEXT NOT NULL UNIQUE,
  visible_sections JSONB NOT NULL DEFAULT '{"essays":true,"activities":true,"schoolList":true,"recommendations":true,"interviewScores":true}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_share_links_student ON cc_share_links(student_id);
CREATE INDEX idx_share_links_token ON cc_share_links(share_token) WHERE is_active = true;
```

One row per student (unique on `student_id`). Token is 32-char hex from `randomBytes(16)`.

### Expiration & Access Control

- No automatic expiration — college app cycles are long (Aug-Mar)
- Student can revoke at any time (sets `is_active: false`)
- Regenerating creates a new token, invalidating the old one
- Revoked/invalid tokens show: "This link is no longer active. Ask the student for a new one."

## API Routes

### `POST /api/cc/share-link` — Create Share Link

Authenticated. Creates a new share link or returns existing active one.

**Request body:** `{ visibleSections?: { essays?: boolean, activities?: boolean, schoolList?: boolean, recommendations?: boolean, interviewScores?: boolean } }`

**Response:** `{ shareToken, shareUrl, visibleSections, isActive }`

**Behavior:**
- If student has an active share link, return it
- If no active link exists, generate new token, insert row, return it
- Default all sections to `true` if `visibleSections` not provided

### `PATCH /api/cc/share-link` — Update or Revoke

Authenticated.

**Request body:** `{ visibleSections?: {...}, revoke?: boolean }`

**Behavior:**
- If `revoke: true` → set `is_active: false`, return `{ revoked: true }`
- If `visibleSections` provided → update the JSONB column, return updated config
- Returns 404 if no active share link exists

### `GET /api/cc/share-link` — Get Current Config

Authenticated. Returns the student's current share link configuration.

**Response:** `{ shareLink: { shareToken, shareUrl, visibleSections, isActive } | null }`

### `GET /api/cc/shared/[token]` — Public Shared View Data

**No authentication required.** This is hit by the public shared page.

**Response:** Returns student data for enabled sections only.

```json
{
  "studentName": "Alex",
  "visibleSections": { "essays": true, "activities": true, ... },
  "essays": [
    { "essayType": "personal_statement", "promptText": "...", "content": "...", "wordCount": 450, "phase": "draft" }
  ],
  "activities": [
    { "position": 1, "activityType": "...", "organization": "...", "role": "...", "description150": "...", "hoursPerWeek": 10 }
  ],
  "honors": [
    { "title": "...", "level": "...", "description100": "..." }
  ],
  "schoolList": [
    { "schoolName": "...", "city": "...", "state": "...", "applicationStatus": "applying" }
  ],
  "recommendations": [
    { "name": "...", "recommenderType": "Teacher", "subject": "AP Chemistry", "status": "confirmed" }
  ],
  "interviewScores": {
    "harvard-undergrad": { "totalSessions": 2, "currentArcStep": 3, "latestRecommendation": "Recommend" }
  }
}
```

Only sections where `visible_sections[key] === true` are included. Others are omitted from the response entirely (not `null`, just absent).

**Error responses:**
- Invalid or revoked token: `{ error: "Link not active" }` with 404
- No sections enabled: returns student name + empty sections

## Share Settings Page (`/cc/share-settings`)

Authenticated "use client" page.

**Layout:**
- Header: "Share with Counselor" + description
- 5 toggle switches with labels:
  - Essays — "Your essay drafts and prompts"
  - Activities & Honors — "Your Common App activities list"
  - School List — "Schools you're applying to with status"
  - Recommendations — "Your recommender list and status"
  - Interview Scores — "Practice interview scorecards"
- Share link area:
  - No link yet → "Generate Share Link" button (gold, triggers POST)
  - Active link → URL display with "Copy Link" button + "Revoke Link" red text button
- Toggle changes auto-save via PATCH (1s debounce using `setTimeout`)
- Revoke shows confirmation before proceeding
- After revocation, UI resets to "Generate Share Link"

**Defaults:** All toggles ON on first visit.

## Public Shared View (`/cc/shared/[token]`)

Server-rendered page (server component), no auth required.

**Layout:**
- Header: "[Name]'s College Application Portfolio" + Kairos.ai branding
- Only enabled sections render as cards
- Each section card follows the dark theme (bg-[#141414], white/XX text)

**Section rendering:**

**Essays:** Essay type badge, prompt text, current draft content (read-only pre-formatted), word count. No brainstorm transcripts or AI interaction history.

**Activities & Honors:** Activities in Common App format (position, type, organization, role, description, hours/week). Honors with title, level, description.

**School List:** School names with application status. No acceptance rates or chancing data.

**Recommendations:** Recommender name, type, subject, status. No brag sheets or email drafts.

**Interview Scores:** Per-school cards with school name, sessions completed, arc step label, latest recommendation label. No full scorecards or transcripts.

**Error states:**
- Invalid/revoked token: centered message "This link is no longer active. Ask the student for a new one." with Kairos branding.
- No sections enabled: Student name + "No sections shared yet."

**OG metadata:** `title` = "[Name]'s College Application Portfolio — Kairos.ai", `description` = "Shared college application materials"

## Middleware Change

Add `/cc/shared` to the `PUBLIC_PREFIXES` array in `src/middleware.ts` so the shared view page is accessible without authentication.

## File Map

### New Files

| File | Purpose |
|------|---------|
| `src/app/cc/share-settings/page.tsx` | Authenticated settings page with toggles |
| `src/app/cc/share-settings/layout.tsx` | Metadata wrapper |
| `src/app/api/cc/share-link/route.ts` | POST/PATCH/GET for share link management |
| `src/app/api/cc/shared/[token]/route.ts` | Public API returning student data for enabled sections |
| `src/app/cc/shared/[token]/page.tsx` | Public read-only server component |
| `src/app/cc/shared/[token]/layout.tsx` | OG tags metadata (dynamic based on student name) |
| `supabase/migrations/031_share_links.sql` | `cc_share_links` table |

### Modified Files

| File | Change |
|------|--------|
| `src/middleware.ts` | Add `/cc/shared` to `PUBLIC_PREFIXES` |

### Deleted Files

| File | Reason |
|------|--------|
| `src/app/api/cc/parent-summary/generate/route.ts` | Stub replaced by share-link API |
| `src/app/api/cc/parent-summary/[share_token]/route.ts` | Stub replaced by shared view |
