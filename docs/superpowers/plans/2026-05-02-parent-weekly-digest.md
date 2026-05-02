# Parent Weekly Digest (multilingual) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a Sunday-evening multilingual email digest to every accepted parent invitee summarizing the student's week, upcoming deadlines, and one Claude-generated conversation starter. Languages: English, Hindi (Devanagari), Urdu (Nastaliq, RTL), Punjabi (Gurmukhi). Tone: formal address (آپ / आप / ਤੁਸੀਂ), no urgency-shaming, lead with what the student did, translate jargon every time, currency in PKR for Pakistani parents.

**Architecture:** A new Vercel cron at `/api/cron/parent-digest` runs hourly Sunday→Monday UTC; for each accepted parent invite whose local time is in the 19:00-20:59 window, render a localized HTML email and dispatch via the existing Resend wrapper. Idempotency log prevents duplicate sends per week per invite. Templates per language live as TypeScript modules so type-safety catches missing translations. Conversation starter is a single OpenRouter Sonnet call per parent with a tight 60-token cap.

**Tech Stack:** Next.js 16, TypeScript 5, Supabase (Postgres + RLS), Resend (`src/lib/email/resend-client.ts` already shipped), Vercel Cron (`vercel.json`), OpenRouter Sonnet 4.6 (`src/lib/cc/openrouter.ts`). Existing schema at `cc_parent_invites` (commit `d4f623c`) is reused; one new column + one new idempotency table added.

**Audit anchor:** Prompt 7 §4 + Prompt 8 Week 1. See `docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md` for sequencing.

---

## Pre-verified state

- `cc_parent_invites` table — `student_id, parent_email, parent_name, invite_token, preferred_language ('en'|'hi'|'ur'|'pa'|'fr'|'es'), accepted_at, expires_at` (`supabase/migrations/20260426_feature_10_parent_portal.sql:6-17`).
- `sendEmail({ to, subject, html, replyTo })` wrapper at `src/lib/email/resend-client.ts` — defaults `from` to `Coach Kairos <bilal@kairoslearn.com>`, returns `{ id }` or `{ skipped: true }` if `RESEND_API_KEY` is unset.
- Vercel cron pattern at `src/app/api/cron/deadline-reminders/route.ts` — protected by `Bearer ${CRON_SECRET}`, uses service-role Supabase client, idempotency log keyed on `(user_id, student_school_id, deadline_type, days_offset, delivered_via)`. Runs daily at `7 9 * * *`.
- `chatOnce(messages: ChatMessage[])` at `src/lib/cc/openrouter.ts` — single-turn OpenRouter call for non-streaming use.
- Activity sources to query: `cc_essays` (drafts, word counts, phase changes), `cc_student_schools` (added schools), `cc_coach_conversations` (session count), `cc_school_supplements` joined with `cc_essays` (supplements drafted), `cc_aid_offers` (Workstream B — not yet shipped, omit until then).

---

## File map

```
supabase/migrations/
  20260503_parent_digest.sql                              ← NEW — adds parent_timezone + digest_log table

src/lib/cc/parent-digest/
  types.ts                                                ← NEW — DigestPayload, DigestActivity, etc.
  collect-activity.ts                                     ← NEW — query last week's activity per student
  collect-activity.test.ts                                ← NEW — unit tests with fixture data
  conversation-starter.ts                                 ← NEW — OpenRouter call to draft one question
  format-pkr.ts                                           ← NEW — USD → PKR (lakhs/crores) helper
  format-pkr.test.ts                                      ← NEW — unit tests
  templates/
    types.ts                                              ← NEW — DigestTemplate interface
    en.ts                                                 ← NEW — English template (subject + body html)
    hi.ts                                                 ← NEW — Hindi (Devanagari)
    ur.ts                                                 ← NEW — Urdu (Nastaliq, RTL)
    pa.ts                                                 ← NEW — Punjabi (Gurmukhi)
    index.ts                                              ← NEW — pickTemplate(lang) registry
    templates.test.ts                                     ← NEW — every locale has every required field
  render-digest.ts                                        ← NEW — orchestrator: payload → html
  render-digest.test.ts                                   ← NEW — render with fixture per locale

src/app/api/cron/parent-digest/
  route.ts                                                ← NEW — Vercel cron handler

vercel.json                                               ← MODIFY — add hourly Sun-Mon UTC schedule
```

---

## Diagnosis (read before implementing)

### Time-zone strategy

Audit specifies "Sunday evening, 7-9pm local to the parent's timezone." Vercel cron runs on UTC. We have three options:

1. **Run hourly Sun→Mon, gate per-parent on local time.** Each cron tick: pull every accepted invite where `parent_timezone` resolves to a Sunday 19:00-20:59 local window in UTC, send. Cron fires ~25-26 times across the weekend; each tick processes only the parents currently in window. Idempotency log prevents double-sends.
2. **Two crons, fixed UTC times** (one for Asia, one for North America). Brittle: a Lahore parent at 7pm PKT is at 14:00 UTC; a New York parent at 7pm ET is at 23:00 UTC; an LA parent at 7pm PT is at 02:00 UTC Monday. Three different brackets at minimum.
3. **Single Sunday-evening UTC cron, accept timing skew.** Simpler but worse for the ICP — Pakistani parents would receive Sunday morning local instead of Sunday evening.

**Pick Option 1.** The audit was explicit that respect-for-local-time is the difference between the digest reading as "premium" or "spam." Hourly cron with windowed processing is the standard pattern for time-zone-aware notifications.

### Skip-if-no-meaningful-activity

Audit: "Skip if no meaningful activity that week (sending an empty digest trains the parent to ignore it)."

Define "meaningful activity" as the OR of:
- ≥1 essay draft with at least 100 new words this week
- ≥1 school added this week
- ≥1 supplement transitioned from `missing` → `draft` or `draft` → `review`
- ≥1 coach session
- ≥1 deadline coming up in the next 14 days

If all five are false, skip and DO NOT log an idempotency row (so the parent can resume next week without `last_sent_at` blocking).

### South Asian parent register conventions (from audit Prompt 7 §4)

Hard rules baked into templates:

- **Formal address.** Urdu = آپ (never تم). Hindi = आप (never तुम). Punjabi (Gurmukhi) = ਤੁਸੀਂ (never ਤੂੰ). Punjabi (Shahmukhi script for Pakistani Punjabi) = آپ-equivalent. Templates use Gurmukhi by default for `pa` since the existing `coach-languages.ts` config uses Gurmukhi; if Shahmukhi support is needed it's a separate feature.
- **Greeting.** "Salam [Parent name]" (Pakistani Muslim default for Urdu), "नमस्ते [Parent name]" (Hindi), "ਸਤ ਸ੍ਰੀ ਅਕਾਲ [Parent name]" (Sikh-default Punjabi). Use the **language as the marker, not assumed religion**. Template fields for greeting are translatable.
- **No urgency words** in subject. No "URGENT", "DEADLINE", "ACTION REQUIRED", or "Don't miss" framing in body. Frame deadlines as "coming up" not "missing."
- **Lead with positive.** "Aanya drafted 480 words" not "Aanya is 170 words behind."
- **Translate jargon every time.** "Common App" / "CSS Profile" / "FAFSA" / "REA" / "ED II" — re-explain on every mention even if it's the parent's third digest. Parents do not memorize the jargon between weekly digests.
- **No emojis in body.** A single subtle emoji in the subject line is fine; never in the body. Older Urdu/Hindi/Punjabi-speaking parents read body emojis as spam.
- **PKR conversion** for Pakistani parents (where parent's local country is Pakistan, identifiable via timezone or country field on student profile). Lakhs/crores not millions. Fixed exchange rate at digest-generation time, no live FX (avoids breakage when FX endpoint is down).
- **Conservative on cultural framing.** No Eid/Diwali greetings unless the user explicitly opts in. Ship default templates first; festival templates are a v2.

### Conversation starter generation

Single OpenRouter Sonnet call per parent with the week's activity summary as context. Cap at 60 output tokens. Prompt instructs the model to:
- Write ONE question, no preamble, no two-sentence framing
- In the parent's `preferred_language`
- Reference a specific thing from the week's activity (school added, essay drafted, deadline coming)
- Use formal pronouns
- Plain text, no markdown

Example (Urdu): «اس ہفتے Aanya نے Bowdoin اپنی فہرست میں شامل کیا — کیا آپ ان سے پوچھ سکتی ہیں کہ Bowdoin انہیں کیوں پسند ہے؟»
Example (English): "Aanya added Bowdoin to her list this week — could you ask her what drew her to it?"

If the OpenRouter call fails or returns empty, fall back to a default per-language question keyed on the week's primary activity (e.g. "Ask [student] which of their schools is their favorite, and why.").

---

## Task 1 — Migration: parent_timezone + digest_log

**Files:** Create `supabase/migrations/20260503_parent_digest.sql`.

- [ ] **Step 1: Write the migration.**

```sql
-- supabase/migrations/20260503_parent_digest.sql
-- Parent weekly digest — additive. parent_timezone defaults to America/New_York
-- because the v1 ICP is North American Pakistani diaspora; the resolver in
-- collect-activity.ts allows null and falls back to that default at send time.
-- Prefer storing this on the invite row rather than asking parents — the value
-- is auto-detected from country during invite acceptance (see Task 5).

ALTER TABLE cc_parent_invites
  ADD COLUMN IF NOT EXISTS parent_timezone TEXT DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS digest_opt_in BOOLEAN NOT NULL DEFAULT TRUE;

-- Idempotency log. Keyed on (invite_id, week_start_iso) — week_start_iso is
-- the ISO date of the Sunday that anchors the digest week. Prevents the
-- hourly cron from sending twice if it fires twice in the parent's local
-- evening window for any reason.
CREATE TABLE IF NOT EXISTS cc_parent_digest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID NOT NULL REFERENCES cc_parent_invites(id) ON DELETE CASCADE,
  week_start_iso DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resend_id TEXT,
  UNIQUE(invite_id, week_start_iso)
);

CREATE INDEX IF NOT EXISTS cc_parent_digest_log_invite_idx
  ON cc_parent_digest_log(invite_id, week_start_iso DESC);

ALTER TABLE cc_parent_digest_log ENABLE ROW LEVEL SECURITY;
-- Service role only — no end-user RLS policies needed; the cron uses
-- SUPABASE_SERVICE_ROLE_KEY.
```

- [ ] **Step 2: Apply locally.** `npx supabase db push`. Verify with: `\d cc_parent_invites` (parent_timezone + digest_opt_in present); `\d cc_parent_digest_log` (table exists with unique constraint).

- [ ] **Step 3: Commit.**
```bash
git add supabase/migrations/20260503_parent_digest.sql
git commit -m "feat(parent-digest): add parent_timezone + digest_log idempotency table"
```

---

## Task 2 — Shared types

**Files:** Create `src/lib/cc/parent-digest/types.ts`.

- [ ] **Step 1: Write the types module.**

```typescript
// src/lib/cc/parent-digest/types.ts
// Shared types for the parent weekly digest pipeline. The orchestrator
// (render-digest.ts) consumes a DigestPayload assembled by
// collect-activity.ts and emits localized HTML via templates/<lang>.ts.

export type DigestLang = "en" | "hi" | "ur" | "pa";

export interface DigestEssay {
  kind: "personal_statement" | "supplement";
  schoolName: string | null;
  wordCount: number;
  wordsAddedThisWeek: number;
  phase: string | null; // "brainstorm" | "outline" | "draft" | "review" | "revise"
  reviewLanded: boolean;
}

export interface DigestSchoolAdded {
  name: string;
  band: string | null; // "reach" | "match" | "safety" | null
}

export interface DigestUpcomingDeadline {
  schoolName: string;
  deadlineType: string; // "EA" | "ED" | "REA" | "RD" | "Financial Aid" | "CSS Profile" | "FAFSA"
  daysAway: number; // ≤14
}

export interface DigestAidCallout {
  schoolName: string;
  netCostUsd: number;
  outOfPocketUsd: number;
  comparatorUrl: string; // /cc/aid-offers — rendered only when at least one offer exists
}

export interface DigestActivity {
  // Computed fields used by every template + by the meaningful-activity gate.
  essaysDrafted: DigestEssay[];
  schoolsAdded: DigestSchoolAdded[];
  supplementsAdvanced: number; // count this week
  coachSessions: number;
  upcomingDeadlines: DigestUpcomingDeadline[];
  aidCallout: DigestAidCallout | null; // populated only after Workstream B ships
}

export interface DigestPayload {
  inviteId: string;
  studentFirstName: string;
  parentName: string;
  parentEmail: string;
  language: DigestLang;
  parentTimezone: string;
  weekStartIso: string; // ISO date of the Sunday anchoring this digest's week
  pkrPerUsd: number | null; // populated only when student.country === 'PK'
  portalUrl: string; // /parent/<token>
  unsubscribeUrl: string;
  activity: DigestActivity;
  conversationStarter: string; // one-line localized question
}

export interface DigestRenderResult {
  subject: string;
  html: string;
}

// Result of meaningful-activity gate. False → skip send (no idempotency row).
export interface MeaningfulCheck {
  meaningful: boolean;
  reason: string; // for logs
}
```

- [ ] **Step 2: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 3: Commit.**
```bash
git add src/lib/cc/parent-digest/types.ts
git commit -m "feat(parent-digest): shared types"
```

---

## Task 3 — Activity collector + tests (TDD)

**Files:**
- Create: `src/lib/cc/parent-digest/collect-activity.ts`
- Create: `src/lib/cc/parent-digest/collect-activity.test.ts`

The collector takes `studentId, weekStartIso` and returns `{ activity: DigestActivity; meaningful: MeaningfulCheck }`. Pure function over Supabase admin reads — no email sending here. Tests use a mocked Supabase client.

- [ ] **Step 1: Write the failing test FIRST.** Tests cover:
  1. Returns `meaningful: false` when nothing happened this week.
  2. Returns `meaningful: true` and counts essay word delta when a draft grew by ≥100 words.
  3. Counts schools added, supplements advanced, coach sessions, upcoming deadlines (within 14 days).
  4. Skips activity older than `weekStartIso` (boundary tests at 7 days back).
  5. `aidCallout` always null until Workstream B's `cc_aid_offers` table ships.

(Test code follows the same shape as `src/lib/cc/__tests__/coach-actions-block.test.ts` — vitest, no React rendering. Mock the Supabase client by passing it as a parameter so tests can swap in a fixture.)

- [ ] **Step 2: Run test, expect failure.** Module not found.

- [ ] **Step 3: Write the implementation.** The collector queries five tables in parallel (`cc_essays`, `cc_student_schools`, `cc_school_supplements ⨝ cc_essays` for supplement progression, `cc_coach_conversations`, `cc_student_schools` joined with `cc_schools` for upcoming deadlines). Filter by `student_id` + week boundary. Return the populated `DigestActivity` + a `MeaningfulCheck` verdict.

  Critical: the meaningful-activity gate is FIVE conditions OR'd together (per §Diagnosis above). One match flips it true.

- [ ] **Step 4: Run tests, expect green.** All scenarios pass.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/parent-digest/collect-activity.ts src/lib/cc/parent-digest/collect-activity.test.ts
git commit -m "feat(parent-digest): activity collector + meaningful-activity gate"
```

---

## Task 4 — PKR formatter + tests (TDD)

**Files:**
- Create: `src/lib/cc/parent-digest/format-pkr.ts`
- Create: `src/lib/cc/parent-digest/format-pkr.test.ts`

Pakistani parents process money in lakhs (100,000) and crores (10,000,000). `$18,000 → PKR 50 lakh` not `PKR 5,000,000`. Pure function, no I/O.

- [ ] **Step 1: Write the failing test.** Cases:
  - `formatPkrNarrative(1, 50000) → "PKR 50,000"` (under one lakh: plain)
  - `formatPkrNarrative(1, 250000) → "PKR 2.5 lakh"` (lakh range)
  - `formatPkrNarrative(1, 11500000) → "PKR 1.15 crore"` (crore range)
  - `formatPkrNarrative(280, 18000) → "≈ PKR 50 lakh"` (USD input × FX → PKR)
  - Rounds to 1 decimal place; suppresses `.0`
  - Empty string when `pkrPerUsd` is null (caller decides to omit)

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.** `function formatPkrNarrative(pkrPerUsd: number | null, usd: number): string`. Multiply, then bucket: `<100_000` plain comma format, `<10_000_000` divide by 100k → "X.X lakh", else divide by 10M → "X.X crore". Return empty string when `pkrPerUsd === null`.

- [ ] **Step 4: Run, expect green.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/parent-digest/format-pkr.ts src/lib/cc/parent-digest/format-pkr.test.ts
git commit -m "feat(parent-digest): PKR lakhs/crores narrative formatter"
```

---

## Task 5 — Template module: English baseline

**Files:** Create `src/lib/cc/parent-digest/templates/types.ts` + `templates/en.ts`.

The template interface is the contract every locale must satisfy. Define it in TypeScript so missing fields fail at compile time.

- [ ] **Step 1: Write `templates/types.ts`.**

```typescript
// src/lib/cc/parent-digest/templates/types.ts
// Every locale exports a `DigestTemplate` matching this shape. The renderer
// in render-digest.ts looks up the template via templates/index.ts and
// composes the HTML.

import type { DigestPayload } from "../types";

export interface DigestTemplate {
  // Localized subject line. Receives the payload so it can include the
  // student name + the localized "this week's progress" framing.
  subject: (p: DigestPayload) => string;

  // Localized greeting line. Formal pronouns (آپ / आप / ਤੁਸੀਂ).
  greeting: (parentName: string) => string;

  // Section headings — keep them short. Templates can intentionally make
  // sections shorter or skip them (return empty string).
  sectionTitleWhatHappened: string;
  sectionTitleComingUp: string;
  sectionTitleAid: string;
  sectionTitleAskThem: string;

  // Localized body for each section. Each is a function of the payload so
  // numbers and names get pluralized correctly per language.
  bodyWhatHappened: (p: DigestPayload) => string; // 2-3 sentence summary
  bodyComingUp: (p: DigestPayload) => string;     // bulleted list as HTML
  bodyAid: (p: DigestPayload) => string;          // single line + comparator link
  bodyAskThem: (p: DigestPayload) => string;      // wraps the conversationStarter

  // Footer with portal link + unsubscribe + language toggle.
  footer: (p: DigestPayload) => string;

  // RTL flag for HTML dir attribute.
  rtl: boolean;
}
```

- [ ] **Step 2: Write the English template.**

Key constraints baked in:
- Subject: `"<student> — this week's progress"` — no urgency words.
- Greeting: `"Hello <parent name>,"` — formal default.
- Sections shown only when their data is non-empty. The renderer (Task 9) wraps each section body with `<section><h2>title</h2>body</section>` only when body is truthy.
- All amounts in USD (English baseline). PKR rendering happens in `ur.ts`/`hi.ts`/`pa.ts`.
- Jargon translated even in English: "Common App essay" not "Common App PS"; "Restrictive Early Action (REA)" first time it appears.
- `bodyComingUp` renders deadlines as `<ul><li>` with `<strong>school</strong> · <em>deadline type</em> · <span>N days away</span>`. No "URGENT" / "DEADLINE" framing.
- `footer` includes the portal link, `<a href="${unsubscribeUrl}">Unsubscribe from weekly digests</a>`, and a language-toggle row showing localized labels for the other three locales.

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/parent-digest/templates/types.ts src/lib/cc/parent-digest/templates/en.ts
git commit -m "feat(parent-digest): template interface + English baseline"
```

---

## Task 6 — Localized templates: Hindi, Urdu, Punjabi

**Files:** Create `templates/hi.ts`, `templates/ur.ts`, `templates/pa.ts`.

Each implements `DigestTemplate` with the localized subject, greeting, section titles, body, and footer.

- [ ] **Step 1: Hindi template (Devanagari).**

Key strings:
- Subject: `"<student> — इस सप्ताह की प्रगति"` ("this week's progress")
- Greeting: `"नमस्ते <parent name>,"` — `आप` register throughout
- Section titles:
  - `sectionTitleWhatHappened`: `"इस सप्ताह क्या हुआ"` ("what happened this week")
  - `sectionTitleComingUp`: `"आगे आने वाला"` ("coming up")
  - `sectionTitleAid`: `"वित्तीय सहायता"` ("financial aid")
  - `sectionTitleAskThem`: `"उनसे यह पूछिए"` ("ask them this")
- Jargon translation per first mention: "Common App essay (कॉमन ऐप का निबंध)", "CSS Profile (CSS प्रोफाइल — financial aid form for private schools)"
- `rtl: false`

- [ ] **Step 2: Urdu template (Nastaliq, RTL).**

Key strings:
- Subject: `"<student> — اس ہفتے کی پیش رفت"`
- Greeting: `"السلام علیکم <parent name>،"` — `آپ` register throughout
- Section titles:
  - `sectionTitleWhatHappened`: `"اس ہفتے کیا ہوا"`
  - `sectionTitleComingUp`: `"آنے والا"`
  - `sectionTitleAid`: `"مالی امداد"`
  - `sectionTitleAskThem`: `"ان سے یہ پوچھئے"`
- `rtl: true` — renderer adds `<html dir="rtl">` and `text-align: right` styles
- PKR conversion appended to every USD figure: e.g. `"$18,000 (≈ PKR 50 lakh)"`. The renderer calls `formatPkrNarrative` from Task 4 when `payload.pkrPerUsd != null`.

- [ ] **Step 3: Punjabi template (Gurmukhi).**

Key strings:
- Subject: `"<student> — ਇਸ ਹਫ਼ਤੇ ਦੀ ਪ੍ਰਗਤੀ"`
- Greeting: `"ਸਤ ਸ੍ਰੀ ਅਕਾਲ <parent name>,"` — `ਤੁਸੀਂ` register throughout
- Section titles:
  - `sectionTitleWhatHappened`: `"ਇਸ ਹਫ਼ਤੇ ਕੀ ਹੋਇਆ"`
  - `sectionTitleComingUp`: `"ਆ ਰਿਹਾ ਹੈ"`
  - `sectionTitleAid`: `"ਵਿੱਤੀ ਸਹਾਇਤਾ"`
  - `sectionTitleAskThem`: `"ਉਨ੍ਹਾਂ ਤੋਂ ਪੁੱਛੋ"`
- `rtl: false`

- [ ] **Step 4: Tests for translation completeness.** Create `templates.test.ts` that:
  - Verifies every locale exports a `DigestTemplate` matching the interface (TypeScript already enforces this at compile time, but the test verifies field presence at runtime in case any field is conditionally undefined).
  - Calls every function with a fixture `DigestPayload` and asserts non-empty string return.
  - Verifies `rtl === true` only for `ur.ts`.
  - Verifies subject includes the student name placeholder substituted.
  - Verifies no template body contains the literal strings "URGENT", "DEADLINE", "ACTION REQUIRED", "Don't miss" (across any locale).

- [ ] **Step 5: Run tests, expect green.**

- [ ] **Step 6: Commit.**
```bash
git add src/lib/cc/parent-digest/templates/
git commit -m "feat(parent-digest): Hindi, Urdu (RTL), Punjabi templates + completeness tests"
```

**Note for the implementer:** Have a native speaker review the Urdu and Punjabi templates before deploying to prod. The audit was explicit — Urdu register and Pakistani-vs-Indian Punjabi script defaults are nuanced. Templates ship to staging first; native review then; prod ship.

---

## Task 7 — Template registry

**Files:** Create `src/lib/cc/parent-digest/templates/index.ts`.

- [ ] **Step 1: Write the registry.**

```typescript
// src/lib/cc/parent-digest/templates/index.ts
// Locale → template mapping. Falls back to English if a parent's preferred
// language has no template (e.g. Spanish/French — supported in
// cc_parent_invites schema, not yet built here).
import type { DigestLang } from "../types";
import type { DigestTemplate } from "./types";
import en from "./en";
import hi from "./hi";
import ur from "./ur";
import pa from "./pa";

const REGISTRY: Record<DigestLang, DigestTemplate> = { en, hi, ur, pa };

export function pickTemplate(lang: string): DigestTemplate {
  if (lang in REGISTRY) return REGISTRY[lang as DigestLang];
  // Spanish, French, or any unrecognized code → English fallback.
  return REGISTRY.en;
}
```

- [ ] **Step 2: Type-check + commit.**
```bash
git add src/lib/cc/parent-digest/templates/index.ts
git commit -m "feat(parent-digest): template registry with English fallback"
```

---

## Task 8 — Conversation starter generator + tests

**Files:**
- Create: `src/lib/cc/parent-digest/conversation-starter.ts`
- Tests for it can live in `conversation-starter.test.ts`

- [ ] **Step 1: Write the test (mocks `chatOnce`).** Cases:
  - When week's activity is "Aanya added Bowdoin", returned question references Bowdoin.
  - When `chatOnce` throws, falls back to a per-language default question keyed on the primary activity.
  - When activity is empty (shouldn't happen per the meaningful gate, but defensive), returns a generic per-language question.
  - When `lang === 'ur'`, output uses آپ register.

- [ ] **Step 2: Implement.**

```typescript
// src/lib/cc/parent-digest/conversation-starter.ts
// One-line localized question for the parent to ask their student. Single
// OpenRouter Sonnet call with a 60-token cap; fallback to per-language
// default on error.
import { chatOnce, type ChatMessage } from "@/lib/cc/openrouter";
import type { DigestLang, DigestPayload } from "./types";

const FALLBACKS: Record<DigestLang, (p: DigestPayload) => string> = {
  en: (p) => `Ask ${p.studentFirstName} which of their schools is their favorite, and why.`,
  hi: (p) => `${p.studentFirstName} से पूछिए कि उनकी पसंदीदा यूनिवर्सिटी कौन सी है और क्यों?`,
  ur: (p) => `${p.studentFirstName} سے پوچھیں کہ ان کی پسندیدہ یونیورسٹی کون سی ہے اور کیوں؟`,
  pa: (p) => `${p.studentFirstName} ਨੂੰ ਪੁੱਛੋ ਕਿ ਉਨ੍ਹਾਂ ਦੀ ਮਨਪਸੰਦ ਯੂਨੀਵਰਸਿਟੀ ਕਿਹੜੀ ਹੈ ਅਤੇ ਕਿਉਂ?`,
};

const LANG_LABELS: Record<DigestLang, string> = {
  en: "English",
  hi: "Hindi (Devanagari)",
  ur: "Urdu (Nastaliq script)",
  pa: "Punjabi (Gurmukhi)",
};

function summarizeActivity(p: DigestPayload): string {
  const parts: string[] = [];
  for (const e of p.activity.essaysDrafted) {
    parts.push(`drafted ${e.kind === "personal_statement" ? "Common App essay" : `${e.schoolName ?? "supplement"} essay`}, now at ${e.wordCount} words (${e.wordsAddedThisWeek}+ this week)`);
  }
  for (const s of p.activity.schoolsAdded) {
    parts.push(`added ${s.name}${s.band ? ` (${s.band})` : ""} to school list`);
  }
  if (p.activity.coachSessions > 0) {
    parts.push(`${p.activity.coachSessions} session${p.activity.coachSessions === 1 ? "" : "s"} with Coach Kairos`);
  }
  for (const d of p.activity.upcomingDeadlines.slice(0, 2)) {
    parts.push(`${d.schoolName} ${d.deadlineType} in ${d.daysAway} days`);
  }
  return parts.join("; ");
}

export async function makeConversationStarter(p: DigestPayload): Promise<string> {
  const summary = summarizeActivity(p);
  if (!summary) return FALLBACKS[p.language](p);

  const prompt: ChatMessage[] = [
    {
      role: "system",
      content: `You are writing a single conversation starter — ONE question — for a parent to ask their child. The parent reads ${LANG_LABELS[p.language]}. Use formal pronouns (آپ / आप / ਤੁਸੀਂ); not informal. Reference one specific thing from this week. Plain text, no markdown, no preamble, no quotation marks. ≤ 25 words. Output ONLY the question.`,
    },
    {
      role: "user",
      content: `Student: ${p.studentFirstName}\nThis week: ${summary}\n\nWrite the question now.`,
    },
  ];

  try {
    const text = await chatOnce(prompt);
    const cleaned = text.trim().replace(/^["'""]|["'""]$/g, "");
    if (!cleaned) return FALLBACKS[p.language](p);
    return cleaned;
  } catch (err) {
    console.error("[parent-digest] conversation-starter LLM call failed:", err);
    return FALLBACKS[p.language](p);
  }
}
```

- [ ] **Step 3: Run tests, commit.**
```bash
git add src/lib/cc/parent-digest/conversation-starter.ts src/lib/cc/parent-digest/conversation-starter.test.ts
git commit -m "feat(parent-digest): localized conversation starter with LLM + fallbacks"
```

---

## Task 9 — Render orchestrator + tests

**Files:**
- Create: `src/lib/cc/parent-digest/render-digest.ts`
- Create: `src/lib/cc/parent-digest/render-digest.test.ts`

`renderDigest(payload: DigestPayload): DigestRenderResult` — composes the localized template fields into a single email HTML.

- [ ] **Step 1: Write the test for render output.** Cases:
  - Subject contains the student name + localized "this week's progress" suffix.
  - Body HTML includes greeting line.
  - Body HTML includes the conversation starter exactly.
  - When activity has no upcoming deadlines, the "coming up" section is omitted entirely (no empty header).
  - When `payload.aidCallout === null`, the aid section is omitted.
  - When `payload.language === 'ur'`, output `<html dir="rtl">` is present.
  - Output never contains literal "URGENT" / "DEADLINE" / "ACTION REQUIRED" / "Don't miss" (regression test for register rules).

- [ ] **Step 2: Implement.** Compose:

```typescript
import { pickTemplate } from "./templates";
import type { DigestPayload, DigestRenderResult } from "./types";

export function renderDigest(p: DigestPayload): DigestRenderResult {
  const t = pickTemplate(p.language);
  const dir = t.rtl ? "rtl" : "ltr";
  const sections: string[] = [];

  const what = t.bodyWhatHappened(p);
  if (what) sections.push(`<section><h2 style="font-size:14px;margin:24px 0 8px;color:#D4AF37;text-transform:uppercase;letter-spacing:.08em;">${t.sectionTitleWhatHappened}</h2><div style="color:#1f2937;line-height:1.6;">${what}</div></section>`);

  const upcoming = t.bodyComingUp(p);
  if (upcoming) sections.push(`<section><h2 style="...">${t.sectionTitleComingUp}</h2><div>${upcoming}</div></section>`);

  const aid = t.bodyAid(p);
  if (aid) sections.push(`<section><h2 style="...">${t.sectionTitleAid}</h2><div>${aid}</div></section>`);

  const askThem = t.bodyAskThem(p);
  sections.push(`<section style="margin-top:24px;padding:16px;background:#fef3c7;border-left:3px solid #D4AF37;"><h2 style="...">${t.sectionTitleAskThem}</h2><div style="font-style:italic;">${askThem}</div></section>`);

  const html = `<!DOCTYPE html><html lang="${p.language}" dir="${dir}"><head><meta charset="utf-8"></head><body style="margin:0;padding:32px 16px;background:#fafaf9;font-family:-apple-system,Segoe UI,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <p style="font-size:16px;margin:0 0 24px;">${t.greeting(p.parentName)}</p>
      ${sections.join("")}
      <hr style="margin:32px 0;border:0;border-top:1px solid #e5e7eb;">
      ${t.footer(p)}
    </div>
  </body></html>`;

  return { subject: t.subject(p), html };
}
```

- [ ] **Step 3: Run tests, commit.**
```bash
git add src/lib/cc/parent-digest/render-digest.ts src/lib/cc/parent-digest/render-digest.test.ts
git commit -m "feat(parent-digest): renderDigest orchestrator with section gating"
```

---

## Task 10 — Cron route handler

**Files:**
- Create: `src/app/api/cron/parent-digest/route.ts`
- Modify: `vercel.json`

Hourly cron. Pulls every accepted invite, filters to the ones whose local time is currently in the 19:00-20:59 Sunday window, gathers activity, gates on meaningful, renders, sends, logs.

- [ ] **Step 1: Add to `vercel.json`.**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/cron/deadline-reminders", "schedule": "7 9 * * *" },
    { "path": "/api/cron/generate-observations", "schedule": "7 4 * * *" },
    { "path": "/api/cron/parent-digest",       "schedule": "0 * * * 0,1" }
  ]
}
```

(Hourly Sunday + Monday UTC. Monday coverage catches Asia parents whose local Sunday evening lands in early Monday UTC.)

- [ ] **Step 2: Write the route.**

```typescript
// src/app/api/cron/parent-digest/route.ts
// Hourly Sun-Mon UTC. For each accepted invite where the parent's local
// time is currently in the 19:00-20:59 window AND a digest hasn't already
// been sent for this week, gather activity, gate on meaningful, render,
// send via Resend, log idempotency.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/resend-client";
import { collectActivity } from "@/lib/cc/parent-digest/collect-activity";
import { makeConversationStarter } from "@/lib/cc/parent-digest/conversation-starter";
import { renderDigest } from "@/lib/cc/parent-digest/render-digest";
import type { DigestLang, DigestPayload } from "@/lib/cc/parent-digest/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Pakistan rupee FX. Pinned at digest-generation time so a rate-API
// outage doesn't break the cron. Refresh manually or via a separate cron
// once a month — exchange rates don't move enough week-to-week to matter
// for a "≈ PKR 50 lakh" narrative figure.
const PKR_PER_USD = 280;

function isInLocalEveningWindow(timezone: string, nowUtc: Date): boolean {
  // Use Intl.DateTimeFormat to convert nowUtc to the parent's local hour.
  // Window: Sunday 19:00 → Sunday 20:59 in `timezone`.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(nowUtc);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
  const hour = parseInt(hourStr, 10);
  return weekday === "Sun" && hour >= 19 && hour <= 20;
}

function weekStartIso(timezone: string, nowUtc: Date): string {
  // ISO date of the Sunday that anchors this digest's week (the Sunday
  // currently in progress in `timezone`).
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(nowUtc); // YYYY-MM-DD in en-CA format
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET ?? ""}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const now = new Date();

  // Pull every accepted, opted-in invite + its student profile.
  const { data: invites, error: invitesErr } = await db
    .from("cc_parent_invites")
    .select("id, student_id, parent_email, parent_name, invite_token, preferred_language, parent_timezone, accepted_at")
    .not("accepted_at", "is", null)
    .eq("digest_opt_in", true);
  if (invitesErr) {
    console.error("[parent-digest] invite fetch failed:", invitesErr);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  const stats = { evaluated: 0, sent: 0, skipped_window: 0, skipped_already_sent: 0, skipped_no_activity: 0, errors: 0 };

  for (const inv of invites ?? []) {
    stats.evaluated += 1;
    const tz = inv.parent_timezone ?? "America/New_York";

    if (!isInLocalEveningWindow(tz, now)) {
      stats.skipped_window += 1;
      continue;
    }

    const week = weekStartIso(tz, now);

    // Idempotency check.
    const { data: already } = await db
      .from("cc_parent_digest_log")
      .select("id")
      .eq("invite_id", inv.id)
      .eq("week_start_iso", week)
      .maybeSingle();
    if (already) {
      stats.skipped_already_sent += 1;
      continue;
    }

    try {
      // Pull student name + country for PKR + portal token.
      const { data: profile } = await db
        .from("cc_student_profiles")
        .select("preferred_name, legal_first_name, country")
        .eq("id", inv.student_id)
        .maybeSingle();
      const studentFirstName = profile?.preferred_name || profile?.legal_first_name || "your student";
      const isPK = profile?.country === "PK";

      const { activity, meaningful } = await collectActivity(db, inv.student_id, week);
      if (!meaningful.meaningful) {
        stats.skipped_no_activity += 1;
        continue;
      }

      const payload: DigestPayload = {
        inviteId: inv.id,
        studentFirstName,
        parentName: inv.parent_name ?? "",
        parentEmail: inv.parent_email,
        language: (inv.preferred_language as DigestLang) ?? "en",
        parentTimezone: tz,
        weekStartIso: week,
        pkrPerUsd: isPK ? PKR_PER_USD : null,
        portalUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://kairoslearn.com"}/parent/${inv.invite_token}`,
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://kairoslearn.com"}/parent/${inv.invite_token}/unsubscribe`,
        activity,
        conversationStarter: "", // populated on the next line
      };
      payload.conversationStarter = await makeConversationStarter(payload);

      const { subject, html } = renderDigest(payload);
      const send = await sendEmail({ to: inv.parent_email, subject, html });
      const resendId = "id" in send ? send.id : null;

      await db.from("cc_parent_digest_log").insert({
        invite_id: inv.id,
        week_start_iso: week,
        resend_id: resendId,
      });

      stats.sent += 1;
    } catch (err) {
      console.error(`[parent-digest] invite=${inv.id} failed:`, err);
      stats.errors += 1;
    }
  }

  console.log("[parent-digest] tick stats:", stats);
  return NextResponse.json({ ok: true, stats });
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Manual smoke-test.** With dev server running, curl the route with the cron secret:
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/parent-digest
  ```
  - Expect: `{ "ok": true, "stats": { evaluated: N, sent: 0|1, ... } }`. The send count depends on whether any test invite is currently in the 19:00-20:59 window in its timezone.
  - For deterministic local testing, temporarily relax `isInLocalEveningWindow` to always return true; verify the full pipeline (activity collection, render, send) works; restore the gate before commit.

- [ ] **Step 5: Commit.**
```bash
git add src/app/api/cron/parent-digest/route.ts vercel.json
git commit -m "feat(parent-digest): hourly Sun-Mon cron with timezone-aware send window"
```

---

## Task 11 — Auto-detect parent timezone on invite acceptance

**Files:** Modify `src/app/api/cc/parent-invite/route.ts` (or wherever `accepted_at` is set on invite acceptance — verify by greping for `accepted_at` in the API code).

When a parent accepts an invite, their browser's timezone is the most reliable signal. Capture it client-side and POST it alongside the acceptance.

- [ ] **Step 1: Find the acceptance endpoint.**
```bash
grep -rn "accepted_at" src/app/api/cc/ src/app/parent/ 2>/dev/null
```

- [ ] **Step 2: Update the client-side acceptance call** (likely `src/app/parent/[token]/page.tsx` or a sibling client component) to include `Intl.DateTimeFormat().resolvedOptions().timeZone` in the body.

- [ ] **Step 3: Update the server endpoint** to write `parent_timezone = body.timezone ?? null` alongside `accepted_at = now()`.

- [ ] **Step 4: Type-check + commit.**
```bash
git add <changed files>
git commit -m "feat(parent-digest): capture parent timezone on invite acceptance"
```

---

## Task 12 — Unsubscribe page

**Files:** Create `src/app/parent/[token]/unsubscribe/page.tsx`.

- [ ] **Step 1: Server component** that resolves the token to an invite, sets `digest_opt_in = false`, and renders a confirmation in the parent's preferred language. No login required (token is the auth).

- [ ] **Step 2: Update the parent invite middleware allowlist** so `/parent/<token>/unsubscribe` is reachable without auth (the parent path is already public in `middleware.ts` per the audit; verify).

- [ ] **Step 3: Commit.**
```bash
git add src/app/parent/\[token\]/unsubscribe/
git commit -m "feat(parent-digest): per-token unsubscribe page"
```

---

## Task 13 — Final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.
- [ ] **Step 2: Tests.** `npx vitest run`. All green; new tests pass.
- [ ] **Step 3: Manual end-to-end.** Create a fresh test invite from the local dev student account; accept it on a separate browser profile (captures timezone); curl the cron with `CRON_SECRET`; verify Resend dashboard shows the email; open the email and verify all 5 sections render correctly in English; switch the invite's `preferred_language` to `ur` in Supabase Studio; re-trigger; verify Urdu RTL render.
- [ ] **Step 4: Native-speaker review.** Send the four locale renders to native speakers (one each: Urdu, Hindi, Punjabi). Don't push to prod until all three return "ship-ready" or "small fix" — never "rewrite."
- [ ] **Step 5: Push.**
```bash
git push origin master
```
- [ ] **Step 6: Post-deploy verification.** Apply migration via `npx supabase db push` against prod. Verify cron is registered in Vercel Cron Jobs UI. Wait for the next Sunday evening UTC tick and observe one real send (a test parent invite on a maintainer account).

---

## Bundled cleanup (audit Week 1 also includes these)

The audit Week 1 bundles three "free 2-3 days" items alongside the parent digest. They don't fit into this plan's flow, but should ship in the same week:

1. **Seed 7 missing supplements.** Add Amherst, Williams, Bowdoin, Rice, Pomona, Wellesley, Middlebury supplement prompts to `data/supplement-prompts-2026.json`. ~20-30 prompts total. Each has 2-4 prompts in the 2026-27 cycle. Manual research from each school's admissions page; ~4 hours.
2. **International branch on the fee-waiver checker** (`src/app/(dashboard)/test-strategy/components/FeeWaiverChecker.tsx`). Branch on `student.country !== 'US'`: replace the 4 US-domestic questions with international-appropriate ones (annual family income in local currency, school-counselor access, prior fee-waiver receipt). On qualification, surface the College Board international fee-assistance program contact path. ~2-3 days.
3. **CI guard for canonical-list ↔ JSON-seed integrity** (Workstream K of the roadmap). Vitest test that fails the build whenever a school named in a canonical list in `coach-prompt-builder.ts` is missing from `supplement-prompts-2026.json`, `school-deadlines-2026.json`, or `school-application-plans.json`. ~1 day.

These are small enough to ship as their own plans (or bundled into one "Week 1 cleanup" plan in a separate session). I'm leaving them out of this digest plan because mixing them dilutes the focus.

---

## Self-review

**Spec coverage:** Every audit Prompt 7 §4 + Prompt 8 Week 1 requirement is addressed by a Task above:
- Sunday evening local time → Tasks 10 + 11 (hourly cron + per-parent local-time gate)
- Email channel via Resend → Task 10
- Subject in preferred_language with framing → Task 5/6 (`subject()` per locale)
- Greeting with formal pronouns → Task 6 (per-locale `greeting()`)
- "What student did this week" + "Coming up in 14 days" + "Aid callout" + "Conversation starter" + "Portal link" + "Language toggle in footer" → Tasks 5/6 (template fields) + Task 9 (renderer)
- PKR conversion for Pakistani parents → Task 4 + Task 6 (Urdu/Hindi templates use `formatPkrNarrative`)
- Skip-if-no-meaningful-activity → Task 3 (`MeaningfulCheck` gate)
- Translate jargon every time → Task 6 (per-locale templates render jargon expansion on every mention)
- No urgency-shaming → Task 6 + Task 9 (regression test in Task 9 fails on banned literals)
- Conversation starter from Claude → Task 8

**Placeholder scan:** No TBD/TODO. Every task has executable code or a concrete edit instruction with file paths.

**Type consistency:** `DigestPayload`, `DigestActivity`, `DigestRenderResult`, `DigestTemplate` defined in Task 2 + Task 5; consumed in Tasks 3, 8, 9, 10. `DigestLang = "en" | "hi" | "ur" | "pa"` flows through everything.

**Risk:** The biggest is template translation quality. The audit was explicit — Urdu register and Pakistani-vs-Indian Punjabi distinctions are nuanced. Native-speaker review is in Task 13 Step 4 and the plan does not bypass it.

**Effort summary:** ~5 days end-to-end for one engineer, of which ~1 day is content (the templates) and ~1 day is native-speaker review turnaround. Engineering time per task is small (most tasks are 30-60 minutes).

---

## Execution

Pick **Subagent-Driven** (recommended — most tasks are mechanical; the Resend wrapper, Supabase client patterns, and cron handler are all proven from `deadline-reminders/route.ts`) or **Inline Execution** (acceptable too — only 13 tasks, none with judgment-call architecture decisions).

Atomic commits throughout. The plan is structured so reverting any single task does not break the build (the cron route in Task 10 fails open if migration in Task 1 isn't applied; templates in Task 6 default to English fallback if a locale is missing).
