# Aid Offer Comparator + `decisions` Coach Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the demo-ware `senior_decisions` aid-comparator promise with a real product: a `cc_aid_offers` table per student per school, a paste-or-upload ingest UI at `/cc/aid-offers`, a side-by-side comparator with USD↔PKR conversion + 4-year cost projection, and a new `decisions` coach mode that consumes the user's actual aid offers to draft negotiation letters.

**Architecture:** Single new table (`cc_aid_offers`) keyed on `(student_id, student_school_id)`. Paste-text is the v1 ingest (no OCR — most schools email letters as plain text). API layer at `/api/cc/aid-offers` with REST verbs. UI page composes an ingest form + a comparator view. Coach gets a new `decisions` mode that pulls `aidOffers[]` from the user's profile into the system prompt, enabling specific negotiation-letter drafts that reference real numbers.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Supabase (Postgres + RLS), Tailwind 4, framer-motion, vitest, OpenRouter Sonnet 4.6 (for the coach `decisions` mode).

**Audit anchors:**
- Prompt 1 Row 4 — `senior_writing` → `_post_submit` → `_decisions` marquee transition is broken at the decisions leg
- Prompt 3 #1 — top-priority feature
- Prompt 4 Gap 2 — `senior_decisions` walkthrough promises a comparator that doesn't exist
- Prompt 6 #6 — Path-from-4-to-10 financial-aid scorecard, item #6
- Prompt 8 Week 2 — explicit Week 2 ship

**Roadmap:** `docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md` Workstream B.

---

## Pre-verified state

**Existing stub routes (will be replaced):**
- `src/app/api/cc/aid-offers/route.ts` — POST returns `stub("/api/cc/aid-offers")`
- `src/app/api/cc/aid-offers/compare/route.ts` — POST returns `stub("/api/cc/aid-offers/compare", { comparison: [] })`

**Already configured:**
- `src/lib/cc/grade-route-policy.ts:15` blocks `/cc/aid-offers` for g9 students. No change needed.
- `src/lib/cc/coach-prompt-builder.ts` has 8 modes: `intake, academic, school-builder, school-browse, essay-post-review, essay, interview, general`. None named `decisions`. We add it.
- `src/app/cc/dashboard/variants.ts:senior_decisions` priority card "Aid comparator" currently links to `/applications` — wrong target. Update to `/cc/aid-offers`.
- `src/components/cc/dashboard/sections/PriorityWidgetRow.tsx` `WIDGET_CONFIG.aidComparator.href = "/applications"` — same fix.

**Existing helpers we reuse:**
- `chatOnce` at `src/lib/cc/openrouter.ts` (Sonnet 4.6, no streaming)
- `requireAuth, createAdminSupabase` at `src/app/api/cc/helpers`
- `cc_student_schools` table — already shipped with `student_id` and the 8 deadline columns

---

## File map

```
supabase/migrations/
  20260503_aid_offers.sql                                 ← NEW — cc_aid_offers table + RLS

src/lib/cc/aid-offers/
  types.ts                                                ← NEW — AidOffer, IngestInput, ComparisonRow
  parse-letter.ts                                         ← NEW — paste-text → IngestInput
  parse-letter.test.ts                                    ← NEW
  format-pkr.ts                                           ← NEW — USD → PKR (lakhs/crores) helper (mirrors parent-digest)
  format-pkr.test.ts                                      ← NEW
  four-year-projection.ts                                 ← NEW — annual cost × 4 with tuition-bump assumption
  four-year-projection.test.ts                            ← NEW

src/app/api/cc/aid-offers/
  route.ts                                                ← MODIFY — replace stub with GET (list) + POST (create)
  [id]/route.ts                                           ← NEW — PATCH (update) + DELETE
  compare/route.ts                                        ← MODIFY — replace stub with real GET (return comparison rows)

src/app/cc/aid-offers/
  page.tsx                                                ← NEW — server-component shell (auth + onboarding gate)
  AidOfferIngestForm.tsx                                  ← NEW — paste-or-form input
  AidOfferComparator.tsx                                  ← NEW — side-by-side table
  AidOfferRow.tsx                                         ← NEW — single offer renderer

src/lib/cc/coach-prompt-builder.ts                         ← MODIFY — add `decisions` mode + aidOffers in CoachContext
src/lib/cc/coach-mode-detector.ts                          ← MODIFY — route `decisions` mode for senior_decisions variant + aid-offers page

src/app/api/cc/coach/message/route.ts                      ← MODIFY — fetch aidOffers when mode is `decisions`, pass into context

src/app/cc/dashboard/variants.ts                           ← MODIFY — senior_decisions priority "Aid comparator" href → `/cc/aid-offers`
src/components/cc/dashboard/sections/PriorityWidgetRow.tsx ← MODIFY — WIDGET_CONFIG.aidComparator.href → `/cc/aid-offers`
```

---

## Diagnosis (read before implementing)

### v1 ingest is paste-text, not OCR

Aid letter formats are heterogeneous (PDF from Common App portal, plain text email from financial aid office, screenshots from student-info systems). Building OCR is a separate sprint. v1 accepts:

1. **Form mode** — student fills 5 fields per offer: school, gross cost, grants, loans, work-study, currency.
2. **Paste mode** — student pastes the raw aid letter text. The parser at `src/lib/cc/aid-offers/parse-letter.ts` does best-effort extraction and pre-fills the form. The student edits + confirms before submit.

The parser handles two common formats: "Cost of Attendance: $X / Grants: $Y / Loans: $Z" line-pairs (most common in US private schools' summary tables), and "Total Direct Costs: $X" with separate "Grant Aid" and "Self-Help" rows (common in Ivy League / NESCAC). For unrecognized formats, the form is empty and the student fills it manually — that's still better than the current state (no surface at all).

### USD↔PKR FX is pinned, not real-time

Live FX endpoints fail at the worst moments. We pin a `PKR_PER_USD = 280` constant at the top of the comparator and PKR helper. The number gets refreshed manually every 3-6 months via a code change. Narrative formatting ("≈ PKR 50 lakh") absorbs ±10% drift without losing usefulness — that's the right tolerance for a "rough comparison" surface. The student is told to verify with their bank before any financial decision.

### 4-year projection assumes 4% annual tuition increase

Standard private-school tuition inflation. For aid that's meets-need (which the canonical 8 + need-aware 8 do), grants typically scale with cost so the net price rises closer to inflation than tuition. We use 4% on gross cost and 3% on grants (slightly slower) so the projection is conservative-pessimistic for the family. Documented inline in `four-year-projection.ts`.

### `decisions` coach mode is gated on the page + variant

The mode fires when:
- `variant_key === "senior_decisions"`, OR
- `page_context === "/cc/aid-offers"`

In either case the API route fetches `cc_aid_offers WHERE student_id = ?` and includes them in the system prompt. The mode prompt instructs the LLM to:
- Reference offers BY SCHOOL NAME with actual numbers from the data
- Suggest a SINGLE most-leverageable negotiation target (the school where a competing offer is materially better)
- Never claim to "send" the letter — the LLM drafts; the student sends
- Use the student's `home_language` per the existing `pickCoachLanguage` helper

### Negotiation letter best practices baked into the prompt

Researched conventions:
1. **Address financial aid office, not admissions** — different team, different process
2. **Acknowledge admission gratitude first** — sets cooperative tone
3. **State financial gap concretely** — "$X out-of-pocket vs $Y at competing offer"
4. **Cite the competing offer** — school name + amount; offices verify but the citation matters
5. **Single ask** — match the gap, OR specify a smaller specific amount that closes the family's afford-it threshold
6. **Provide context if relevant** — change of family circumstance, additional siblings in college, etc.
7. **Polite close** — "I would be grateful for any reconsideration; I remain very excited about [school]"

The LLM gets these as a numbered system-prompt section (Task 11) so every draft follows the structure.

---

## Task 1 — Migration: `cc_aid_offers` table + RLS

**Files:** Create `supabase/migrations/20260503_aid_offers.sql`.

- [ ] **Step 1: Write the migration.**

```sql
-- supabase/migrations/20260503_aid_offers.sql
-- Per-school aid offer ingest. Filled in by students copying their aid
-- letters into /cc/aid-offers. Paste-text parser pre-fills; student edits.
-- Used by: comparator UI, the coach `decisions` mode (negotiation drafts),
-- and any future net-price-related features.

CREATE TABLE IF NOT EXISTS cc_aid_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  student_school_id UUID NOT NULL REFERENCES cc_student_schools(id) ON DELETE CASCADE,

  -- Annual figures, all in `currency`. cost_of_attendance is the gross
  -- sticker; grants reduce it, loans + work_study are self-help.
  cost_of_attendance NUMERIC(10, 2) NOT NULL,
  grants             NUMERIC(10, 2) NOT NULL DEFAULT 0,
  loans              NUMERIC(10, 2) NOT NULL DEFAULT 0,
  work_study         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  net_cost           NUMERIC(10, 2) GENERATED ALWAYS AS (cost_of_attendance - grants) STORED,
  currency           TEXT NOT NULL DEFAULT 'USD',

  -- Free-text notes the student copied from the letter (e.g. merit award
  -- notes, athletic considerations). Surfaced to the coach `decisions` mode
  -- so it can write negotiation letters that reference these qualifiers.
  notes              TEXT,

  -- Snapshot of the raw pasted text (if any). Useful for re-parsing if the
  -- parser improves later. Optional — students who use the form directly
  -- have NULL here.
  source_paste       TEXT,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(student_school_id)
);

CREATE INDEX IF NOT EXISTS cc_aid_offers_student_idx
  ON cc_aid_offers(student_id, created_at DESC);

ALTER TABLE cc_aid_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students manage their aid offers" ON cc_aid_offers;
CREATE POLICY "students manage their aid offers"
  ON cc_aid_offers FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

-- updated_at maintained by an explicit UPDATE in the API; no trigger.
```

- [ ] **Step 2: Apply locally.** `npx supabase db push`. Verify with `\d cc_aid_offers` (table exists with the generated `net_cost` column).

- [ ] **Step 3: Commit.**
```bash
git add supabase/migrations/20260503_aid_offers.sql
git commit -m "feat(aid-offers): cc_aid_offers table with RLS + generated net_cost"
```

---

## Task 2 — Shared types

**Files:** Create `src/lib/cc/aid-offers/types.ts`.

- [ ] **Step 1: Write the types module.**

```typescript
// src/lib/cc/aid-offers/types.ts
// Shared types for the aid-offer pipeline. The DB column names are
// snake_case; the API serializes them as camelCase to match the rest of
// the codebase (e.g. /api/cc/dashboard/summary).

export type Currency = "USD" | "CAD" | "GBP" | "PKR" | "INR" | "EUR";

// Row from cc_aid_offers (camelCased for API responses). The DB has a
// generated `net_cost` column; we expose it as `netCost`.
export interface AidOffer {
  id: string;
  studentId: string;
  studentSchoolId: string;
  schoolName: string; // joined from cc_schools at API layer
  costOfAttendance: number;
  grants: number;
  loans: number;
  workStudy: number;
  netCost: number;
  currency: Currency;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Shape POSTed by the ingest UI. studentSchoolId picks the school; numbers
// arrive parsed (the form's numeric inputs handle that). currency defaults
// to USD on the server if omitted.
export interface AidOfferIngestInput {
  studentSchoolId: string;
  costOfAttendance: number;
  grants: number;
  loans: number;
  workStudy: number;
  currency?: Currency;
  notes?: string;
  sourcePaste?: string; // optional — only when the user used paste mode
}

// Shape PATCHed for partial updates. All fields optional; server omits
// SQL columns the user didn't touch.
export type AidOfferPatch = Partial<Omit<AidOfferIngestInput, "studentSchoolId">>;

// Comparison row for the comparator UI. One per offer the student has
// entered. `outOfPocketUsd` and `outOfPocketPkr` are normalized to USD/PKR
// at API time using the pinned PKR_PER_USD constant.
export interface ComparisonRow {
  id: string;
  schoolName: string;
  costOfAttendance: number;
  grants: number;
  loans: number;
  workStudy: number;
  netCost: number;
  currency: Currency;
  outOfPocketUsd: number;       // netCost normalized to USD
  outOfPocketPkr: number;       // outOfPocketUsd × PKR_PER_USD (rounded to nearest 1000)
  fourYearTotalUsd: number;     // see four-year-projection.ts
  rank: number;                 // 1 = lowest out-of-pocket
}

// Result returned by parseAidLetter. All fields optional — the form opens
// pre-filled with whatever was extracted, and the student edits the rest.
export interface ParsedLetter {
  costOfAttendance?: number;
  grants?: number;
  loans?: number;
  workStudy?: number;
  notes?: string;
  // Confidence score 0..1. Below 0.5, the form opens with a banner
  // "Couldn't parse this letter cleanly — please verify".
  confidence: number;
}
```

- [ ] **Step 2: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.

- [ ] **Step 3: Commit.**
```bash
git add src/lib/cc/aid-offers/types.ts
git commit -m "feat(aid-offers): shared types"
```

---

## Task 3 — PKR formatter (TDD)

**Files:** Create `src/lib/cc/aid-offers/format-pkr.ts` + `format-pkr.test.ts`.

The same `formatPkrNarrative` helper used in the parent-digest plan. Pakistani parents process money in lakhs (100,000) and crores (10,000,000). Pinned `PKR_PER_USD = 280`.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/aid-offers/format-pkr.test.ts
import { describe, it, expect } from "vitest";
import { formatPkrNarrative, PKR_PER_USD, usdToPkr } from "./format-pkr";

describe("usdToPkr", () => {
  it("multiplies by PKR_PER_USD and rounds to nearest 1000", () => {
    expect(usdToPkr(100)).toBe(28000);
    expect(usdToPkr(1)).toBe(0); // rounds 280 → 0
  });
});

describe("formatPkrNarrative", () => {
  it("plain comma-format below 1 lakh", () => {
    expect(formatPkrNarrative(50_000)).toBe("PKR 50,000");
  });
  it("'X.X lakh' between 100k and 1 crore", () => {
    expect(formatPkrNarrative(250_000)).toBe("PKR 2.5 lakh");
    expect(formatPkrNarrative(2_500_000)).toBe("PKR 25 lakh");
  });
  it("'X.X crore' at 1 crore and above", () => {
    expect(formatPkrNarrative(10_000_000)).toBe("PKR 1 crore");
    expect(formatPkrNarrative(11_500_000)).toBe("PKR 1.15 crore");
  });
  it("suppresses .0 when integer", () => {
    expect(formatPkrNarrative(300_000)).toBe("PKR 3 lakh");
  });
  it("PKR_PER_USD is exported as a number", () => {
    expect(typeof PKR_PER_USD).toBe("number");
    expect(PKR_PER_USD).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run, expect failure.** `npx vitest run src/lib/cc/aid-offers/format-pkr.test.ts`. Module not found.

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/aid-offers/format-pkr.ts
// Pinned exchange rate. Refreshed manually every 3-6 months by a code
// change. Live FX endpoints fail at the worst moments and the narrative
// format ("≈ PKR 50 lakh") absorbs ±10% drift without losing meaning.
// Verify with the family bank before any decision.
export const PKR_PER_USD = 280;

export function usdToPkr(usd: number): number {
  // Round to nearest 1000 PKR — matches how Pakistani families think
  // about figures of this size.
  return Math.round((usd * PKR_PER_USD) / 1000) * 1000;
}

export function formatPkrNarrative(pkr: number): string {
  if (pkr < 100_000) {
    return `PKR ${pkr.toLocaleString("en-US")}`;
  }
  if (pkr < 10_000_000) {
    const lakh = pkr / 100_000;
    const formatted = Number.isInteger(lakh) ? lakh.toString() : lakh.toFixed(1);
    return `PKR ${formatted} lakh`;
  }
  const crore = pkr / 10_000_000;
  const formatted = Number.isInteger(crore) ? crore.toString() : crore.toFixed(2);
  return `PKR ${formatted} crore`;
}
```

- [ ] **Step 4: Run, expect pass.** All tests green.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/aid-offers/format-pkr.ts src/lib/cc/aid-offers/format-pkr.test.ts
git commit -m "feat(aid-offers): formatPkrNarrative + usdToPkr helpers + tests"
```

---

## Task 4 — Four-year projection (TDD)

**Files:** Create `src/lib/cc/aid-offers/four-year-projection.ts` + tests.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/aid-offers/four-year-projection.test.ts
import { describe, it, expect } from "vitest";
import { fourYearTotalUsd } from "./four-year-projection";

describe("fourYearTotalUsd", () => {
  it("returns 4 × netCost when no inflation assumed", () => {
    // The default 4%/3% assumption means total > 4 × netCost. This
    // sanity-checks the lower bound.
    const total = fourYearTotalUsd({ costOfAttendance: 80000, grants: 60000 });
    // Year 1 net = 20000. Total ≥ 80000 (no inflation) and ≤ 100000 (5% on
    // both sides — generous upper bound).
    expect(total).toBeGreaterThanOrEqual(80_000);
    expect(total).toBeLessThanOrEqual(100_000);
  });

  it("computes year-over-year compounding correctly", () => {
    // Hand-calculated: COA 80k → 83.2k → 86.528k → 89.989k. Total ≈ 339,717.
    // Grants 60k → 61.8k → 63.654k → 65.564k. Total ≈ 251,018.
    // Net = 339,717 - 251,018 = 88,699. Allow ±200 rounding.
    const total = fourYearTotalUsd({ costOfAttendance: 80000, grants: 60000 });
    expect(total).toBeGreaterThan(88_000);
    expect(total).toBeLessThan(89_500);
  });

  it("returns 4 × COA when grants is zero", () => {
    const total = fourYearTotalUsd({ costOfAttendance: 50000, grants: 0 });
    // 50k × (1 + 1.04 + 1.04^2 + 1.04^3) = 50k × 4.2465 ≈ 212,326
    expect(total).toBeGreaterThan(212_000);
    expect(total).toBeLessThan(213_000);
  });

  it("never returns negative even when grants exceed cost", () => {
    // Edge: full ride with stipend (grants > cost). Should clamp to 0.
    const total = fourYearTotalUsd({ costOfAttendance: 80000, grants: 100000 });
    expect(total).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/aid-offers/four-year-projection.ts
// Standard private-school tuition inflation: 4% annual on cost,
// 3% on grants (grants typically scale slightly slower than tuition).
// Conservative-pessimistic — gives families a ceiling estimate.
// Documented here so when families ask we can show our work.
const COST_INFLATION = 0.04;
const GRANT_INFLATION = 0.03;
const YEARS = 4;

export function fourYearTotalUsd(input: {
  costOfAttendance: number;
  grants: number;
}): number {
  let total = 0;
  for (let year = 0; year < YEARS; year++) {
    const cost = input.costOfAttendance * Math.pow(1 + COST_INFLATION, year);
    const grants = input.grants * Math.pow(1 + GRANT_INFLATION, year);
    total += Math.max(0, cost - grants);
  }
  return Math.round(total);
}
```

- [ ] **Step 4: Run, expect pass.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/aid-offers/four-year-projection.ts src/lib/cc/aid-offers/four-year-projection.test.ts
git commit -m "feat(aid-offers): fourYearTotalUsd projection with conservative inflation assumptions"
```

---

## Task 5 — Paste-text parser (TDD)

**Files:** Create `src/lib/cc/aid-offers/parse-letter.ts` + tests.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/aid-offers/parse-letter.test.ts
import { describe, it, expect } from "vitest";
import { parseAidLetter } from "./parse-letter";

describe("parseAidLetter", () => {
  it("returns confidence 0 and no fields for empty input", () => {
    const result = parseAidLetter("");
    expect(result.confidence).toBe(0);
    expect(result.costOfAttendance).toBeUndefined();
  });

  it("extracts the common 'Cost of Attendance: $X' Ivy-style format", () => {
    const text = `
      Financial Aid Award Letter

      Cost of Attendance: $86,725
      Grants: $62,400
      Loans: $5,500
      Work-Study: $2,500
    `;
    const result = parseAidLetter(text);
    expect(result.costOfAttendance).toBe(86725);
    expect(result.grants).toBe(62400);
    expect(result.loans).toBe(5500);
    expect(result.workStudy).toBe(2500);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("extracts the 'Total Direct Costs' / 'Grant Aid' Harvard-style format", () => {
    const text = `
      Total Direct Costs: $87,450
      Grant Aid: $62,000
      Self-Help (Loans + Work-Study): $4,500
    `;
    const result = parseAidLetter(text);
    expect(result.costOfAttendance).toBe(87450);
    expect(result.grants).toBe(62000);
    // Self-Help isn't broken out — leave loans + workStudy undefined so
    // the form prompts the student to split.
    expect(result.loans).toBeUndefined();
    expect(result.workStudy).toBeUndefined();
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("handles thousands-comma + dollar-sign + extra whitespace", () => {
    const text = `Cost of Attendance:    $ 86 , 725.00`;
    const result = parseAidLetter(text);
    expect(result.costOfAttendance).toBe(86725);
  });

  it("returns low confidence and no extracted numbers for unrecognized text", () => {
    const text = "Dear Student, congratulations on your admission. We look forward to meeting you in the fall.";
    const result = parseAidLetter(text);
    expect(result.confidence).toBeLessThan(0.3);
    expect(result.costOfAttendance).toBeUndefined();
  });

  it("captures freeform context as notes when no numbers are found", () => {
    const text = "Note: This package includes a $5000 athletic award contingent on continued participation.";
    const result = parseAidLetter(text);
    expect(result.notes).toBeTruthy();
    expect(result.notes).toContain("athletic");
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/aid-offers/parse-letter.ts
// Best-effort paste-text → ParsedLetter. Pre-fills the ingest form; the
// student edits + confirms before submit. Two formats covered:
//   1. "Cost of Attendance: $X" / "Grants: $Y" / "Loans: $Z" / "Work-Study: $W"
//   2. "Total Direct Costs: $X" / "Grant Aid: $Y" / "Self-Help: $Z"
// Anything else gets confidence: 0 and the form opens empty with a
// banner asking the student to fill it in.
import type { ParsedLetter } from "./types";

const NUMBER_RE = /\$\s*([\d,]+(?:\.\d+)?)/;

function pickNumber(line: string): number | undefined {
  const match = line.match(NUMBER_RE);
  if (!match) return undefined;
  const cleaned = match[1].replace(/[\s,]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : undefined;
}

// Find the first line in `text` matching `regex`, return the number on it.
function findLineNumber(text: string, regex: RegExp): number | undefined {
  for (const line of text.split(/\r?\n/)) {
    if (regex.test(line)) {
      const n = pickNumber(line);
      if (n !== undefined) return n;
    }
  }
  return undefined;
}

export function parseAidLetter(text: string): ParsedLetter {
  if (!text || !text.trim()) {
    return { confidence: 0 };
  }
  const result: ParsedLetter = { confidence: 0 };

  // Format 1: explicit labels
  const cost1 = findLineNumber(text, /\bcost\s+of\s+attendance\b/i);
  const grants1 = findLineNumber(text, /\bgrants?\b/i);
  const loans1 = findLineNumber(text, /\bloans?\b/i);
  const workStudy = findLineNumber(text, /\bwork[-\s]?study\b/i);

  // Format 2: Total Direct Costs + Grant Aid
  const cost2 = findLineNumber(text, /\btotal\s+direct\s+cost/i);
  const grants2 = findLineNumber(text, /\bgrant\s+aid\b/i);

  if (cost1 !== undefined) result.costOfAttendance = cost1;
  else if (cost2 !== undefined) result.costOfAttendance = cost2;

  if (grants1 !== undefined) result.grants = grants1;
  else if (grants2 !== undefined) result.grants = grants2;

  if (loans1 !== undefined) result.loans = loans1;
  if (workStudy !== undefined) result.workStudy = workStudy;

  // Confidence scoring: 0.4 per recognized field, capped at 1.
  const fieldsFound =
    (result.costOfAttendance !== undefined ? 1 : 0) +
    (result.grants !== undefined ? 1 : 0) +
    (result.loans !== undefined ? 1 : 0) +
    (result.workStudy !== undefined ? 1 : 0);
  result.confidence = Math.min(1, fieldsFound * 0.3 + 0.1);

  // If we got nothing useful, capture the first non-empty line as notes
  // — gives the student something to verify rather than a blank form.
  if (fieldsFound === 0) {
    const firstNonEmpty = text.split(/\r?\n/).find((l) => l.trim().length > 20);
    if (firstNonEmpty) result.notes = firstNonEmpty.trim().slice(0, 280);
  }

  return result;
}
```

- [ ] **Step 4: Run, expect pass.** Tests green.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/aid-offers/parse-letter.ts src/lib/cc/aid-offers/parse-letter.test.ts
git commit -m "feat(aid-offers): paste-text parser handling Ivy + Harvard letter formats"
```

---

## Task 6 — API: GET (list) + POST (create) at `/api/cc/aid-offers`

**Files:** Modify `src/app/api/cc/aid-offers/route.ts` (currently a stub).

- [ ] **Step 1: Replace the stub with the real route.**

```typescript
// src/app/api/cc/aid-offers/route.ts
// GET   — list the current student's aid offers (joined with school name)
// POST  — create one (paste-text or form input)
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import type { AidOffer, AidOfferIngestInput, Currency } from "@/lib/cc/aid-offers/types";

const VALID_CURRENCIES: ReadonlySet<Currency> = new Set([
  "USD", "CAD", "GBP", "PKR", "INR", "EUR",
]);

interface DBRow {
  id: string;
  student_id: string;
  student_school_id: string;
  cost_of_attendance: string;
  grants: string;
  loans: string;
  work_study: string;
  net_cost: string;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  cc_student_schools: {
    cc_schools: { name: string } | null;
  } | null;
}

function rowToOffer(row: DBRow): AidOffer {
  return {
    id: row.id,
    studentId: row.student_id,
    studentSchoolId: row.student_school_id,
    schoolName: row.cc_student_schools?.cc_schools?.name ?? "Unknown school",
    costOfAttendance: parseFloat(row.cost_of_attendance),
    grants: parseFloat(row.grants),
    loans: parseFloat(row.loans),
    workStudy: parseFloat(row.work_study),
    netCost: parseFloat(row.net_cost),
    currency: row.currency as Currency,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ offers: [] });

  const { data, error } = await db
    .from("cc_aid_offers")
    .select(
      "id, student_id, student_school_id, cost_of_attendance, grants, loans, work_study, net_cost, currency, notes, created_at, updated_at, cc_student_schools(cc_schools(name))",
    )
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[aid-offers GET] failed:", error);
    return NextResponse.json({ error: "Failed to load offers" }, { status: 500 });
  }
  const offers = ((data as unknown as DBRow[]) ?? []).map(rowToOffer);
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();

  const body = (await req.json().catch(() => ({}))) as Partial<AidOfferIngestInput> & { sourcePaste?: string };
  if (!body.studentSchoolId || typeof body.costOfAttendance !== "number") {
    return NextResponse.json({ error: "studentSchoolId and costOfAttendance are required" }, { status: 400 });
  }
  const currency: Currency =
    body.currency && VALID_CURRENCIES.has(body.currency) ? body.currency : "USD";

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Verify the student owns the target student_school row.
  const { data: schoolRow } = await db
    .from("cc_student_schools")
    .select("id")
    .eq("id", body.studentSchoolId)
    .eq("student_id", profile.id)
    .maybeSingle();
  if (!schoolRow) {
    return NextResponse.json({ error: "school not in your list" }, { status: 403 });
  }

  const { data, error } = await db
    .from("cc_aid_offers")
    .upsert(
      {
        student_id: profile.id,
        student_school_id: body.studentSchoolId,
        cost_of_attendance: body.costOfAttendance,
        grants: body.grants ?? 0,
        loans: body.loans ?? 0,
        work_study: body.workStudy ?? 0,
        currency,
        notes: body.notes ?? null,
        source_paste: body.sourcePaste ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_school_id" },
    )
    .select(
      "id, student_id, student_school_id, cost_of_attendance, grants, loans, work_study, net_cost, currency, notes, created_at, updated_at, cc_student_schools(cc_schools(name))",
    )
    .maybeSingle<DBRow>();

  if (error || !data) {
    console.error("[aid-offers POST] failed:", error);
    return NextResponse.json({ error: "Failed to save offer" }, { status: 500 });
  }
  return NextResponse.json({ offer: rowToOffer(data) }, { status: 201 });
}
```

- [ ] **Step 2: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.

- [ ] **Step 3: Commit.**
```bash
git add src/app/api/cc/aid-offers/route.ts
git commit -m "feat(aid-offers): GET (list) + POST (create/upsert) at /api/cc/aid-offers"
```

---

## Task 7 — API: PATCH + DELETE at `/api/cc/aid-offers/[id]`

**Files:** Create `src/app/api/cc/aid-offers/[id]/route.ts`.

- [ ] **Step 1: Write the route.**

```typescript
// src/app/api/cc/aid-offers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import type { AidOfferPatch, Currency } from "@/lib/cc/aid-offers/types";

const VALID_CURRENCIES: ReadonlySet<Currency> = new Set([
  "USD", "CAD", "GBP", "PKR", "INR", "EUR",
]);

async function getOwnedOfferId(req: NextRequest, id: string) {
  const auth = await requireAuth();
  if (!auth) return null;
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return null;
  const { data: row } = await db
    .from("cc_aid_offers")
    .select("id")
    .eq("id", id)
    .eq("student_id", profile.id)
    .maybeSingle<{ id: string }>();
  return row ? { db, ownedId: row.id } : null;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const owned = await getOwnedOfferId(req, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as AidOfferPatch;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.costOfAttendance === "number") update.cost_of_attendance = body.costOfAttendance;
  if (typeof body.grants === "number") update.grants = body.grants;
  if (typeof body.loans === "number") update.loans = body.loans;
  if (typeof body.workStudy === "number") update.work_study = body.workStudy;
  if (body.currency && VALID_CURRENCIES.has(body.currency)) update.currency = body.currency;
  if (typeof body.notes === "string") update.notes = body.notes;

  const { error } = await owned.db.from("cc_aid_offers").update(update).eq("id", owned.ownedId);
  if (error) {
    console.error("[aid-offers PATCH] failed:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const owned = await getOwnedOfferId(req, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await owned.db.from("cc_aid_offers").delete().eq("id", owned.ownedId);
  if (error) {
    console.error("[aid-offers DELETE] failed:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Type-check + commit.**

```bash
npx tsc --noEmit
git add src/app/api/cc/aid-offers/[id]/route.ts
git commit -m "feat(aid-offers): PATCH + DELETE at /api/cc/aid-offers/[id]"
```

---

## Task 8 — API: GET `/api/cc/aid-offers/compare` (replace stub)

**Files:** Modify `src/app/api/cc/aid-offers/compare/route.ts`.

- [ ] **Step 1: Replace the stub.**

```typescript
// src/app/api/cc/aid-offers/compare/route.ts
// Returns a sorted ComparisonRow[] with USD + PKR + 4-year projection
// for the current student's aid offers.
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import type { AidOffer, ComparisonRow, Currency } from "@/lib/cc/aid-offers/types";
import { PKR_PER_USD } from "@/lib/cc/aid-offers/format-pkr";
import { fourYearTotalUsd } from "@/lib/cc/aid-offers/four-year-projection";

// Approx FX to USD. Pinned alongside PKR for the same reasons (live FX
// is fragile + the comparison is "rough"; verify with bank).
const TO_USD: Record<Currency, number> = {
  USD: 1,
  CAD: 0.74,
  GBP: 1.27,
  EUR: 1.08,
  PKR: 1 / 280,
  INR: 1 / 83,
};

function rowToComparison(o: AidOffer, rank: number): ComparisonRow {
  const fx = TO_USD[o.currency] ?? 1;
  const outOfPocketUsd = Math.round(o.netCost * fx);
  return {
    id: o.id,
    schoolName: o.schoolName,
    costOfAttendance: o.costOfAttendance,
    grants: o.grants,
    loans: o.loans,
    workStudy: o.workStudy,
    netCost: o.netCost,
    currency: o.currency,
    outOfPocketUsd,
    outOfPocketPkr: Math.round((outOfPocketUsd * PKR_PER_USD) / 1000) * 1000,
    fourYearTotalUsd: fourYearTotalUsd({
      costOfAttendance: o.costOfAttendance * fx,
      grants: o.grants * fx,
    }),
    rank,
  };
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ comparison: [] });

  const { data, error } = await db
    .from("cc_aid_offers")
    .select(
      "id, student_id, student_school_id, cost_of_attendance, grants, loans, work_study, net_cost, currency, notes, created_at, updated_at, cc_student_schools(cc_schools(name))",
    )
    .eq("student_id", profile.id);
  if (error) {
    console.error("[aid-offers compare GET] failed:", error);
    return NextResponse.json({ comparison: [] }, { status: 500 });
  }

  const offers = ((data as unknown as Array<{
    id: string; student_id: string; student_school_id: string;
    cost_of_attendance: string; grants: string; loans: string; work_study: string;
    net_cost: string; currency: string; notes: string | null;
    created_at: string; updated_at: string;
    cc_student_schools: { cc_schools: { name: string } | null } | null;
  }>) ?? []).map<AidOffer>((row) => ({
    id: row.id,
    studentId: row.student_id,
    studentSchoolId: row.student_school_id,
    schoolName: row.cc_student_schools?.cc_schools?.name ?? "Unknown school",
    costOfAttendance: parseFloat(row.cost_of_attendance),
    grants: parseFloat(row.grants),
    loans: parseFloat(row.loans),
    workStudy: parseFloat(row.work_study),
    netCost: parseFloat(row.net_cost),
    currency: row.currency as Currency,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  // Sort by USD out-of-pocket ascending so the cheapest is rank 1.
  const sorted = [...offers].sort(
    (a, b) => a.netCost * (TO_USD[a.currency] ?? 1) - b.netCost * (TO_USD[b.currency] ?? 1),
  );
  const comparison = sorted.map((o, i) => rowToComparison(o, i + 1));
  return NextResponse.json({ comparison });
}
```

- [ ] **Step 2: Type-check + commit.**

```bash
npx tsc --noEmit
git add src/app/api/cc/aid-offers/compare/route.ts
git commit -m "feat(aid-offers): GET /api/cc/aid-offers/compare returns sorted USD/PKR/4-year rows"
```

---

## Task 9 — `AidOfferIngestForm.tsx`

**Files:** Create `src/app/cc/aid-offers/AidOfferIngestForm.tsx`.

- [ ] **Step 1: Implement the form.**

```typescript
// src/app/cc/aid-offers/AidOfferIngestForm.tsx
"use client";
import { useState } from "react";
import { ClipboardPaste, AlertTriangle } from "lucide-react";
import { parseAidLetter } from "@/lib/cc/aid-offers/parse-letter";
import type { Currency } from "@/lib/cc/aid-offers/types";

interface SchoolOption {
  studentSchoolId: string;
  name: string;
}

interface Props {
  schools: SchoolOption[];
  onSaved: () => void;
}

export default function AidOfferIngestForm({ schools, onSaved }: Props) {
  const [studentSchoolId, setStudentSchoolId] = useState(schools[0]?.studentSchoolId ?? "");
  const [costOfAttendance, setCost] = useState<string>("");
  const [grants, setGrants] = useState<string>("0");
  const [loans, setLoans] = useState<string>("0");
  const [workStudy, setWorkStudy] = useState<string>("0");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [notes, setNotes] = useState<string>("");
  const [paste, setPaste] = useState<string>("");
  const [parsing, setParsing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleParse() {
    if (!paste.trim()) return;
    setParsing(true);
    const result = parseAidLetter(paste);
    if (result.costOfAttendance !== undefined) setCost(String(result.costOfAttendance));
    if (result.grants !== undefined) setGrants(String(result.grants));
    if (result.loans !== undefined) setLoans(String(result.loans));
    if (result.workStudy !== undefined) setWorkStudy(String(result.workStudy));
    if (result.notes) setNotes(result.notes);
    setConfidence(result.confidence);
    setParsing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/cc/aid-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentSchoolId,
          costOfAttendance: parseFloat(costOfAttendance) || 0,
          grants: parseFloat(grants) || 0,
          loans: parseFloat(loans) || 0,
          workStudy: parseFloat(workStudy) || 0,
          currency,
          notes: notes || undefined,
          sourcePaste: paste || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save");
      }
      onSaved();
      setCost("");
      setGrants("0");
      setLoans("0");
      setWorkStudy("0");
      setNotes("");
      setPaste("");
      setConfidence(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-5 space-y-4"
      style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(20,20,20,.6)" }}
    >
      <div>
        <label className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-1 block">
          School
        </label>
        <select
          value={studentSchoolId}
          onChange={(e) => setStudentSchoolId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          required
        >
          {schools.map((s) => (
            <option key={s.studentSchoolId} value={s.studentSchoolId}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <details className="rounded-lg border border-white/10 p-3">
        <summary className="text-[12px] text-white/70 cursor-pointer flex items-center gap-2">
          <ClipboardPaste className="w-3.5 h-3.5" />
          Paste your letter (optional)
        </summary>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="Paste the financial aid award letter text here. We'll pre-fill the form below — you verify and confirm."
          rows={6}
          className="mt-3 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30"
        />
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={handleParse}
            disabled={parsing || !paste.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-50"
          >
            {parsing ? "Parsing…" : "Parse"}
          </button>
          {confidence !== null && confidence < 0.5 && (
            <span className="text-[11px] text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              Couldn&apos;t parse cleanly — please verify manually
            </span>
          )}
        </div>
      </details>

      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Cost of attendance" value={costOfAttendance} onChange={setCost} required />
        <NumberField label="Grants (free aid)" value={grants} onChange={setGrants} />
        <NumberField label="Loans" value={loans} onChange={setLoans} />
        <NumberField label="Work-study" value={workStudy} onChange={setWorkStudy} />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-1 block">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="PKR">PKR</option>
          <option value="INR">INR</option>
        </select>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-1 block">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          placeholder="Merit award, athletic considerations, conditional clauses…"
        />
      </div>

      {error && <p className="text-rose-300 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={saving || !costOfAttendance}
        className="w-full px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save offer"}
      </button>
    </form>
  );
}

function NumberField({
  label, value, onChange, required,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-1 block">
        {label}{required ? " *" : ""}
      </label>
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm tabular-nums"
      />
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/app/cc/aid-offers/AidOfferIngestForm.tsx
git commit -m "feat(aid-offers): paste-or-form ingest UI"
```

---

## Task 10 — `AidOfferComparator.tsx` + `AidOfferRow.tsx`

**Files:** Create `src/app/cc/aid-offers/AidOfferComparator.tsx` + `AidOfferRow.tsx`.

- [ ] **Step 1: `AidOfferRow.tsx`.**

```typescript
// src/app/cc/aid-offers/AidOfferRow.tsx
"use client";
import { Trash2 } from "lucide-react";
import type { ComparisonRow } from "@/lib/cc/aid-offers/types";
import { formatPkrNarrative } from "@/lib/cc/aid-offers/format-pkr";

export default function AidOfferRow({
  row, isPK, onDelete,
}: {
  row: ComparisonRow;
  isPK: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b border-white/5">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {row.rank === 1 && (
            <span className="text-[9.5px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Best
            </span>
          )}
          <span className="font-semibold text-white text-sm">{row.schoolName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-white/85 text-sm">
        ${row.costOfAttendance.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-emerald-300 text-sm">
        −${row.grants.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-white text-sm font-semibold">
        ${row.netCost.toLocaleString()}
        {row.currency !== "USD" && (
          <span className="text-[10px] text-white/40 ml-1">{row.currency}</span>
        )}
      </td>
      {isPK && (
        <td className="px-4 py-3 text-right tabular-nums text-white/70 text-sm">
          {formatPkrNarrative(row.outOfPocketPkr)}
        </td>
      )}
      <td className="px-4 py-3 text-right tabular-nums text-white/70 text-sm">
        ${row.fourYearTotalUsd.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          aria-label={`Delete ${row.schoolName} offer`}
          className="text-white/40 hover:text-rose-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
```

- [ ] **Step 2: `AidOfferComparator.tsx`.**

```typescript
// src/app/cc/aid-offers/AidOfferComparator.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import AidOfferRow from "./AidOfferRow";
import type { ComparisonRow } from "@/lib/cc/aid-offers/types";

export default function AidOfferComparator({
  isPK, refreshKey,
}: {
  isPK: boolean;
  refreshKey: number;  // bumped by parent after a successful ingest
}) {
  const [rows, setRows] = useState<ComparisonRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/cc/aid-offers/compare")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: { comparison: ComparisonRow[] }) => setRows(d.comparison))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelete(id: string) {
    const previous = rows ?? [];
    setRows((cur) => cur?.filter((r) => r.id !== id) ?? null);
    const res = await fetch(`/api/cc/aid-offers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // Revert on failure.
      setRows(previous);
      setError("Failed to delete offer");
    }
  }

  if (error) {
    return <p className="text-rose-300 text-sm">{error}</p>;
  }
  if (rows === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141414]/60 p-8 text-center">
        <p className="text-sm text-white/65">
          No offers added yet. Paste your first aid letter above to compare.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,.08)" }}
    >
      <table className="w-full text-left">
        <thead>
          <tr style={{ background: "rgba(255,255,255,.03)" }}>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-white/55">School</th>
            <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55">Cost</th>
            <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55">Grants</th>
            <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55">Out of pocket</th>
            {isPK && (
              <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55">In PKR</th>
            )}
            <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55">4-yr total</th>
            <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/55"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <AidOfferRow key={row.id} row={row} isPK={isPK} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/app/cc/aid-offers/AidOfferComparator.tsx src/app/cc/aid-offers/AidOfferRow.tsx
git commit -m "feat(aid-offers): comparator table + row component with rank badge + delete"
```

---

## Task 11 — Page assembly: `/cc/aid-offers`

**Files:** Create `src/app/cc/aid-offers/page.tsx` + `AidOffersClient.tsx`.

- [ ] **Step 1: Server-component shell.**

```typescript
// src/app/cc/aid-offers/page.tsx
// Auth + onboarding gate (mirrors src/app/cc/dashboard/page.tsx pattern),
// then renders the client orchestrator.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AidOffersClient from "./AidOffersClient";

export const dynamic = "force-dynamic";

export default async function AidOffersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cc/aid-offers");

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, country, language_picker_seen_at")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; country: string | null; language_picker_seen_at: string | null }>();
  if (!profile || profile.language_picker_seen_at == null) redirect("/onboarding");

  // Pull the student's school list so the ingest form can pick from it.
  const { data: schoolRows } = await supabase
    .from("cc_student_schools")
    .select("id, cc_schools(name)")
    .eq("student_id", profile.id);

  const schools = ((schoolRows ?? []) as Array<{
    id: string; cc_schools: { name: string } | null;
  }>).map((s) => ({
    studentSchoolId: s.id,
    name: s.cc_schools?.name ?? "Unknown school",
  })).filter((s) => s.name !== "Unknown school");

  return <AidOffersClient schools={schools} isPK={profile.country === "PK"} />;
}
```

- [ ] **Step 2: Client orchestrator.**

```typescript
// src/app/cc/aid-offers/AidOffersClient.tsx
"use client";
import { useState } from "react";
import { Wallet } from "lucide-react";
import AidOfferIngestForm from "./AidOfferIngestForm";
import AidOfferComparator from "./AidOfferComparator";

interface SchoolOption {
  studentSchoolId: string;
  name: string;
}

export default function AidOffersClient({
  schools, isPK,
}: { schools: SchoolOption[]; isPK: boolean }) {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0e16", color: "#f2ede3" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-20 space-y-8">
        <header>
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#D4AF37]">
              Aid offer comparator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Compare your offers side by side.
          </h1>
          <p className="text-sm text-white/55">
            Paste each financial aid letter, edit if needed, save. We&apos;ll show out-of-pocket cost{isPK ? " in USD and PKR" : ""}, the cheapest pick, and the 4-year projection.
          </p>
        </header>

        {schools.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#141414]/60 p-8 text-center">
            <p className="text-sm text-white/65">
              Add schools to your list first — then come back to enter their aid offers.
            </p>
          </div>
        ) : (
          <>
            <AidOfferIngestForm
              schools={schools}
              onSaved={() => setRefreshKey((k) => k + 1)}
            />
            <AidOfferComparator isPK={isPK} refreshKey={refreshKey} />
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/app/cc/aid-offers/page.tsx src/app/cc/aid-offers/AidOffersClient.tsx
git commit -m "feat(aid-offers): /cc/aid-offers page (auth gate + ingest + comparator)"
```

---

## Task 12 — `decisions` coach mode

**Files:** Modify `src/lib/cc/coach-prompt-builder.ts`.

- [ ] **Step 1: Add an `aidOffers` slot to `CoachContext`.** Find the `CoachContext` type at the top of the file (around line 30-100) and add:

```typescript
// new field on CoachContext type:
aidOffers?: Array<{
  schoolName: string;
  costOfAttendance: number;
  grants: number;
  loans: number;
  workStudy: number;
  netCost: number;
  currency: string;
  notes: string | null;
}>;
```

- [ ] **Step 2: Add a `case "decisions":` to `getModeInstructions(ctx)`.** Add after the existing `case "interview":` block (around line 563-580):

```typescript
case "decisions": {
  const offerLines = (ctx.aidOffers ?? [])
    .map((o) => {
      const cur = o.currency === "USD" ? "$" : `${o.currency} `;
      return `- ${o.schoolName}: COA ${cur}${o.costOfAttendance.toLocaleString()}, grants ${cur}${o.grants.toLocaleString()}, net ${cur}${o.netCost.toLocaleString()}${o.notes ? ` — ${o.notes}` : ""}`;
    })
    .join("\n");
  const offersBlock = ctx.aidOffers && ctx.aidOffers.length > 0
    ? `\n\nThe student has entered these aid offers:\n${offerLines}\n\nReference offers BY SCHOOL NAME with actual numbers from the data. Identify the SINGLE most-leverageable negotiation target — the school where a competing offer is materially better and the student is most likely to enroll.`
    : "\n\nThe student has not yet entered aid offers. Suggest they start by pasting one letter at /cc/aid-offers — once two are in place, you can compare and recommend a negotiation target.";

  return `MODE: DECISIONS

The student is in the decisions phase (admits in hand, May 1 deposit approaching). They need to: (1) compare aid offers in real currency, (2) decide whether to negotiate, and if so with which school, (3) draft a negotiation letter that references real numbers, (4) decide where to deposit.

Do NOT pivot to general advice when the question is about offers. Stay grounded in the offers data.${offersBlock}

When asked to draft a negotiation letter, follow this structure exactly:
1. Address the financial aid office (NOT admissions). Open with gratitude for the admission.
2. State the financial gap concretely: "$X out-of-pocket vs $Y at [Competing School]".
3. Cite the competing offer by school name and amount.
4. Make a SINGLE polite ask: match the gap, OR specify a smaller specific amount that closes the family's affordability threshold.
5. Provide context if relevant (change of family circumstance, additional siblings in college, etc.).
6. Polite close: "I would be grateful for any reconsideration; I remain very excited about [school]."

Never claim to "send" the letter — you draft, the student sends. If the student hasn't entered enough offers (<2), say so and direct them to /cc/aid-offers first.`;
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.ts
git commit -m "feat(coach): decisions mode with aidOffers context + negotiation letter structure"
```

---

## Task 13 — Coach mode detector + API plumbing

**Files:**
- Modify `src/lib/cc/coach-mode-detector.ts`
- Modify `src/app/api/cc/coach/message/route.ts`

- [ ] **Step 1: Find `detectMode` in `coach-mode-detector.ts`** and add a branch that returns `"decisions"` when:
  - `pageContext === "/cc/aid-offers"`, OR
  - `variantKey === "senior_decisions"` AND the user's message mentions money / negotiate / offer / aid / scholarship terms

```typescript
// near the top of detectMode (or wherever variant routing happens):
if (pageContext === "/cc/aid-offers") return "decisions";
if (variantKey === "senior_decisions") {
  const moneyTerms = /\b(aid|offer|negotiat|appeal|grant|scholarship|cost|net price|out-of-pocket|deposit|loan|work-study|tuition|afford)/i;
  if (moneyTerms.test(message)) return "decisions";
}
```

(Adapt to the function's actual signature — the file may use a different argument shape.)

- [ ] **Step 2: In `src/app/api/cc/coach/message/route.ts`, fetch aid offers when mode is `decisions`** and pass them into `coachContext`:

```typescript
// inside the route handler, AFTER the existing profile + variant lookup:
let aidOffers: CoachContext["aidOffers"] | undefined;
if (mode === "decisions") {
  const { data: offerRows } = await db
    .from("cc_aid_offers")
    .select(
      "cost_of_attendance, grants, loans, work_study, net_cost, currency, notes, cc_student_schools(cc_schools(name))",
    )
    .eq("student_id", profile.id);
  aidOffers = ((offerRows ?? []) as Array<{
    cost_of_attendance: string; grants: string; loans: string; work_study: string;
    net_cost: string; currency: string; notes: string | null;
    cc_student_schools: { cc_schools: { name: string } | null } | null;
  }>).map((r) => ({
    schoolName: r.cc_student_schools?.cc_schools?.name ?? "Unknown school",
    costOfAttendance: parseFloat(r.cost_of_attendance),
    grants: parseFloat(r.grants),
    loans: parseFloat(r.loans),
    workStudy: parseFloat(r.work_study),
    netCost: parseFloat(r.net_cost),
    currency: r.currency,
    notes: r.notes,
  }));
}

// then add aidOffers to the coachContext object:
const coachContext: CoachContext = {
  // ...existing fields...
  aidOffers,
};
```

- [ ] **Step 3: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/lib/cc/coach-mode-detector.ts src/app/api/cc/coach/message/route.ts
git commit -m "feat(coach): route to decisions mode + fetch aidOffers for that mode"
```

---

## Task 14 — Wire dashboard priority cards to `/cc/aid-offers`

**Files:**
- Modify `src/app/cc/dashboard/variants.ts`
- Modify `src/components/cc/dashboard/sections/PriorityWidgetRow.tsx`

- [ ] **Step 1: In `variants.ts`, find `senior_decisions` priority cards.** The "Aid comparator" card currently has `href: "/applications"`. Change to `href: "/cc/aid-offers"`. Verify with:
```bash
grep -n "Aid comparator\|aidComparator\|aid-offers" src/app/cc/dashboard/variants.ts
```

- [ ] **Step 2: In `PriorityWidgetRow.tsx`, find `WIDGET_CONFIG.aidComparator`.** Change `href: "/applications"` → `href: "/cc/aid-offers"`.

- [ ] **Step 3: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/app/cc/dashboard/variants.ts src/components/cc/dashboard/sections/PriorityWidgetRow.tsx
git commit -m "fix(dashboard): senior_decisions Aid comparator card targets /cc/aid-offers"
```

---

## Task 15 — Final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.
- [ ] **Step 2: Tests.** `npx vitest run`. All green; +14 new tests from Tasks 3, 4, 5.
- [ ] **Step 3: Apply migration to local Supabase.** `npx supabase db push`. Verify table exists.
- [ ] **Step 4: Manual smoke test in dev** (`npm run dev`):
  1. Log in as a senior_decisions test user with ≥2 schools added.
  2. Navigate to `/cc/dashboard?dashboard=v2` — verify the "Aid comparator" priority card now links to `/cc/aid-offers`.
  3. Click through. Paste a sample aid letter:
     ```
     Cost of Attendance: $86,725
     Grants: $62,400
     Loans: $5,500
     Work-Study: $2,500
     ```
  4. Click Parse — fields should pre-fill. Click Save.
  5. Add a second offer (manually, no paste). Verify the comparator table shows both rows sorted by netCost ascending; the cheapest gets the "Best" badge.
  6. If the test user has `country = "PK"`, verify the PKR column appears.
  7. Open the coach drawer, type "Should I negotiate with [more expensive school]?" — verify the response references the actual numbers from both offers and follows the 6-step negotiation structure.
- [ ] **Step 5: Push.**
```bash
git push origin master
```
- [ ] **Step 6: Apply migration to prod** via Supabase Studio SQL editor.

---

## Self-review

**Spec coverage:**
- Audit Prompt 1 Row 4 — `senior_decisions` aid-letter parser → Tasks 5-11
- Audit Prompt 3 #1 — aid offer comparator → Tasks 1-11
- Audit Prompt 4 Gap 2 — comparator + `decisions` mode → Tasks 12-13
- Audit Prompt 6 #6 — aid offer comparison build → all tasks
- Roadmap row B scope items: ✓ aid_offers table (T1), ✓ paste-or-upload UI (T9), ✓ side-by-side comparator with USD↔PKR (T8 + T10), ✓ 4-year projection (T4 + T8), ✓ decisions mode in coach-prompt-builder (T12), ✓ senior_decisions priority card retargeted (T14)

**Placeholder scan:** No TBD/TODO. Each task has executable code or concrete edit instructions with file:line refs. Task 12's CoachContext field-add and Task 13's mode detection are the only places that require minor adaptation to actual code shape — both flagged with "Adapt to the function's actual signature."

**Type consistency:** `AidOffer`, `AidOfferIngestInput`, `AidOfferPatch`, `ComparisonRow`, `Currency`, `ParsedLetter` defined in T2; flow through T6, T7, T8 (API), T9, T10 (UI), T13 (coach API). `PKR_PER_USD` defined in T3, used in T8.

**Risk:** Heaviest task is T13 (mode detector + API plumbing) — depends on `coach-mode-detector.ts`'s actual signature which I haven't pinned. Implementer should read that file end-to-end before editing.

**Effort:** ~2 weeks for one engineer. Tasks 1-5 (schema + helpers + parser) ~3 days. Tasks 6-8 (API) ~2 days. Tasks 9-11 (UI) ~3 days. Tasks 12-14 (coach + wiring) ~2 days. Buffer for native-letter testing and edge cases ~2 days.

---

## Execution

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-aid-offer-comparator.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review. Best fit for this plan's 15 tasks because the API + UI tasks are mechanical lifts and the coach-mode integration (T12-T13) benefits from focused isolated context.

**2. Inline Execution** — execute in this session, batched with checkpoints.
