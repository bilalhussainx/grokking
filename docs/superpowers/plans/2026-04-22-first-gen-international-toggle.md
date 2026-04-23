# First-Gen Flag and International Toggle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the user-facing surfaces and differentiated counselor behavior for first-gen + international students on top of the 60% of Section 4 already shipped in `supabase/migrations/20260417_coach_kairos_schema.sql` and the existing intake/identity flow.

**Architecture:** Tight delta on an already-partial feature. Additive DB migration (4 new columns, backfill from existing `country`), 3 inserted intake questions with conditional skip logic, an encouraging UI callout, coach-prompt-builder extensions (new `firstGenBlock` + unconditional `internationalBlock` with Pakistani-specific branch), 2 new dashboard resource cards gated on profile flags. No breaking changes; `country` stays as intake legacy, `home_country_code` is the canonical ISO-2 going forward.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 strict, Tailwind CSS 4, Supabase Postgres, Vitest, framer-motion + lucide-react for cards.

**Spec:** `docs/superpowers/specs/2026-04-22-first-gen-international-toggle-design.md`

---

## Task 1: Database migration for first-gen + international columns

**Files:**
- Create: `supabase/migrations/20260425_first_gen_international.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 20260425_first_gen_international.sql
-- Section 4: First-gen granularity + canonical international fields
-- Additive. cc_student_profiles already has: is_first_gen, is_international, citizenship_status, country.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS parents_education TEXT,
  ADD COLUMN IF NOT EXISTS home_country TEXT,
  ADD COLUMN IF NOT EXISTS home_country_code TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

COMMENT ON COLUMN cc_student_profiles.parents_education IS
  'Highest parent education: no_college | some_college | associates | bachelors | graduate. NULL = unknown.';
COMMENT ON COLUMN cc_student_profiles.home_country IS
  'Human-readable country name (e.g. "Pakistan"). Canonical going forward. country column kept for intake legacy.';
COMMENT ON COLUMN cc_student_profiles.home_country_code IS
  'ISO 3166-1 alpha-2 (e.g. "PK"). Canonical going forward.';
COMMENT ON COLUMN cc_student_profiles.preferred_language IS
  'BCP-47 language tag for UI/coach. Defaults to en. Will drive Urdu (ur) support in Section 6.';

-- Backfill home_country_code from existing country column where possible.
-- country already holds ISO-2 codes ("US", "CA", "PK", ...) per intake-questions.parseLocation.
UPDATE cc_student_profiles
SET home_country_code = country
WHERE home_country_code IS NULL
  AND country IS NOT NULL
  AND length(country) = 2;
```

- [ ] **Step 2: Apply migration locally**

Run: `npx supabase db push`
Expected: migration applies cleanly; no errors on the `IF NOT EXISTS` guards.

- [ ] **Step 3: Spot-check the schema**

Run:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'cc_student_profiles'
  AND column_name IN ('parents_education','home_country','home_country_code','preferred_language')
ORDER BY column_name;
```
Expected: 4 rows. `preferred_language` default is `'en'::text`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260425_first_gen_international.sql
git commit -m "feat(cc): add parents_education + home_country fields for Section 4"
```

---

## Task 2: Extend intake questions with conditional-skip metadata

**Files:**
- Modify: `src/lib/cc/intake-questions.ts`
- Modify: `src/app/api/cc/intake/turn/route.ts`
- Create: `src/lib/cc/__tests__/intake-questions.test.ts`

**Context:** The voice intake currently walks `INTAKE_QUESTIONS[0..5]` sequentially. We need to insert 3 new questions after the existing first-gen question, with skip predicates so US/CA students don't get asked international-specific ones. The `turn/route.ts` loop is the single place that advances the index — it's the right place to evaluate `skipIf`.

- [ ] **Step 1: Write failing tests for the new question set + skip logic**

Create `src/lib/cc/__tests__/intake-questions.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { INTAKE_QUESTIONS, nextAskableIndex, parseInternationalStatus } from "../intake-questions";

describe("INTAKE_QUESTIONS", () => {
  it("has the expected question ids in order", () => {
    const ids = INTAKE_QUESTIONS.map((q) => q.id);
    expect(ids).toEqual([
      "name_grade",
      "location",
      "home_language",
      "first_gen",
      "parents_education",
      "international_status",
      "citizenship_status",
      "worries",
      "schools_interest",
    ]);
  });

  it("parents_education is optional and has 5 options", () => {
    const q = INTAKE_QUESTIONS.find((x) => x.id === "parents_education")!;
    expect(q.required).toBe(false);
    expect(q.options).toHaveLength(5);
  });

  it("citizenship_status uses the shared citizenship option set", () => {
    const q = INTAKE_QUESTIONS.find((x) => x.id === "citizenship_status")!;
    expect(q.options).toContain("US Citizen");
    expect(q.options).toContain("International");
  });
});

describe("nextAskableIndex", () => {
  it("skips parents_education when first_gen is no", () => {
    const fields = { first_gen: "No" };
    const next = nextAskableIndex(3, fields);
    // after first_gen (index 3), skip parents_education (4), land on international_status (5)
    expect(next).toBe(5);
  });

  it("asks parents_education when first_gen is yes", () => {
    const fields = { first_gen: "Yes" };
    expect(nextAskableIndex(3, fields)).toBe(4);
  });

  it("asks parents_education when first_gen is not sure", () => {
    const fields = { first_gen: "Not sure" };
    expect(nextAskableIndex(3, fields)).toBe(4);
  });

  it("skips international_status + citizenship_status when country is US", () => {
    const fields = { first_gen: "No", location: "Boston, MA" };
    // from parents_education (4), skip intl (5), skip citizenship (6), land on worries (7)
    expect(nextAskableIndex(4, fields)).toBe(7);
  });

  it("skips international_status + citizenship_status when country is CA", () => {
    const fields = { first_gen: "No", location: "Toronto, Canada" };
    expect(nextAskableIndex(4, fields)).toBe(7);
  });

  it("asks international_status when country is not US/CA", () => {
    const fields = { first_gen: "Yes", location: "Lahore, Pakistan" };
    // from parents_education (4), ask international_status (5)
    expect(nextAskableIndex(4, fields)).toBe(5);
  });

  it("skips citizenship_status when international_status is no", () => {
    const fields = { location: "Lahore, Pakistan", international_status: "No" };
    // from international_status (5), skip citizenship_status (6), land on worries (7)
    expect(nextAskableIndex(5, fields)).toBe(7);
  });

  it("asks citizenship_status when international_status is yes", () => {
    const fields = { location: "Lahore, Pakistan", international_status: "Yes" };
    expect(nextAskableIndex(5, fields)).toBe(6);
  });

  it("returns -1 when there are no more askable questions", () => {
    const fields = { first_gen: "No", location: "Boston, MA" };
    expect(nextAskableIndex(8, fields)).toBe(-1); // past schools_interest
  });
});

describe("parseInternationalStatus", () => {
  it("returns true for yes", () => {
    expect(parseInternationalStatus("Yes")).toBe(true);
    expect(parseInternationalStatus("yes I am")).toBe(true);
  });
  it("returns false for no", () => {
    expect(parseInternationalStatus("No")).toBe(false);
    expect(parseInternationalStatus("no, not international")).toBe(false);
  });
  it("returns null for unknown", () => {
    expect(parseInternationalStatus("uh idk")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test — it should fail (symbols don't exist yet)**

Run: `npx vitest run src/lib/cc/__tests__/intake-questions.test.ts`
Expected: FAIL — `nextAskableIndex`, `parseInternationalStatus` not exported; new questions not in array.

- [ ] **Step 3: Extend `intake-questions.ts`**

Replace the contents of `src/lib/cc/intake-questions.ts` with:

```ts
export interface IntakeQuestion {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: "text" | "select" | "yes-no-unsure" | "freeform";
  options?: string[];
  required: boolean;
  fieldMap: string[];
  /**
   * Optional predicate. When true, the question is skipped and the intake
   * loop advances to the next one. Receives the accumulated extracted_fields
   * keyed by question id.
   */
  skipIf?: (extracted: Record<string, string>) => boolean;
}

const CITIZENSHIP_OPTIONS = ["US Citizen", "Permanent Resident", "International", "DACA", "Undocumented", "Not sure"];

const isUsOrCa = (extracted: Record<string, string>) => {
  const { country } = parseLocation(extracted.location || "");
  return country === "US" || country === "CA";
};

const firstGenIsNo = (extracted: Record<string, string>) => {
  const raw = (extracted.first_gen || "").toLowerCase();
  return raw.includes("no") && !raw.includes("not sure");
};

const intlStatusNotYes = (extracted: Record<string, string>) => {
  const parsed = parseInternationalStatus(extracted.international_status || "");
  return parsed !== true;
};

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    index: 0,
    id: "name_grade",
    text: "What's your name, and what year are you in high school?",
    voicePrompt: "Hi! I'm Coach Kairos, your free AI college counselor. Let's get to know each other. What's your name, and what year are you in high school?",
    type: "text",
    required: true,
    fieldMap: ["preferred_name", "grade_level"],
  },
  {
    index: 1,
    id: "location",
    text: "Where do you live?",
    voicePrompt: "Great to meet you! Where do you live — what state or country?",
    type: "text",
    required: true,
    fieldMap: ["state_province", "country", "home_country_code"],
  },
  {
    index: 2,
    id: "home_language",
    text: "What language does your family speak at home?",
    voicePrompt: "What language does your family speak at home? Coach Kairos speaks many languages — I want to make sure I can help your family too.",
    type: "select",
    options: ["English", "Spanish", "Mandarin", "Hindi", "Vietnamese", "Arabic", "Tagalog", "Korean", "Punjabi", "Urdu", "Other"],
    required: true,
    fieldMap: ["home_language"],
  },
  {
    index: 3,
    id: "first_gen",
    text: "Will you be the first in your family to attend a US or Canadian college?",
    voicePrompt: "Will you be the first person in your family to attend a US or Canadian college? It's totally fine to say you're not sure.",
    type: "yes-no-unsure",
    options: ["Yes", "No", "Not sure"],
    required: true,
    fieldMap: ["is_first_gen"],
  },
  {
    index: 4,
    id: "parents_education",
    text: "What's the highest level of education either of your parents completed?",
    voicePrompt: "One more on that — what's the highest level of education either of your parents completed? No college, some college, an associate's degree, a bachelor's, or a graduate degree?",
    type: "select",
    options: ["No college", "Some college", "Associate's degree", "Bachelor's degree", "Graduate degree"],
    required: false,
    fieldMap: ["parents_education"],
    skipIf: firstGenIsNo,
  },
  {
    index: 5,
    id: "international_status",
    text: "Will you be applying as an international student?",
    voicePrompt: "Sounds like you're outside the US and Canada — so you'd likely be applying as an international student. Is that right?",
    type: "yes-no-unsure",
    options: ["Yes", "No", "Not sure"],
    required: true,
    fieldMap: ["is_international"],
    skipIf: isUsOrCa,
  },
  {
    index: 6,
    id: "citizenship_status",
    text: "What's your citizenship status?",
    voicePrompt: "Got it. Just so I can steer you toward the right financial aid advice — what's your citizenship status? US citizen, permanent resident, international, or something else?",
    type: "select",
    options: CITIZENSHIP_OPTIONS,
    required: false,
    fieldMap: ["citizenship_status"],
    skipIf: (extracted) => isUsOrCa(extracted) || intlStatusNotYes(extracted),
  },
  {
    index: 7,
    id: "worries",
    text: "What are you most worried about in the college process?",
    voicePrompt: "What are you most worried about when it comes to college? Picking schools, paying for it, the essays, or something else?",
    type: "freeform",
    options: ["Choosing the right schools", "Paying for college", "Writing essays", "Getting in", "My grades/scores", "I don't know where to start", "Other"],
    required: false,
    fieldMap: ["worries"],
  },
  {
    index: 8,
    id: "schools_interest",
    text: "What schools have you heard of or are curious about?",
    voicePrompt: "Last question! What schools have you heard of or are curious about? Don't worry if you don't have any yet — that's what I'm here for.",
    type: "freeform",
    required: false,
    fieldMap: ["interested_schools"],
  },
];

/**
 * Given the index of the question we just answered (or -1 for "start"), and the
 * extracted_fields map accumulated so far, return the next askable index — or
 * -1 if we've exhausted the list.
 */
export function nextAskableIndex(justAnsweredIndex: number, extracted: Record<string, string>): number {
  for (let i = justAnsweredIndex + 1; i < INTAKE_QUESTIONS.length; i++) {
    const q = INTAKE_QUESTIONS[i];
    if (!q.skipIf || !q.skipIf(extracted)) return i;
  }
  return -1;
}

export function parseNameGrade(answer: string): { name: string; grade: number | null } {
  const gradeMatch = answer.match(/\b(9|10|11|12|freshman|sophomore|junior|senior|9th|10th|11th|12th)\b/i);
  let grade: number | null = null;
  if (gradeMatch) {
    const g = gradeMatch[1].toLowerCase();
    const map: Record<string, number> = { freshman: 9, sophomore: 10, junior: 11, senior: 12, "9th": 9, "10th": 10, "11th": 11, "12th": 12 };
    grade = map[g] ?? parseInt(g, 10);
  }
  const name = answer
    .replace(/\b(9th|10th|11th|12th|freshman|sophomore|junior|senior|grade|i'm in|i am in|year)\b/gi, "")
    .replace(/[.,!?]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
  return { name: name || "Student", grade };
}

export function parseLocation(answer: string): { state: string; country: string } {
  const usStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  const abbrevs: Record<string, string> = { AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming" };
  const upper = answer.toUpperCase().trim();
  if (abbrevs[upper]) return { state: abbrevs[upper], country: "US" };
  for (const s of usStates) {
    if (answer.toLowerCase().includes(s.toLowerCase())) return { state: s, country: "US" };
  }
  if (answer.toLowerCase().includes("canada")) return { state: answer.trim(), country: "CA" };
  // Crude country detection for common non-US/CA origins.
  const lower = answer.toLowerCase();
  const countryMap: Record<string, string> = {
    pakistan: "PK", india: "IN", bangladesh: "BD", nigeria: "NG", "united kingdom": "GB", uk: "GB",
    china: "CN", "south korea": "KR", korea: "KR", japan: "JP", vietnam: "VN", philippines: "PH",
    mexico: "MX", brazil: "BR", germany: "DE", france: "FR", spain: "ES", italy: "IT",
    australia: "AU", "new zealand": "NZ", "saudi arabia": "SA", uae: "AE", egypt: "EG",
  };
  for (const [name, code] of Object.entries(countryMap)) {
    if (lower.includes(name)) return { state: answer.trim(), country: code };
  }
  return { state: answer.trim(), country: "US" };
}

export function parseFirstGen(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function parseInternationalStatus(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function parseParentsEducation(answer: string): string | null {
  const lower = answer.toLowerCase();
  if (lower.includes("graduate") || lower.includes("master") || lower.includes("phd") || lower.includes("doctor")) return "graduate";
  if (lower.includes("bachelor")) return "bachelors";
  if (lower.includes("associate")) return "associates";
  if (lower.includes("some college")) return "some_college";
  if (lower.includes("no college") || lower.includes("high school") || lower.includes("none")) return "no_college";
  return null;
}

export function languageToCode(lang: string): string {
  const map: Record<string, string> = {
    english: "en", spanish: "es", mandarin: "zh", hindi: "hi",
    vietnamese: "vi", arabic: "ar", tagalog: "tl", korean: "ko", punjabi: "pa", urdu: "ur",
  };
  return map[lang.toLowerCase()] || "en";
}
```

- [ ] **Step 4: Run tests — they should pass**

Run: `npx vitest run src/lib/cc/__tests__/intake-questions.test.ts`
Expected: PASS — all 12 assertions.

- [ ] **Step 5: Update `turn/route.ts` to use `nextAskableIndex`**

In `src/app/api/cc/intake/turn/route.ts`, replace the post-save block:

```ts
// OLD:
const nextIndex = question_index + 1;
const isComplete = nextIndex >= INTAKE_QUESTIONS.length;

if (isComplete) {
  return NextResponse.json({
    next_question: null,
    progress: { current: INTAKE_QUESTIONS.length, total: INTAKE_QUESTIONS.length },
    is_complete: true,
  });
}

const nextQ = INTAKE_QUESTIONS[nextIndex];
```

with:

```ts
const nextIndex = nextAskableIndex(question_index, extracted);
const isComplete = nextIndex === -1;

if (isComplete) {
  return NextResponse.json({
    next_question: null,
    progress: { current: INTAKE_QUESTIONS.length, total: INTAKE_QUESTIONS.length },
    is_complete: true,
  });
}

const nextQ = INTAKE_QUESTIONS[nextIndex];
```

And update the import:

```ts
import { INTAKE_QUESTIONS, nextAskableIndex } from "@/lib/cc/intake-questions";
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (pre-existing e2e errors are unrelated).

- [ ] **Step 7: Commit**

```bash
git add src/lib/cc/intake-questions.ts src/lib/cc/__tests__/intake-questions.test.ts src/app/api/cc/intake/turn/route.ts
git commit -m "feat(intake): insert parents_education + international_status + citizenship questions with skip logic"
```

---

## Task 3: Persist new fields on intake complete

**Files:**
- Modify: `src/app/api/cc/intake/complete/route.ts`

**Context:** Today the handler writes `preferred_name`, `grade_level`, `state_province`, `country`, `home_language`, `is_first_gen`. We need to additionally write `parents_education`, `is_international`, `citizenship_status`, `home_country_code` (= country), and keep `country` in sync for backwards compat.

- [ ] **Step 1: Update imports**

At the top of `src/app/api/cc/intake/complete/route.ts`:

```ts
import {
  parseNameGrade,
  parseLocation,
  parseFirstGen,
  parseInternationalStatus,
  parseParentsEducation,
  languageToCode,
} from "@/lib/cc/intake-questions";
```

- [ ] **Step 2: Extend the parse + insert block**

Replace:

```ts
const fields = session.extracted_fields || {};
const { name, grade } = parseNameGrade(fields.name_grade || "");
const { state, country } = parseLocation(fields.location || "");
const firstGen = parseFirstGen(fields.first_gen || "");
const langCode = languageToCode(fields.home_language || "English");

const profileInsert: Record<string, unknown> = {
  preferred_name: name,
  grade_level: grade,
  state_province: state,
  country,
  home_language: langCode,
  is_first_gen: firstGen,
  profile_completion_pct: 15,
  intake_completed_at: new Date().toISOString(),
};
```

with:

```ts
const fields = session.extracted_fields || {};
const { name, grade } = parseNameGrade(fields.name_grade || "");
const { state, country } = parseLocation(fields.location || "");
const firstGen = parseFirstGen(fields.first_gen || "");
const parentsEdu = parseParentsEducation(fields.parents_education || "");
const isIntl = country !== "US" && country !== "CA"
  ? parseInternationalStatus(fields.international_status || "") ?? true
  : false;
const citizenship = typeof fields.citizenship_status === "string" && fields.citizenship_status.trim()
  ? fields.citizenship_status.trim()
  : null;
const langCode = languageToCode(fields.home_language || "English");

const profileInsert: Record<string, unknown> = {
  preferred_name: name,
  grade_level: grade,
  state_province: state,
  country,
  home_country_code: country,
  home_language: langCode,
  is_first_gen: firstGen,
  parents_education: parentsEdu,
  is_international: isIntl,
  citizenship_status: citizenship,
  profile_completion_pct: 15,
  intake_completed_at: new Date().toISOString(),
};
```

- [ ] **Step 3: Extend the returned `summary` object**

In both places where `summary: { ... }` is built, add alongside the existing fields:

```ts
parents_education: parentsEdu,
is_international: isIntl,
citizenship_status: citizenship,
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cc/intake/complete/route.ts
git commit -m "feat(intake): persist parents_education, is_international, citizenship on complete"
```

---

## Task 4: Encouraging callout in IdentityForm for first-gen students

**Files:**
- Modify: `src/components/cc/profile/IdentityForm.tsx`

**Context:** Currently `IdentityForm.tsx:214-233` renders two checkboxes in a 2-col grid — first-gen and international — with no reinforcing copy. Section 4.3 of the spec calls for an encouraging callout when first-gen is checked (or null, to prompt attention). The existing aesthetic is `#D4AF37` gold on `#141414` cards with `rounded-lg` chips.

- [ ] **Step 1: Wrap the first-gen checkbox in a vertical stack with an inline callout**

Replace the block at line 214-233:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.is_first_gen || false}
      onChange={(e) => update("is_first_gen", e.target.checked)}
      className="w-4 h-4 rounded accent-[#D4AF37]"
    />
    <span className="text-sm text-white/70">First-generation college student</span>
  </label>
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.is_international || false}
      onChange={(e) => update("is_international", e.target.checked)}
      className="w-4 h-4 rounded accent-[#D4AF37]"
    />
    <span className="text-sm text-white/70">International student</span>
  </label>
</div>
```

with:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={form.is_first_gen || false}
        onChange={(e) => update("is_first_gen", e.target.checked)}
        className="w-4 h-4 rounded accent-[#D4AF37]"
      />
      <span className="text-sm text-white/70">First-generation college student</span>
    </label>
    {(form.is_first_gen === true || form.is_first_gen === null || form.is_first_gen === undefined) && (
      <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#D4AF37]/90 leading-relaxed">
        First-gen applicants bring valuable perspectives to college campuses. Many top schools specifically seek first-gen students — and we&apos;ll help you tell that story in your application.
      </div>
    )}
  </div>
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.is_international || false}
      onChange={(e) => update("is_international", e.target.checked)}
      className="w-4 h-4 rounded accent-[#D4AF37]"
    />
    <span className="text-sm text-white/70">International student</span>
  </label>
</div>
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/profile/IdentityForm.tsx
git commit -m "feat(identity): show encouraging callout for first-gen applicants"
```

---

## Task 5: Add `firstGenBlock` + unconditional `internationalBlock` to coach prompt

**Files:**
- Modify: `src/lib/cc/coach-prompt-builder.ts`
- Modify: `src/lib/cc/__tests__/coach-prompt-builder.test.ts`

**Context:** Today international students only get the aid-specific `fullAidBlock` when `needsFullAid === true`, and first-gen has NO dedicated prompt block at all — `isFirstGen` appears only in the profile summary. Section 4.4 adds two pieces: (a) an always-on `firstGenBlock` that surfaces QuestBridge/Posse/College Advising Corps + 6 first-gen-friendly schools + essay-framing guidance, attached to school-builder / academic / essay / general modes; (b) an unconditional `internationalBlock` (not gated on full-aid) that calls out CSS Profile vs FAFSA, TOEFL/IELTS, timezone, with a Pakistani-specific tail.

- [ ] **Step 1: Write the 4 new failing tests**

Append to `src/lib/cc/__tests__/coach-prompt-builder.test.ts` inside the existing `describe("buildSystemPrompt", ...)`:

```ts
it("includes first-gen guidance block when isFirstGen is true", () => {
  const ctx: CoachContext = { ...baseContext, mode: "general", isFirstGen: true };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).toContain("QuestBridge");
  expect(prompt).toContain("Posse");
  expect(prompt).toContain("College Advising Corps");
  for (const school of ["UMich", "UNC-Chapel Hill", "UT Austin", "Vassar", "Amherst", "Williams"]) {
    expect(prompt).toContain(school);
  }
});

it("excludes first-gen guidance block when isFirstGen is false", () => {
  const ctx: CoachContext = { ...baseContext, mode: "general", isFirstGen: false };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).not.toContain("QuestBridge");
  expect(prompt).not.toContain("Posse");
});

it("includes unconditional international block when isInternational is true and needsFullAid is false", () => {
  const ctx: CoachContext = {
    ...baseContext,
    mode: "school-builder",
    isInternational: true,
    country: "IN",
    needsFullAid: false,
    affordabilityValue: "30k_50k",
  };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).toContain("CSS Profile");
  expect(prompt).toContain("TOEFL");
  expect(prompt.toLowerCase()).toContain("timezone");
});

it("includes Pakistani-specific guidance when isInternational and country is PK", () => {
  const ctx: CoachContext = {
    ...baseContext,
    mode: "general",
    isInternational: true,
    country: "PK",
  };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt.toLowerCase()).toContain("pakistan");
  expect(prompt.toLowerCase()).toContain("gpa conversion");
  expect(prompt).toContain("WES");
});
```

- [ ] **Step 2: Run tests — should fail**

Run: `npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts`
Expected: 4 new tests FAIL (QuestBridge not present, etc.).

- [ ] **Step 3: Add `firstGenBlock` + `internationalBlock` helpers and wire them into modes**

In `src/lib/cc/coach-prompt-builder.ts`, add two module-level helpers above `function getModeInstructions`:

```ts
function buildFirstGenBlock(ctx: CoachContext): string {
  if (!ctx.isFirstGen) return "";
  return `

FIRST-GEN GUIDANCE (CRITICAL): This student is the first in their family to attend college. Adjust your guidance accordingly:
- Proactively surface QuestBridge National College Match, Posse Foundation, and College Advising Corps — these are dedicated first-gen support programs.
- Recommend schools known for strong first-gen support: UMich, UNC-Chapel Hill, UT Austin, Vassar, Amherst, Williams. Mention these by name when relevant.
- Frame essay brainstorming around identity, family, and community — not just extracurriculars and achievements.
- Explain processes the student may not know: demonstrated interest, ED vs EA strategy, FAFSA priority deadlines, the CommonApp workflow itself.
- NEVER assume the student has college-educated parents to review applications or fill out financial aid forms.
- Always offer to explain any college term the student might not know.`;
}

function buildInternationalBlock(ctx: CoachContext): string {
  if (!ctx.isInternational) return "";
  const pakistaniTail = ctx.country === "PK"
    ? `
- Pakistani students specifically: confirm the GPA conversion from percentage to 4.0 scale. Mention WES evaluation if the student asks about transcript verification. Note that many schools convert Pakistani grades using their own tables, and official marksheets should always be submitted.`
    : "";
  return `

INTERNATIONAL STUDENT GUIDANCE:
- Use the need-blind-for-international filter proactively in school recommendations.
- Mention CSS Profile vs FAFSA distinctions when financial aid comes up.
- Explain demonstrated interest differently — international students often can't visit campus.
- Flag English proficiency requirements (TOEFL/IELTS) if the student hasn't mentioned test scores.
- Acknowledge timezone when discussing deadlines.${pakistaniTail}`;
}
```

- [ ] **Step 4: Append both blocks to the relevant mode returns**

In `getModeInstructions`, append `${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}` to the return string of each of these cases:

1. **`case "academic":`** — append after the existing academic instructions (both the international-no-GPA branch return and the default return).
2. **`case "school-builder":`** — append after `${fullAidBlock}` at the end of the returned template literal.
3. **`case "essay":`** — append after each of the three essay-mode return strings.
4. **`case "general":`** — append after the existing general return.

For `school-builder`, change the trailing `${fullAidBlock}` to `${fullAidBlock}${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}`.

For `general`, change the end of the existing return to end with `${ESSAY_REVIEW_PRINCIPLES}${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}`.

For `academic`, end each of the two returns with `${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}`.

For `essay`, end each of the three returns with `${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}`.

**Why not intake / school-browse / essay-post-review / interview:** `intake` is pre-profile (we don't know the flags yet); `school-browse`/`essay-post-review`/`interview` read from already-built context that's loaded elsewhere and don't need the policy framing mid-review. Keep the surface tight.

- [ ] **Step 5: Run the full test file — all tests pass**

Run: `npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts`
Expected: all tests PASS (existing + 4 new).

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/lib/cc/coach-prompt-builder.ts src/lib/cc/__tests__/coach-prompt-builder.test.ts
git commit -m "feat(coach): add first-gen + unconditional international prompt blocks with Pakistan-specific tail"
```

---

## Task 6: Dashboard resource cards for first-gen + international students

**Files:**
- Create: `src/components/cc/resources/FirstGenResourcesCard.tsx`
- Create: `src/components/cc/resources/InternationalGuideCard.tsx`
- Modify: `src/app/cc/page.tsx`

**Context:** Dashboard is `/cc` (`src/app/cc/page.tsx`). Today it's a 6-tool grid (Essay Studio, Interview Prep, Activities Optimizer, Recommendations Coach, School List Builder, Counselor Share Link) inside `max-w-4xl` container with framer-motion `staggerChildren`. Resource cards go below the tools grid, above the closing div, shown conditionally via a client-side profile fetch. They use the same `rounded-2xl border border-white/10 bg-[#141414]` aesthetic but with gold/emerald accents.

The CSS Profile Guide link (`/profile/css-guide`) ships in Section 8 — for now the card links to it as a placeholder and the page will 404 until §8 lands. Noted in spec Out-of-Scope.

- [ ] **Step 1: Create `FirstGenResourcesCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";

const FIRST_GEN_RESOURCES = [
  {
    name: "QuestBridge National College Match",
    href: "https://www.questbridge.org/high-school-students/national-college-match",
    desc: "Full 4-year scholarships to 45+ partner colleges for high-achieving, low-income students.",
  },
  {
    name: "Posse Foundation",
    href: "https://www.possefoundation.org/shaping-the-future/becoming-a-posse-scholar",
    desc: "Leadership-based scholarship that sends cohorts (\"posses\") of 10 students to partner colleges.",
  },
  {
    name: "College Advising Corps",
    href: "https://advisingcorps.org/our-work/students/",
    desc: "Free near-peer college advising in underserved high schools across 18 states.",
  },
];

export default function FirstGenResourcesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#D4AF37]/30 bg-[#141414] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Your First-Gen Advantage</h3>
          <p className="text-white/50 text-sm">Programs built specifically for first-generation applicants.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {FIRST_GEN_RESOURCES.map((r) => (
          <li key={r.name}>
            <Link
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 bg-white/[0.02] p-3 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{r.name}</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-white/40 text-xs leading-relaxed mt-0.5">{r.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `InternationalGuideCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ExternalLink } from "lucide-react";

const INTL_RESOURCES: Array<{ name: string; href: string; desc: string; external?: boolean }> = [
  {
    name: "CSS Profile Guide",
    href: "/profile/css-guide",
    desc: "Step-by-step walkthrough for the financial aid form most need-blind schools require of internationals.",
  },
  {
    name: "Need-blind for international students",
    href: "/schools?filter=need-blind-intl",
    desc: "The 8 US colleges that don't factor aid need into international admission decisions.",
  },
  {
    name: "TOEFL vs IELTS",
    href: "https://www.ets.org/toefl/test-takers/ibt/about.html",
    desc: "Which English proficiency test your target schools accept (most take either).",
    external: true,
  },
  {
    name: "F-1 Visa process overview",
    href: "https://studyinthestates.dhs.gov/students/prepare/students-and-the-form-i-20",
    desc: "Form I-20 + consular interview basics once an admission offer lands.",
    external: true,
  },
];

export default function InternationalGuideCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-emerald-400/30 bg-[#141414] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">International Applicant Guide</h3>
          <p className="text-white/50 text-sm">Finance, testing, and visa resources for applying from outside the US.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {INTL_RESOURCES.map((r) => (
          <li key={r.name}>
            <Link
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-3 rounded-xl border border-white/5 hover:border-emerald-400/40 bg-white/[0.02] p-3 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{r.name}</span>
                  {r.external && (
                    <ExternalLink className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <p className="text-white/40 text-xs leading-relaxed mt-0.5">{r.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
```

- [ ] **Step 3: Wire the cards into the dashboard with a profile fetch**

Replace the entire contents of `src/app/cc/page.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Building2,
  ClipboardList,
  Users,
  Share2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import FirstGenResourcesCard from "@/components/cc/resources/FirstGenResourcesCard";
import InternationalGuideCard from "@/components/cc/resources/InternationalGuideCard";

const TOOLS = [
  {
    title: "Essay Studio",
    desc: "AI-guided brainstorming, outline generation, and draft coaching. Personal statements, supplementals, and Why Us essays.",
    href: "/cc/essays",
    icon: BookOpen,
    status: "active",
  },
  {
    title: "Interview Prep",
    desc: "Practice with 10 Ivy+ alumni AI personas. Harvard, Yale, Stanford, MIT, and more. 4-session adaptive arc.",
    href: "/college-interviews",
    icon: Target,
    status: "active",
  },
  {
    title: "Activities Optimizer",
    desc: "AI reviews your Common App activities list. Get description rewrites, impact scoring, and optimal ordering.",
    href: "/cc/activities-optimizer",
    icon: ClipboardList,
    status: "active",
  },
  {
    title: "Recommendations Coach",
    desc: "Build brag sheets for each recommender. AI drafts ask emails, tracks confirmation status.",
    href: "/cc/recommenders",
    icon: Users,
    status: "active",
  },
  {
    title: "School List Builder",
    desc: "Search 1,500+ colleges. Get chancing estimates, compare net prices, and track application status.",
    href: "/intake",
    icon: Building2,
    status: "active",
  },
  {
    title: "Counselor Share Link",
    desc: "Generate one link to share your essays, activities, school list, and scores with counselors and parents.",
    href: "/cc/share-settings",
    icon: Share2,
    status: "active",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

interface ProfileFlags {
  is_first_gen: boolean | null;
  is_international: boolean | null;
}

export default function CCDashboard() {
  const [flags, setFlags] = useState<ProfileFlags>({ is_first_gen: null, is_international: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cc/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.profile) {
          setFlags({
            is_first_gen: data.profile.is_first_gen ?? null,
            is_international: data.profile.is_international ?? null,
          });
        }
      } catch {
        /* unauthenticated or no profile — cards just stay hidden */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showFirstGen = flags.is_first_gen === true;
  const showIntl = flags.is_international === true;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Application Toolkit
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Everything you need to build a standout college application — essays,
            interviews, activities, recommendations, and more.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.title} variants={item}>
                <Link href={tool.href}>
                  <div className="group h-full rounded-2xl border border-white/10 bg-[#141414] hover:border-[#D4AF37]/40 p-6 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">
                            {tool.title}
                          </h3>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {(showFirstGen || showIntl) && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {showFirstGen && <FirstGenResourcesCard />}
            {showIntl && <InternationalGuideCard />}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify `/api/cc/profile` returns `is_first_gen` + `is_international`**

Run: `grep -n "is_first_gen\|is_international" src/app/api/cc/profile/route.ts`
Expected: both fields in the SELECT and response. If missing, add them to the select string.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Manual smoke test**

```bash
npm run dev
```
Open `/cc`:
- With a profile where `is_first_gen = true` and `is_international = false`: FirstGenResourcesCard renders, InternationalGuideCard does NOT.
- With a profile where both are true: both cards render side-by-side on `lg` screens, stacked below.
- Unauthenticated: neither card renders.

- [ ] **Step 7: Commit**

```bash
git add src/components/cc/resources/FirstGenResourcesCard.tsx src/components/cc/resources/InternationalGuideCard.tsx src/app/cc/page.tsx
git commit -m "feat(cc): first-gen + international resource cards on dashboard"
```

---

## Task 7: Final integration check

**Files:** none modified — verification only.

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: clean aside from the pre-existing unrelated error in `tests/e2e/comprehensive-visual-audit.spec.ts:15:25` (not introduced by this PR).

- [ ] **Step 2: Full vitest pass**

Run: `npx vitest run src/lib/cc/__tests__/ src/app/api/cc/schools/__tests__/`
Expected: all tests PASS, including the 4 new first-gen/international tests and the 12 intake-questions tests.

- [ ] **Step 3: Next build succeeds**

Run: `npm run build`
Expected: build completes; `/cc` is statically generated or SSR'd without errors.

- [ ] **Step 4: Acceptance-criteria walkthrough**

Re-read `docs/superpowers/specs/2026-04-22-first-gen-international-toggle-design.md` "Acceptance criteria" list and confirm each checkbox:

- [ ] Migration adds 4 columns, backfills `home_country_code` from `country` (Task 1)
- [ ] Intake wizard asks international status only for non-US/CA students (Task 2)
- [ ] Intake wizard asks citizenship status only for internationals (Task 2)
- [ ] Intake wizard asks parents_education granularity when first-gen is yes/not-sure (Task 2)
- [ ] Encouraging callout appears in IdentityForm when first-gen is true or null (Task 4)
- [ ] Coach prompt includes first-gen block when `isFirstGen === true`, mentioning QuestBridge + Posse + 6 schools (Task 5)
- [ ] Coach prompt includes international block when `isInternational === true` (Task 5)
- [ ] Pakistani-specific guidance appears when `isInternational && country === "PK"` (Task 5)
- [ ] Dashboard shows FirstGenResourcesCard when `is_first_gen === true` (Task 6)
- [ ] Dashboard shows InternationalGuideCard when `is_international === true` (Task 6)
- [ ] 4 new vitest tests pass (Task 5)
- [ ] `tsc --noEmit` clean (ignoring pre-existing e2e errors) (Task 7)

- [ ] **Step 5: Final commit (if any cleanup was needed)**

If Step 4 required adding missing fields to `/api/cc/profile/route.ts`:

```bash
git add -A
git commit -m "chore: surface profile flags for dashboard resource cards"
```

---

## Self-Review Notes

- **Spec coverage:** Each of the 6 scope items in the spec maps to exactly one task (1→Task 1, 2→Task 2+3, 3→Task 4, 4→Task 5, 5→Task 6, 6→Task 5's tests). Acceptance criteria all covered in Task 7's walkthrough.
- **Placeholder scan:** No TBDs, TODOs, or "add appropriate X" steps. Every code block is complete.
- **Type consistency:** `nextAskableIndex` signature is `(number, Record<string,string>) => number` everywhere. `parseInternationalStatus` returns `boolean | null`. `parseParentsEducation` returns `string | null`. All match between definitions (Task 2 Step 3) and usages (Task 3 Step 2, Task 2 Step 1 tests).
- **Ambiguity resolutions:** `country` stays as intake legacy, `home_country_code` is canonical ISO-2 (migration backfills, intake-complete writes both). Cards are placed below tools-grid, above closing div, inside the same `max-w-4xl` container. CSS Profile Guide link is a known placeholder pending Section 8.
- **Red flags avoided:** No test-mocking-database-in-integration-tests. No `--no-verify` hook skips. No destructive git operations.
