# Unified Coach Kairos — Design Spec

> **Date:** 2026-04-19
> **Status:** Approved design, pending implementation
> **Scope:** Sub-project 1 (Persistent Coach Shell) + Sub-project 2 (School Builder Mode)

## Problem

Coach Kairos is fragmented across the platform. Students encounter different UIs for intake (dedicated page with session tokens), academic profile (inline form widget), school building (manual browse page), and lesson coaching (side panel). There is no continuity — each feels like a different tool. Students land on the dashboard after onboarding with no guidance on what to do next, and the school builder leaves them to select universities on their own without considering factors beyond GPA and test scores.

## Solution

A single persistent Coach Kairos chatbot (text + voice) that lives on every page and guides the student through their entire college application journey — from first onboarding questions through school list building, essay writing, and interview prep. One identity, one conversation history, one relationship.

---

## Sub-project 1: Persistent Coach Shell

### The Shell

A floating chat panel available on every authenticated page (not landing/marketing).

- **Floating button:** Bottom-right corner, Coach Kairos avatar + subtle pulse when Kairos has a proactive message
- **Panel:** Slide-up on mobile (full screen), side panel on desktop (400px wide)
- **Mounted once** in root layout (`src/app/providers.tsx`) via `CoachKairosContext`
- **Persists across navigation** — conversation does not reset when changing pages
- **Voice button** in the input area — toggles Deepgram Agent voice mode (reuses existing WebSocket infrastructure)

### Conversation Memory

**New table: `cc_coach_conversations`**

```sql
CREATE TABLE cc_coach_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
  content TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'general',
  page_context TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cc_coach_conversations_student
  ON cc_coach_conversations(student_id, created_at DESC);
```

- `mode`: one of `intake`, `academic`, `school-builder`, `school-browse`, `essay`, `interview`, `general`
- `page_context`: the route path the student was on when the message was sent (e.g. `/schools`, `/cc/essays`)
- `metadata`: optional structured data (e.g. school IDs mentioned, extracted fields)

Messages are stored after each exchange. On page load, the client fetches the last 50 messages to restore the conversation.

### Context Assembly

When Kairos responds, the API builds a system prompt from:

1. **Student profile** from `cc_student_profiles`: name, grade, country, state, first-gen, international status
2. **Academic profile** from `cc_academic_profiles`: GPA (UW/W), test scores, test strategy
3. **School preferences** from `cc_school_preferences` (if collected)
4. **School list summary** from `cc_student_schools` joined with `cc_schools`: count, reach/match/safety breakdown, school names
5. **Setup progress**: which steps are complete (intake, GPA, schools, essays, interviews) from the same logic as `setup-status`
6. **Current page**: what page the student is on right now
7. **Last 20 messages**: recent conversation history for continuity

This context is assembled server-side in the message API route and prepended as the system prompt.

### Conversation Modes

Kairos operates in modes that shape its system prompt and behavior. Mode is determined automatically by a rules engine — no complex ML.

| Mode | Triggers | Behavior |
|------|----------|----------|
| `intake` | No profile exists (no `intake_completed_at`) | Asks onboarding questions: name, grade, location, first-gen, worries, school interests. Extracts and saves to `cc_student_profiles`. |
| `academic` | No GPA on file, or student asks about grades | GPA collection (with international conversion), test strategy, scores. Saves to `cc_academic_profiles`. |
| `school-builder` | Student says "help me find schools" or Kairos suggests it after academic is done | Preference questions → AI-generated school list. Saves preferences + generated schools. |
| `school-browse` | Student is on `/schools` or `/my-schools` | Answers questions about specific schools, suggests additions/removals, explains fit. |
| `essay` | Student is on `/cc/essays` | Essay brainstorming, feedback, prompt analysis for the current essay. |
| `interview` | Student is on `/college-interviews` | Interview tips, school-specific prep, mock question suggestions. |
| `general` | Default — dashboard, any other page | Proactive guidance based on progress. Suggests next step. Answers any question. |

**Mode detection rules (evaluated in order):**
1. If student has no `intake_completed_at` → `intake`
2. If student message explicitly requests a mode ("help me with essays") → that mode
3. If student is on a mode-specific page → that page's mode
4. Otherwise → `general`

### Proactive Guidance

In `general` mode on the dashboard, Kairos checks setup progress and sends the first unfinished step as a proactive suggestion:

| Progress State | Kairos Says |
|---------------|-------------|
| No profile | "Hey! I'm Coach Kairos. I'll be your college counselor throughout this whole process. Let's start — tell me your name and what grade you're in." |
| Profile done, no GPA | "Quick question — what's your GPA? Just the unweighted number is fine. I need it to start finding schools for you." |
| GPA done, no schools | "You've got a solid profile. Ready to build your school list? I'll walk you through it — takes about 5 minutes." |
| Schools done, no essays | "Nice school list! Now let's get ahead on essays. Want to brainstorm your Common App personal statement?" |
| Essays started, no interviews | "Your essays are coming along. Want to practice for alumni interviews? I can prep you for any school on your list." |
| All done | "You're in great shape! Anything you want to work on?" |

The proactive message is sent once per session (tracked via a flag in `CoachKairosContext`) — Kairos doesn't nag on every page load.

### AI Provider

**Primary: Claude Sonnet 4.6 via OpenRouter**
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `anthropic/claude-sonnet-4-6`
- New env var: `OPENROUTER_API_KEY`
- Streaming via SSE for real-time response feel

**Fallback chain:** OpenRouter (Sonnet 4.6) → Moonshot (Kimi K2) → Gemini 2.0 Flash

**System prompt personality guidelines:**
- Talk like a real college counselor — casual, warm, occasionally witty
- Short messages: 1-3 sentences per response, never walls of text
- One question at a time, never bullet-point dumps
- Reference prior conversation naturally ("You mentioned wanting a big city...")
- Never say "Great question!", "I'd be happy to help!", "Let me break this down"
- Use the student's name occasionally but not every message
- When presenting data (schools, scores), keep it conversational, not tabular

### Voice

Reuses existing Deepgram Agent infrastructure:
- Mic button in the coach panel input area
- Connects via WebSocket to Deepgram Agent API (same as `useDeepgramAgent.ts`)
- Voice session gets the same system prompt context as text
- For Hindi/Punjabi speakers, falls back to Sarvam orchestrated pipeline
- Voice and text share the same conversation history — student can switch between them seamlessly

### Data Extraction

**Background extraction endpoint: `POST /api/cc/coach/extract`**

After certain conversations (intake, academic, school-builder), the API extracts structured data from the conversation and upserts it into the appropriate tables.

Called asynchronously after the chat response is sent — does not block the conversation.

| Mode | Extracts To |
|------|------------|
| `intake` | `cc_student_profiles` (name, grade, country, state, first-gen, `intake_completed_at`) |
| `academic` | `cc_academic_profiles` (GPA, test strategy, scores) |
| `school-builder` | `cc_school_preferences` (financial, region, major, campus) + `cc_student_schools` (generated list) |

Extraction uses a separate LLM call with a structured output prompt: "Given this conversation, extract the following fields as JSON: ..."

---

## Sub-project 2: School Builder Mode

### Preference Questions

When Kairos enters `school-builder` mode, it asks these questions (skipping any with answers already on file):

**Required:**

1. **GPA conversion (international only)** — If `country != 'US'` and no GPA:
   - "What grading system does your school use?" → Percentage (0-100), CGPA (out of 10), A-levels (A*-E), IB (1-7)
   - Student provides score → Kairos converts and confirms: "82% in Pakistan typically maps to about a 3.3-3.5 GPA. Sound right?"

2. **Financial situation** — "How important is financial aid for your family?"
   - Options: Essential / Important / Nice-to-have / Not a concern
   - Follow-up if Essential/Important: income bracket (Under $30k, $30-65k, $65-110k, $110-150k, Over $150k, Prefer not to say)

3. **Geographic preferences** — "What kind of place do you see yourself?"
   - Options: Big city / College town / Suburban / No preference
   - Follow-up: "Any regions?" → Northeast, Southeast, Midwest, West Coast, Southwest, Anywhere

4. **Intended major** — "What are you thinking about studying?"
   - Free text + suggestion chips: Engineering, CS, Business, Pre-Med, Liberal Arts, Undecided, etc.

5. **International needs (if applicable)** — "Are you looking for schools that meet full financial need for international students?"
   - Yes / No / Not sure

**Optional (asked if the student gave free-text answers to at least 2 of the required questions above, rather than only clicking option buttons):**

6. **Extracurriculars** — "Tell me about your activities — any leadership, sports, research you're proud of?"
7. **Campus vibe** — "What matters more: small and close-knit, or big and diverse?"

### School Preferences Table

```sql
CREATE TABLE cc_school_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  financial_need TEXT CHECK (financial_need IN ('essential', 'important', 'nice-to-have', 'not-a-concern')),
  income_bracket TEXT,
  location_type TEXT CHECK (location_type IN ('big-city', 'college-town', 'suburban', 'no-preference')),
  preferred_regions TEXT[] DEFAULT '{}',
  intended_major TEXT,
  needs_international_full_need BOOLEAN,
  extracurriculars_summary TEXT,
  campus_size_preference TEXT CHECK (campus_size_preference IN ('small', 'large', 'no-preference')),
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id)
);
```

### GPA Conversion Utility

**File: `src/lib/cc/gpa-converter.ts`**

A deterministic conversion function used by the extraction endpoint and available to the coach prompt for confirmation messaging.

| System | Input Range | Approximate 4.0 Conversion |
|--------|------------|---------------------------|
| Percentage (Pakistan, India, Bangladesh) | 90-100% → 3.7-4.0, 80-89% → 3.3-3.7, 70-79% → 2.7-3.3, 60-69% → 2.0-2.7, Below 60% → below 2.0 |
| CGPA out of 10 (India) | CGPA / 2.5, capped at 4.0. Example: 8.5 → 3.4 |
| A-levels (UK, Singapore, HK) | A*=4.0, A=3.8, B=3.3, C=2.7, D=2.0, E=1.3 |
| IB points (International) | 7=4.0, 6=3.7, 5=3.3, 4=2.7, 3=2.0, 2=1.3 |
| Canadian percentage | Same as percentage-based (most provinces use %) |

Function signature:
```typescript
export function convertToUS4(
  system: 'percentage' | 'cgpa10' | 'a-levels' | 'ib',
  score: number
): { gpaLow: number; gpaHigh: number; confidence: 'approximate' }
```

Returns a range (e.g. 3.3-3.5) since conversions are inherently approximate. Kairos presents the range and asks the student to confirm before saving.

### Enhanced School Generation

The existing `/api/cc/school-list/generate` endpoint gets enhanced with:

1. **Richer prompt context:** Includes financial need, region preference, major, international status, extracurriculars — not just GPA and scores
2. **School filtering:** Pre-filters the 550-school database before sending to the LLM. Example: if student wants "big city" + "Northeast" + "needs full financial aid", filter to schools in northeastern metros that meet full need. This reduces the prompt size and improves recommendation quality.
3. **Band distribution:** 2-4 reach, 3-5 match, 2-3 safety (8-12 total)
4. **Per-school reasoning:** Each recommendation includes a one-sentence reason tied to the student's preferences: "Strong CS program in Boston with generous aid for international students"

### Presentation in Chat

After generation, Kairos presents the list conversationally:

```
"Here's your school list! I've picked 10 schools based on everything you told me:

🎯 Reach (aiming high):
• MIT — Top CS program, but 4% acceptance rate. Worth a shot with your profile.
• Columbia — NYC location you wanted, strong financial aid.
• Georgia Tech — Great engineering, and they're test-optional this year.

✅ Match (solid chances):
• Boston University — Big city, good CS, meets full need for internationals.
• University of Washington — West Coast option with strong tech placement.
• Purdue — Affordable, excellent engineering, college-town vibe.
• Northeastern — Co-op program in Boston, great for hands-on experience.

🛡️ Safety (likely admits):
• Arizona State — Generous merit scholarships, large campus.
• University of Iowa — Affordable with strong aid packages.
• SUNY Stony Brook — NYC-adjacent, great value for CS.

Want to add all of these to your list, or should I swap any out?"
```

Student can interact:
- "Add all" → saves to `cc_student_schools`
- "Remove Purdue, add more California schools" → Kairos adjusts
- "Is BU really test-optional?" → Kairos answers from school data
- "What about scholarships at ASU?" → Kairos pulls from `avg_net_price_by_income`

---

## New Components

| Component | File | Purpose |
|-----------|------|---------|
| `CoachKairosShell` | `src/components/cc/coach/CoachKairosShell.tsx` | Floating button + panel container. Handles open/close, mobile/desktop layout. |
| `CoachChat` | `src/components/cc/coach/CoachChat.tsx` | Message list, text input, voice toggle, option chips for quick replies. |
| `CoachMessage` | `src/components/cc/coach/CoachMessage.tsx` | Single message bubble. Renders markdown, inline school cards, option buttons. |
| `CoachSchoolCard` | `src/components/cc/coach/CoachSchoolCard.tsx` | Compact school card for inline display in chat (name, location, acceptance rate, add button). |
| `CoachKairosContext` | `src/contexts/CoachKairosContext.tsx` | Global state: panel open/closed, messages, current mode, voice active, proactive message sent flag. |

## New API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/cc/coach/message` | POST | Send message, get streaming SSE response. Handles mode detection, context assembly, OpenRouter call, message persistence. |
| `/api/cc/coach/history` | GET | Fetch last 50 messages for session restore on page load. |
| `/api/cc/coach/extract` | POST | Background: extract structured data from conversation, upsert to profile/academic/preferences tables. |

## New Utility

| File | Purpose |
|------|---------|
| `src/lib/cc/gpa-converter.ts` | Deterministic GPA conversion for international grading systems. |
| `src/lib/cc/coach-mode-detector.ts` | Rules engine: given (profile progress, current page, user message) → returns mode. |
| `src/lib/cc/coach-prompt-builder.ts` | Assembles system prompt from profile + academics + preferences + progress + history. |

## What Gets Replaced

| Current Component/Page | Fate |
|----------------------|------|
| `/intake` page (`src/app/intake/page.tsx`) | **Redirects to dashboard** with coach panel auto-opened. Intake happens as Kairos's first conversation. |
| `SetupChecklist` (`src/components/onboarding/SetupChecklist.tsx`) | **Removed from dashboard.** Kairos's proactive guidance replaces it. |
| `QuickAcademicPrompt` (`src/components/cc/profile/QuickAcademicPrompt.tsx`) | **No longer used in checklist.** GPA collection happens in coach conversation. Component kept for profile page if needed. |
| `AICoach` (`src/components/ai/AICoach.tsx`) | **Kept for lesson-specific code coaching only.** Different use case (helping with code exercises). |
| Intake API routes (`start`, `turn`, `complete`, `link`) | **Deprecated.** New `coach/message` route handles intake. Old routes kept for backward compatibility with existing sessions. |
| `/schools/builder` | **Not created.** School building happens in the coach panel. |

## What Stays Unchanged

- `/schools` browse page — still useful for manual browsing; Kairos available as overlay
- `/my-schools` page — school list management stays; Kairos available as overlay
- `/cc/essays` — essay studio stays; Kairos available in essay mode
- `/college-interviews` — interview prep stays; Kairos available in interview mode
- `/profile` — full profile form stays for detailed editing
- `cc_intake_sessions` table — existing data preserved, old sessions still readable
- `user_schools` table — legacy, still queried by setup-status

## Environment Variables

```
OPENROUTER_API_KEY=          # Required: Claude Sonnet 4.6 access
```

No other new env vars. Existing `DEEPGRAM_API_KEY`, `MOONSHOT_API_KEY`, `GEMINI_API_KEY` continue to be used for voice and fallback.

## Migration

```sql
-- New tables (full schemas defined in Conversation Memory and School Preferences Table sections above)
-- cc_coach_conversations: id, student_id, role, content, mode, page_context, metadata, created_at
-- cc_school_preferences: id, student_id, financial_need, income_bracket, location_type,
--   preferred_regions, intended_major, needs_international_full_need,
--   extracurriculars_summary, campus_size_preference, additional_notes, created_at, updated_at

-- No changes to existing tables
-- cc_student_profiles, cc_academic_profiles, cc_student_schools all stay as-is
```

## Implementation Order

1. Database migration (new tables)
2. GPA converter utility
3. Mode detector + prompt builder
4. Coach message API (OpenRouter streaming + message persistence)
5. Coach history API
6. CoachKairosContext + CoachKairosShell (floating button + panel)
7. CoachChat + CoachMessage (chat UI)
8. Intake mode (replace /intake page)
9. Academic mode (GPA collection in chat)
10. School builder mode (preferences + enhanced generation)
11. Coach extract API (background data extraction)
12. Proactive guidance logic
13. Voice integration (Deepgram in coach panel)
14. Remove SetupChecklist, redirect /intake to dashboard
