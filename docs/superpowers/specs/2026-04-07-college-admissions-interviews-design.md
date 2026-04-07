# College Admissions Interview Vertical — Design Spec

**Date:** 2026-04-07
**Status:** Approved by Bilal — proceeding to implementation
**Builds on:** `2026-04-07-multilingual-interviews-design.md` (reuses voice routing, question history, persona schema pattern)

---

## TL;DR

A new product surface — `/college-interviews` — that lets high school applicants practice alumni interviews for the 8 Ivy League schools + Stanford + MIT. Every interview is **conducted in English** (matches reality), but **post-interview feedback is translated into the user's native language** (the actual unmet need for international applicants). The AI personalizes questions using a structured 4-field applicant profile (major, top project, recent influence, why this school). Scoring uses a 5-dimension rubric grounded in real alumni reports, plus a "what they would write in the report" mock paragraph as the killer feature.

---

## Decisions Locked

| Q | Decision |
|---|---|
| 1. Schools | 10 — Harvard, Yale, Princeton, Columbia, Penn, Brown, Dartmouth, Cornell, Stanford, MIT |
| 2. Personas | One per school × 3 randomized sub-styles per session (recent grad / older alum / subject specialist) |
| 3. Route | New `/college-interviews` page; reuses voice room and question_history |
| 4. Personalization | 4-field applicant profile, persisted to user profile |
| 5. Multilingual | Interview in English; scorecard feedback translated to user's chosen language |
| 6. Rubric | 5 dimensions + overallRecommendation 1-5 + `whatTheyWouldWriteInTheReport` paragraph |

---

## Architecture

```
┌──────────────────────────────────────┐
│  /college-interviews (NEW)           │
│  CollegeInterviewSetup component:    │
│  - School picker (10 cards)          │
│  - Applicant profile (4 fields)      │
│  - Feedback language picker (9)      │
│  - Calls /api/interviews/plan        │
│    with category="college"           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  /college-interviews/[sessionId]     │
│  Reuses InterviewRoom +              │
│  InterviewVoicePanel verbatim.       │
│  Voice forced to English (en) for    │
│  authenticity — no Sarvam routing.   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  /college-interviews/[sessionId]/    │
│           results                    │
│  CollegeInterviewScorecard (NEW):    │
│  - 5-dimension breakdown             │
│  - overallRecommendation 1-5         │
│  - whatTheyWouldWriteInTheReport     │
│  - All text translated to feedback   │
│    language if not English           │
└──────────────────────────────────────┘
```

**Reuses 90% of the existing tech interview infra:**
- `useVoiceAgent` hook (forces language="en")
- `/api/ai/voice-session` (extended with `category` and `applicantProfile`)
- `/api/interviews/plan` (extended with category, returns college-shaped plan)
- `/api/interviews/score` (extended with category, returns college scorecard, optionally translates)
- `interview_question_history` table (gets a `category` column for tech vs college separation)
- `InterviewRoom` and `InterviewVoicePanel` components (no changes)

**New code:**
- `src/data/college-interviewer-personas.ts` — 10 university personas
- `src/lib/college-interview-prompt-builders.ts` — persona prompt builder
- `src/components/college/CollegeInterviewSetup.tsx` — setup UI
- `src/components/college/CollegeInterviewScorecard.tsx` — results UI
- `src/app/college-interviews/page.tsx` + `[sessionId]/page.tsx` + `[sessionId]/results/page.tsx`
- `supabase/migrations/20260407_college_applicant_profile.sql` — profile table

---

## Data Model

### Applicant Profile (persisted to user)

```sql
CREATE TABLE college_applicant_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  intended_major TEXT,
  top_project_title TEXT,
  top_project_description TEXT,    -- 100-200 words
  recent_influence TEXT,           -- "Sapiens by Yuval Harari"
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

`whyThisSchool` is captured per-session (one short text input on the setup page) since it varies per school.

### Question History — Add Category Column

```sql
ALTER TABLE interview_question_history
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'tech';
-- 'tech' for FAANG-style, 'college' for university interviews
```

The exclusion query gains a category filter so tech and college histories don't pollute each other.

### College Persona Schema

```typescript
interface CollegePersona {
  id: string;                    // "harvard-undergrad"
  school: string;                // "Harvard"
  shortName: string;             // "Harvard"
  fullName: string;              // "Harvard College"
  description: string;           // 1-line for the dropdown
  schoolFitTopics: string[];     // 4-6 things this school cares about (e.g., "Houses system", "Gen Ed")
  signatureQuestionThemes: string[];
  antiPatterns: string[];        // what red-flags this alum spots
  openingLines: string[];        // 3 variants (recent grad / older alum / subject specialist)
  closingNote: string;           // how the alum typically ends
  reportTemplate: string;        // the mock paragraph the AI writes "what they would write in the report"
}
```

### Scorecard Schema

```typescript
interface CollegeScorecard {
  overallRecommendation: 1 | 2 | 3 | 4 | 5;
  recommendationLabel: string;   // "Strongly recommend" → "Do not recommend"
  dimensions: {
    communication: DimensionScore;
    intellectualCuriosity: DimensionScore;
    authenticity: DimensionScore;
    schoolFit: DimensionScore;
    maturity: DimensionScore;
  };
  strengths: string[];           // 2-4 things you nailed
  improvements: string[];        // 2-4 things to work on
  whatTheyWouldWriteInTheReport: string;  // killer feature: paragraph mock
}

interface DimensionScore {
  score: number;                 // 1-10
  feedback: string;              // 2-3 sentences
  specificMoments: string[];     // direct quotes from transcript
}
```

---

## Multilingual Behavior

**Interview voice:** always English (Deepgram aura-2 thalia). No Sarvam routing for college interviews. The user is practicing a real-world English interview.

**Scorecard translation:** after generating the English scorecard, if `feedbackLanguage !== 'en'`, the score route makes one additional Moonshot call:

```
"Translate the following interview feedback into {{feedbackLanguageName}}.
Keep the structure (dimensions, scores, strengths, improvements, the
'what they would write' paragraph) but render all text in {{language}}.
Technical terms (Common App, GPA, SAT, AP) stay in English."
```

The translated scorecard is returned to the client. We don't store both versions — translation is on-demand at score time, computed once per interview.

---

## Persona Research Approach

Each of the 10 personas needs to be grounded, not invented. For each school:

1. Pull 5+ recent (post-2023) alumni interview reports from r/ApplyingToCollege, College Confidential interview threads, and the school's own alumni interviewer guide if public
2. Synthesize the persona prompt with: typical opening, common question themes, school-specific values, anti-patterns the alum looks for, closing rituals
3. Source the `reportTemplate` from leaked or anonymized alumni report templates (Harvard's Schools Committee report format, MIT's EC interviewer guide, etc.)

The 10 persona research will produce a single `src/data/college-interviewer-personas.ts` file. For v0, we ship best-effort grounded personas — quarterly review to refresh as schools update their processes.

---

## Setup Page UX

```
┌─────────────────────────────────────────────────┐
│  Practice your college interview                │
├─────────────────────────────────────────────────┤
│  🎓 Pick a school                                │
│  [Harvard] [Yale] [Princeton] [Columbia]        │
│  [Penn] [Brown] [Dartmouth] [Cornell]           │
│  [Stanford] [MIT]                                │
├─────────────────────────────────────────────────┤
│  ✨ Tell us about you (saved to your profile)   │
│  Intended major: [_______________]              │
│  Top project / extracurricular: [textarea]      │
│  Recent book/article that influenced you:       │
│  [_______________]                               │
├─────────────────────────────────────────────────┤
│  🏫 Why this school? (for this session)         │
│  [_______________]                               │
├─────────────────────────────────────────────────┤
│  🌍 Feedback language                            │
│  [English ▼]                                     │
│  ℹ️ Interview is in English (matches the real   │
│     thing). Feedback will be in your language.  │
└─────────────────────────────────────────────────┘
[Start Practice Interview →]
```

Profile fields are pre-filled from `college_applicant_profile` if the user has practiced before. Editing them updates the profile.

---

## API Changes

### `POST /api/interviews/plan` — extended

New body fields:
- `category: 'tech' | 'college'` (defaults to `'tech'`)
- `collegePersonaId?: string` (e.g., `"harvard-undergrad"`)
- `applicantProfile?: ApplicantProfile`
- `whyThisSchool?: string`

When `category === 'college'`:
- Build the planning prompt from the college persona (signature themes, school fit topics) + the applicant profile
- Generate 5-7 interview questions in the form of a structured plan
- Filter against `interview_question_history` where `category = 'college' AND user_id = $1 AND preset = $2 (school)`

### `POST /api/ai/voice-session` — extended

When `mode === 'interviewer' && category === 'college'`:
- Build the system prompt using `buildCollegePersonaPrompt(persona, applicantProfile, whyThisSchool)`
- Force `language = 'en'`, force voice to `aura-2-thalia-en`

### `POST /api/interviews/score` — extended

New body fields:
- `category: 'tech' | 'college'`
- `feedbackLanguage?: string`
- `applicantProfile?` for context-aware feedback

When `category === 'college'`:
- Use a college-specific system prompt that returns the `CollegeScorecard` schema
- If `feedbackLanguage !== 'en'`, make one additional Moonshot call to translate

---

## Out of Scope (v0)

- Common App PDF upload — defer to v1 if users ask
- Multiple personas per school as separate rows — deferred (we use sub-style randomization within one persona)
- Liberal arts colleges (Williams, Amherst, etc.) — defer until signal
- Oxbridge tutorial interviews — completely different format, separate spec
- Essay review / supplemental coaching — different product, defer
- Live human alum review of practice transcripts — defer
- Mock report email delivery — defer

## Future Work

- Add Cal/UCLA/USC for the West Coast US public/private wedge
- Add UK Russell Group (Oxford, Cambridge, Imperial, LSE, UCL) as a separate `category: 'oxbridge'`
- Common App PDF import → AI reads the whole application
- Practice an entire admissions cycle (multiple rounds, multiple schools, tracked progress)
- Coach Alex post-session debrief — voice agent talks through the scorecard

---

## Risks

| Risk | Mitigation |
|---|---|
| Personas drift as schools update interview format | Quarterly review; personas live in `src/data/` and are versioned |
| Translated feedback loses nuance | Use Moonshot translation; translate the structured fields not the entire dump; English original always available as fallback |
| Users gaming the rubric (memorizing what triggers high scores) | The scorecard is for practice, not selection — gaming it is fine as long as the practice reps build real skill |
| Real alumni interviews are deeply random/team-dependent | Use the 3-sub-style randomization within a persona to capture variance |
| Applicant profile feels invasive | All fields optional; data stays in user's own Supabase row; no sharing |
