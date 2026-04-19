# Feature 6.10 — Interview Prep Design Spec

> **Date:** 2026-04-18
> **Status:** Approved
> **Approach:** Hybrid — CC-native dashboard + existing `/college-interviews/` engine

## Goal

Connect the existing college admissions interview system (10 personas, 4-session adaptive arc, voice/text, scoring) to the Coach Kairos CC flow. Students see their school list, track interview prep progress per school, and launch practice sessions — with optional essay context wiring so the AI interviewer can ask about their actual essays.

## Architecture

### Hybrid Integration

The CC side owns the **dashboard** (school list, progress tracking, score display, essay toggle). The existing `/college-interviews/` system owns the **interview engine** (persona prompts, voice/text streaming, scoring, adaptive arc). Communication happens via:

1. **Query params on launch:** CC dashboard links to `/college-interviews?persona=harvard-undergrad&feedbackLang=en&returnTo=/cc/interview-prep&includeEssays=true`
2. **Shared database:** Both systems read/write `interview_sessions` and `interview_performance` with `category='college'` and `college_persona_id`

### What Changes vs What Stays

**Unchanged:**
- All 10 personas in `college-interviewer-personas.ts`
- Adaptive arc logic (`getSessionStructure`, `loadCollegeSessionContext`)
- Scorecard system (`COLLEGE_SCORECARD_SYSTEM_PROMPT`, translation)
- Voice/text interview engine
- Standalone `/college-interviews/` entry point

**Changed:**
- `CollegeInterviewSetup.tsx` — reads query params to pre-fill persona, skip school picker, fetch essays
- `college-interview-prompt-builders.ts` — new `essayContext` field in `ApplicantProfile`
- `interview_sessions` / `interview_performance` — new `college_persona_id` column

**New:**
- `/cc/interview-prep` dashboard page
- `/api/cc/interview/sessions` API route
- `/api/cc/interview/sessions/[session_id]` API route
- `school-persona-matcher.ts` utility

**Deleted:**
- `/api/cc/interview/start/route.ts` (stub)
- `/api/cc/interview/[session_id]/route.ts` (stub)
- `/api/cc/interview/[session_id]/turn/route.ts` (stub)

## Database Changes

The `interview_sessions` table already has `category TEXT CHECK (category IN ('tech', 'college'))`. Add:

```sql
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS college_persona_id TEXT;
ALTER TABLE interview_performance ADD COLUMN IF NOT EXISTS college_persona_id TEXT;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_college
  ON interview_sessions (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';

CREATE INDEX IF NOT EXISTS idx_interview_performance_college
  ON interview_performance (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';
```

## CC Interview Prep Dashboard (`/cc/interview-prep`)

### Layout

Single page with a school card grid. Each card represents a school from the student's `cc_student_schools` list.

### School Card Contents

- **School info:** Name, city/state, acceptance rate (from `cc_schools` join)
- **Persona match:** Green dot + school emoji if persona exists, gray "Coming soon" badge if not
- **Session arc progress:** 4-step horizontal bar:
  1. Assess Narrative
  2. Weak Areas
  3. Full Mock
  4. Essay Coaching

  Completed steps filled green, current step highlighted gold, future steps dimmed. Text: "Session N of 4".
- **Latest score:** `overallRecommendation` (1-5) with label ("Strongly recommend", etc.) — shown only after first session
- **"Practice" button:** Enabled only for persona-matched schools. Opens `/college-interviews/` with query params.
- **"Include my essays" toggle:** When enabled, adds `&includeEssays=true` to the launch URL
- **"View Scorecard" link:** Shown after first session, opens latest scorecard inline

### Empty States

- **No schools on list:** "Add schools to your list first, then come back to practice interviews." with link to school list page.
- **All schools lack personas:** Cards shown with "Coming soon" badges. Note: "Interview practice is available for: Harvard, Yale, Princeton, Columbia, Penn, Brown, Dartmouth, Cornell, Stanford, MIT."

### Credit Cost

No credit deduction on the dashboard. Credits deducted by the existing interview system when a session starts.

## School-to-Persona Matching

`src/lib/cc/school-persona-matcher.ts` exports `matchSchoolToPersona(schoolName: string): CollegePersona | null`.

**Strategy:** Case-insensitive substring match against `persona.shortName`, with a hardcoded override map for ambiguous cases:

```typescript
const OVERRIDES: Record<string, string> = {
  "university of pennsylvania": "penn-undergrad",
  "massachusetts institute of technology": "mit-undergrad",
};
```

Fallback: `schoolName.toLowerCase().includes(persona.shortName.toLowerCase())`.

Returns `null` for unmatched schools (gets "Coming soon" badge).

Runs client-side — persona list is a static import, school list from API.

## Essay Context Wiring

When the student enables "Include my essays" on the dashboard:

1. Launch URL includes `&includeEssays=true`
2. `CollegeInterviewSetup.tsx` reads the param and fetches `GET /api/cc/essays` (filtered to drafts/revisions)
3. Essay data (prompt text + first 500 chars of draft) passed into `applicantProfile.essayContext`
4. `buildCollegePersonaPrompt` adds a new section when `essayContext` is present:

```
## CANDIDATE'S ESSAY (use to ask specific, probing follow-up questions)
Prompt: "{{prompt}}"
Opening excerpt: "{{excerpt}}"
Ask 1-2 questions about this essay during the interview — probe for authenticity and depth behind the story.
```

This mirrors how real alumni interviewers sometimes reference applicant essays, making practice more realistic.

**`ApplicantProfile` type change:**

```typescript
export interface ApplicantProfile {
  intendedMajor?: string;
  topProjectTitle?: string;
  topProjectDescription?: string;
  recentInfluence?: string;
  whyThisSchool?: string;
  essayContext?: {
    prompt: string;
    excerpt: string;
  };
}
```

## API Routes

### `GET /api/cc/interview/sessions`

Returns the student's college interview history grouped by persona.

**Response shape:**

```json
{
  "sessions": {
    "harvard-undergrad": {
      "totalSessions": 2,
      "currentArcStep": 3,
      "latestScore": {
        "overallRecommendation": 4,
        "recommendationLabel": "Recommend",
        "sessionId": "uuid"
      },
      "sessions": [
        { "id": "uuid", "arcStep": 1, "status": "completed", "startedAt": "...", "overallScore": 7.2 },
        { "id": "uuid", "arcStep": 2, "status": "completed", "startedAt": "...", "overallScore": 7.8 }
      ]
    }
  }
}
```

**Implementation:** Query `interview_sessions` WHERE `category='college'` AND `user_id` matches, join `interview_performance` for scores. Group by `college_persona_id`. Calculate arc step as `min(totalSessions + 1, 4)`.

### `GET /api/cc/interview/sessions/[session_id]`

Returns a single session's full scorecard.

**Response shape:**

```json
{
  "session": {
    "id": "uuid",
    "collegePersonaId": "harvard-undergrad",
    "status": "completed",
    "startedAt": "...",
    "endedAt": "..."
  },
  "scorecard": {
    "overallScore": 7.5,
    "communicationScore": 8,
    "dimensions": {},
    "strengths": [],
    "improvements": [],
    "topicsStrong": [],
    "topicsWeak": []
  }
}
```

## Changes to Existing Files

### `CollegeInterviewSetup.tsx`

- Read URL search params: `persona`, `feedbackLang`, `returnTo`, `includeEssays`
- If `persona` param present: pre-select that persona, auto-scroll past school picker
- If `includeEssays=true`: fetch essays from `/api/cc/essays`, pass first draft's prompt + excerpt into applicant profile
- If `returnTo` present: store in state, pass through to post-interview screen for "Back to Interview Prep" button
- All changes are additive — standalone flow continues to work without params

### `college-interview-prompt-builders.ts`

- Add `essayContext?: { prompt: string; excerpt: string }` to `ApplicantProfile` interface
- In `buildApplicantProfileBlock()`: when `essayContext` present, append essay section to prompt

## File Map

### New Files

| File | Purpose |
|------|---------|
| `src/app/cc/interview-prep/page.tsx` | Dashboard — school grid, arc progress, scores |
| `src/app/cc/interview-prep/layout.tsx` | Metadata wrapper |
| `src/app/api/cc/interview/sessions/route.ts` | GET — college sessions grouped by persona |
| `src/app/api/cc/interview/sessions/[session_id]/route.ts` | GET — single session scorecard |
| `src/lib/cc/school-persona-matcher.ts` | School name → persona matching |

### Modified Files

| File | Change |
|------|--------|
| `src/lib/college-interview-prompt-builders.ts` | Add `essayContext` to `ApplicantProfile`, add essay block to prompt |
| `src/components/college/CollegeInterviewSetup.tsx` | Read query params, pre-fill, essay fetch |

### Deleted Files

| File | Reason |
|------|--------|
| `src/app/api/cc/interview/start/route.ts` | Stub — CC links to `/college-interviews/` directly |
| `src/app/api/cc/interview/[session_id]/route.ts` | Replaced by `sessions/[session_id]` |
| `src/app/api/cc/interview/[session_id]/turn/route.ts` | Handled by existing interview engine |
