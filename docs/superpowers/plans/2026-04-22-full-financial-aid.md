# $0 / Full Financial Aid Affordability Option — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students pick `$0` as affordability, persist `needs_full_aid`, and adapt school recommendations + Coach Kairos behavior to surface need-blind international schools and CSS Profile guidance.

**Architecture:** Three new columns (`cc_student_profiles.affordability_value`, `cc_student_profiles.needs_full_aid` generated, `cc_schools.need_blind_international`) + a single source-of-truth constants module (`src/lib/cc/affordability.ts`) that defines options, types, and mappers. FinancialForm gets a new top-of-form pill selector. Coach Kairos prompts branch on `needsFullAid`. School list + chancing routes filter + warn on need-aware schools.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 strict, Tailwind 4, Supabase (Postgres), Vitest. Coach uses OpenRouter + Claude Sonnet 4.6 (unchanged by this work).

**Spec:** `docs/superpowers/specs/2026-04-22-full-financial-aid-design.md`

---

## File Structure

### New files
- `supabase/migrations/20260423_affordability.sql` — schema + seed
- `src/lib/cc/affordability.ts` — `AFFORDABILITY_OPTIONS`, `AffordabilityValue`, `financialNeedFromAffordability()`, `NEED_BLIND_INTERNATIONAL_IPEDS`
- `src/lib/cc/__tests__/affordability.test.ts` — unit tests for the above
- `src/components/cc/profile/CSSProfileCallout.tsx` — callout card for zero-affordability international students
- `src/app/profile/css-guide/page.tsx` — stub page (Section 8 fills body later)

### Modified files
- `src/components/cc/profile/FinancialForm.tsx` — new affordability selector + callout
- `src/components/cc/profile/ProfileWizard.tsx` — pass `isInternational` through to FinancialForm
- `src/app/profile/page.tsx` — pass `isInternational` through to FinancialForm
- `src/app/api/cc/profile/identity/route.ts` — add `affordability_value` to allowed fields + derive `financial_need`
- `src/app/api/cc/profile/route.ts` — no change (already `select("*")`)
- `src/lib/cc/coach-prompt-builder.ts` — add `affordabilityValue`, `needsFullAid` to CoachContext; new branch in school-builder and general modes
- `src/lib/cc/__tests__/coach-prompt-builder.test.ts` — new tests for the branches
- `src/lib/cc/coach-extract.ts` — extract affordability from conversation, write to two tables
- `src/app/api/cc/coach/message/route.ts` — select + pass `affordability_value`, `needs_full_aid`
- `src/app/api/cc/school-list/generate/route.ts` — filter + prompt rules + `aid_warning` on suggestion
- `src/app/api/cc/chances/[school_id]/route.ts` — need-blind + affordability in prompt
- `src/components/cc/SchoolCard.tsx` — optional `aidWarning` prop + amber pill

---

## Task 1: Database migration

**Files:**
- Create: `supabase/migrations/20260423_affordability.sql`

- [ ] **Step 1: Write migration SQL**

```sql
-- supabase/migrations/20260423_affordability.sql
-- Section 2: $0/full financial aid affordability option

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS affordability_value TEXT DEFAULT 'under_10k'
    CHECK (affordability_value IN ('zero','under_10k','10k_20k','20k_30k','30k_50k','50k_plus')),
  ADD COLUMN IF NOT EXISTS needs_full_aid BOOLEAN GENERATED ALWAYS AS
    (affordability_value = 'zero') STORED;

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS need_blind_international BOOLEAN DEFAULT FALSE;

UPDATE cc_schools SET need_blind_international = TRUE
  WHERE ipeds_id IN (
    166027, -- Harvard
    166683, -- MIT
    130794, -- Yale
    186131, -- Princeton
    182670, -- Dartmouth
    164465, -- Amherst
    168342, -- Williams
    160977  -- Bowdoin
  );
```

- [ ] **Step 2: Commit the migration**

```bash
git add supabase/migrations/20260423_affordability.sql
git commit -m "feat(db): add affordability_value, needs_full_aid, need_blind_international columns"
```

---

## Task 2: Constants module — failing tests first

**Files:**
- Create: `src/lib/cc/__tests__/affordability.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/cc/__tests__/affordability.test.ts
import { describe, it, expect } from "vitest";
import {
  AFFORDABILITY_OPTIONS,
  financialNeedFromAffordability,
  NEED_BLIND_INTERNATIONAL_IPEDS,
} from "../affordability";

describe("AFFORDABILITY_OPTIONS", () => {
  it("places $0 first so it surfaces prominently", () => {
    expect(AFFORDABILITY_OPTIONS[0].value).toBe("zero");
    expect(AFFORDABILITY_OPTIONS[0].label).toContain("$0");
  });

  it("has exactly 6 options", () => {
    expect(AFFORDABILITY_OPTIONS).toHaveLength(6);
  });

  it("has monotonically increasing maxAnnual values", () => {
    for (let i = 1; i < AFFORDABILITY_OPTIONS.length; i++) {
      expect(AFFORDABILITY_OPTIONS[i].maxAnnual).toBeGreaterThan(AFFORDABILITY_OPTIONS[i - 1].maxAnnual);
    }
  });
});

describe("financialNeedFromAffordability", () => {
  it("maps zero and under_10k to essential", () => {
    expect(financialNeedFromAffordability("zero")).toBe("essential");
    expect(financialNeedFromAffordability("under_10k")).toBe("essential");
  });

  it("maps 10k_20k and 20k_30k to important", () => {
    expect(financialNeedFromAffordability("10k_20k")).toBe("important");
    expect(financialNeedFromAffordability("20k_30k")).toBe("important");
  });

  it("maps 30k_50k to nice-to-have", () => {
    expect(financialNeedFromAffordability("30k_50k")).toBe("nice-to-have");
  });

  it("maps 50k_plus to not-a-concern", () => {
    expect(financialNeedFromAffordability("50k_plus")).toBe("not-a-concern");
  });
});

describe("NEED_BLIND_INTERNATIONAL_IPEDS", () => {
  it("contains exactly the 8 spec-named schools", () => {
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.size).toBe(8);
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(166027)).toBe(true); // Harvard
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(166683)).toBe(true); // MIT
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(130794)).toBe(true); // Yale
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(186131)).toBe(true); // Princeton
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(182670)).toBe(true); // Dartmouth
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(164465)).toBe(true); // Amherst
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(168342)).toBe(true); // Williams
    expect(NEED_BLIND_INTERNATIONAL_IPEDS.has(160977)).toBe(true); // Bowdoin
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

Run: `npx vitest run src/lib/cc/__tests__/affordability.test.ts`
Expected: FAIL with "Cannot find module '../affordability'".

- [ ] **Step 3: Implement the module**

```ts
// src/lib/cc/affordability.ts

export const AFFORDABILITY_OPTIONS = [
  {
    value: "zero",
    label: "$0 — I need full financial aid",
    sublabel: "I cannot pay anything. I need schools that meet 100% of demonstrated need.",
    maxAnnual: 0,
  },
  {
    value: "under_10k",
    label: "Under $10,000/year",
    sublabel: "My family can contribute a small amount annually",
    maxAnnual: 10000,
  },
  {
    value: "10k_20k",
    label: "$10,000–$20,000/year",
    maxAnnual: 20000,
  },
  {
    value: "20k_30k",
    label: "$20,000–$30,000/year",
    maxAnnual: 30000,
  },
  {
    value: "30k_50k",
    label: "$30,000–$50,000/year",
    maxAnnual: 50000,
  },
  {
    value: "50k_plus",
    label: "$50,000+/year",
    sublabel: "Cost is not my primary concern",
    maxAnnual: 999999,
  },
] as const;

export type AffordabilityValue = typeof AFFORDABILITY_OPTIONS[number]["value"];
export type FinancialNeedDerived = "essential" | "important" | "nice-to-have" | "not-a-concern";

export function financialNeedFromAffordability(v: AffordabilityValue): FinancialNeedDerived {
  if (v === "zero" || v === "under_10k") return "essential";
  if (v === "10k_20k" || v === "20k_30k") return "important";
  if (v === "30k_50k") return "nice-to-have";
  return "not-a-concern";
}

export const NEED_BLIND_INTERNATIONAL_IPEDS: ReadonlySet<number> = new Set([
  166027, // Harvard
  166683, // MIT
  130794, // Yale
  186131, // Princeton
  182670, // Dartmouth
  164465, // Amherst
  168342, // Williams
  160977, // Bowdoin
]);
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run src/lib/cc/__tests__/affordability.test.ts`
Expected: PASS 9 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/affordability.ts src/lib/cc/__tests__/affordability.test.ts
git commit -m "feat(cc): add affordability constants + financial_need mapper"
```

---

## Task 3: Profile identity PATCH accepts affordability_value

**Files:**
- Modify: `src/app/api/cc/profile/identity/route.ts`

- [ ] **Step 1: Replace the route file entirely**

```ts
// src/app/api/cc/profile/identity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { financialNeedFromAffordability, type AffordabilityValue } from "@/lib/cc/affordability";

const ALLOWED_FIELDS = [
  "legal_first_name", "preferred_name", "grade_level", "graduation_year",
  "high_school_name", "high_school_ceeb_code", "state_province", "country",
  "home_language", "is_first_gen", "is_international", "citizenship_status",
  "race_ethnicity", "gender",
  "affordability_value",
];

const VALID_AFFORDABILITY: ReadonlySet<string> = new Set([
  "zero", "under_10k", "10k_20k", "20k_30k", "30k_50k", "50k_plus",
]);

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  if ("affordability_value" in body && body.affordability_value != null && !VALID_AFFORDABILITY.has(body.affordability_value)) {
    return NextResponse.json({ error: "invalid affordability_value" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("cc_student_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if ("affordability_value" in body && body.affordability_value) {
    const derived = financialNeedFromAffordability(body.affordability_value as AffordabilityValue);
    const admin = createAdminSupabase();
    await admin
      .from("cc_school_preferences")
      .upsert(
        { student_id: data.id, financial_need: derived, updated_at: new Date().toISOString() },
        { onConflict: "student_id" },
      );
  }

  return NextResponse.json({ updated: true, id: data.id });
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors in this file.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/profile/identity/route.ts
git commit -m "feat(api): profile identity PATCH accepts affordability_value, derives financial_need"
```

---

## Task 4: CSS Profile callout component + stub guide page

**Files:**
- Create: `src/components/cc/profile/CSSProfileCallout.tsx`
- Create: `src/app/profile/css-guide/page.tsx`

- [ ] **Step 1: Write the callout component**

```tsx
// src/components/cc/profile/CSSProfileCallout.tsx
"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function CSSProfileCallout() {
  return (
    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-emerald-500/5 border border-[#D4AF37]/30">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">CSS Profile — you&apos;ll need this</h3>
          <p className="text-xs text-white/60 leading-relaxed mt-1.5">
            As an international student who needs full aid, you&apos;ll submit the CSS Profile at most schools (not FAFSA). It&apos;s longer, asks for family income/assets/expenses in more detail, and costs $25 per school.
          </p>
          <p className="text-xs text-white/50 leading-relaxed mt-2">
            Start gathering: parents&apos; tax returns or equivalent, 2 years of bank statements, and an estimate of monthly household expenses.
          </p>
          <Link
            href="/profile/css-guide"
            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[#D4AF37] hover:text-[#E5C158] transition-colors"
          >
            Open the CSS Profile guide <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the stub page**

```tsx
// src/app/profile/css-guide/page.tsx
import { FileText } from "lucide-react";

export default function CSSGuideStub() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <FileText className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
      <h1 className="text-xl font-bold text-white">CSS Profile Guide</h1>
      <p className="text-sm text-white/50 mt-2">
        The full walkthrough is coming soon. In the meantime, gather your parents&apos; tax returns, 2 years of bank statements, and an estimate of monthly household expenses.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/profile/CSSProfileCallout.tsx src/app/profile/css-guide/page.tsx
git commit -m "feat(profile): add CSS Profile callout component + stub guide route"
```

---

## Task 5: FinancialForm — affordability selector at the top

**Files:**
- Modify: `src/components/cc/profile/FinancialForm.tsx`

- [ ] **Step 1: Replace the file**

```tsx
// src/components/cc/profile/FinancialForm.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { AFFORDABILITY_OPTIONS, type AffordabilityValue } from "@/lib/cc/affordability";
import CSSProfileCallout from "./CSSProfileCallout";

interface FinancialData {
  household_income_bracket?: string | null;
  household_size?: number | null;
  dependents_in_college?: number | null;
  parents_marital_status?: string | null;
  free_reduced_lunch?: boolean | null;
  willing_to_take_loans?: boolean | null;
  max_loans_comfortable?: number | null;
  fafsa_submitted?: boolean | null;
  css_profile_submitted?: boolean | null;
}

interface Props {
  data: FinancialData | null;
  onSave: (fields: Partial<FinancialData>) => Promise<void>;
  affordabilityValue?: AffordabilityValue | null;
  isInternational?: boolean;
  onAffordabilityChange?: (value: AffordabilityValue) => Promise<void>;
}

const INCOME_BRACKETS = ["$0-30k", "$30-48k", "$48-75k", "$75-110k", "$110k+"];
const MARITAL_OPTIONS = ["Married/Partnered", "Single parent", "Divorced/Separated", "Widowed", "Prefer not to say"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50";

export default function FinancialForm({
  data,
  onSave,
  affordabilityValue,
  isInternational,
  onAffordabilityChange,
}: Props) {
  const [form, setForm] = useState<FinancialData>(data || {});
  const [localAffordability, setLocalAffordability] = useState<AffordabilityValue | null>(affordabilityValue ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof FinancialData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const onPickAffordability = async (value: AffordabilityValue) => {
    setLocalAffordability(value);
    if (onAffordabilityChange) await onAffordabilityChange(value);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/40 leading-relaxed">
        This information is private and never shared with colleges. It helps Coach Kairos estimate your net price at each school and find scholarships you qualify for.
      </p>

      <div>
        <label className="block text-sm text-white/60 mb-2">How much can your family contribute per year? *</label>
        <p className="text-xs text-white/40 mb-3">This is what you can realistically pay toward college — separate from income.</p>
        <div className="flex flex-col gap-2">
          {AFFORDABILITY_OPTIONS.map((opt) => {
            const active = localAffordability === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPickAffordability(opt.value)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  active
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                <div className={`font-medium ${active ? "text-[#D4AF37]" : "text-white/80"}`}>{opt.label}</div>
                {opt.sublabel && <div className="text-xs text-white/40 mt-0.5">{opt.sublabel}</div>}
              </button>
            );
          })}
        </div>
        {localAffordability === "zero" && isInternational && <CSSProfileCallout />}
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Household income bracket *</label>
        <div className="flex flex-wrap gap-2">
          {INCOME_BRACKETS.map((bracket) => (
            <button
              key={bracket}
              type="button"
              onClick={() => update("household_income_bracket", bracket)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                form.household_income_bracket === bracket
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {bracket}
            </button>
          ))}
        </div>
        <Nudge show={!form.household_income_bracket} text="This helps Coach Kairos estimate your net price at each school" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Household size *</label>
          <input type="number" min="1" max="20" value={form.household_size ?? ""} onChange={(e) => update("household_size", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Family members in college</label>
          <input type="number" min="0" max="10" value={form.dependents_in_college ?? 1} onChange={(e) => update("dependents_in_college", Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Parents&apos; marital status</label>
          <select value={form.parents_marital_status || ""} onChange={(e) => update("parents_marital_status", e.target.value)} className={inputClass}>
            <option value="">Select...</option>
            {MARITAL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.free_reduced_lunch || false} onChange={(e) => update("free_reduced_lunch", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">Qualifies for free/reduced lunch</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.willing_to_take_loans || false} onChange={(e) => update("willing_to_take_loans", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">Willing to take student loans</span>
        </label>
      </div>

      {form.willing_to_take_loans && (
        <div>
          <label className="block text-sm text-white/60 mb-1">Max comfortable loan amount ($)</label>
          <input type="number" min="0" step="1000" value={form.max_loans_comfortable ?? ""} onChange={(e) => update("max_loans_comfortable", e.target.value ? Number(e.target.value) : null)} className={`${inputClass} max-w-xs`} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.fafsa_submitted || false} onChange={(e) => update("fafsa_submitted", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">FAFSA submitted</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.css_profile_submitted || false} onChange={(e) => update("css_profile_submitted", e.target.checked)} className="w-4 h-4 rounded accent-[#D4AF37]" />
          <span className="text-sm text-white/70">CSS Profile submitted</span>
        </label>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: errors about `affordabilityValue`, `isInternational`, `onAffordabilityChange` props not being passed by callers — that's fine, fixed in Tasks 6/7.

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/profile/FinancialForm.tsx
git commit -m "feat(profile): add affordability selector + CSS Profile callout to FinancialForm"
```

---

## Task 6: ProfilePage — plumb isInternational + affordability_value through

**Files:**
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Add the affordability save handler and pass the new props**

Find the `saveFinancial` callback in `src/app/profile/page.tsx`. Below it, add a new `saveAffordability` callback:

```tsx
// paste just below saveFinancial in src/app/profile/page.tsx
const saveAffordability = useCallback(async (value: string) => {
  await fetch("/api/cc/profile/identity", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ affordability_value: value }),
  });
  fetchProfile();
}, [fetchProfile]);
```

Then find the two `<FinancialForm ... />` usages and change each to pass:

```tsx
<FinancialForm
  data={(profileData as { financial: never }).financial}
  onSave={saveFinancial as never}
  affordabilityValue={(profileData as { profile: { affordability_value?: string | null } }).profile.affordability_value as never}
  isInternational={!!(profileData as { profile: { is_international?: boolean | null } }).profile.is_international}
  onAffordabilityChange={saveAffordability as never}
/>
```

(Replace both the inline `activeTab === 4` usage and pass the same trio to `<ProfileWizard>` in Task 7.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: fewer errors — the `activeTab === 4` path now has the props.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat(profile): plumb affordability + isInternational into FinancialForm"
```

---

## Task 7: ProfileWizard — forward affordability props

**Files:**
- Modify: `src/components/cc/profile/ProfileWizard.tsx`

- [ ] **Step 1: Extend Props and forward**

In `src/components/cc/profile/ProfileWizard.tsx`, extend the `Props` interface:

```tsx
interface Props {
  profileData: {
    profile: Record<string, unknown>;
    academic: Record<string, unknown> | null;
    activities: Array<Record<string, unknown>>;
    honors: Array<Record<string, unknown>>;
    financial: Record<string, unknown> | null;
  };
  onSaveIdentity: (fields: Record<string, unknown>) => Promise<void>;
  onSaveAcademic: (fields: Record<string, unknown>) => Promise<void>;
  onSaveActivity: (activity: Record<string, unknown>) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  onSaveHonor: (honor: Record<string, unknown>) => Promise<void>;
  onDeleteHonor: (id: string) => Promise<void>;
  onSaveFinancial: (fields: Record<string, unknown>) => Promise<void>;
  onSaveAffordability: (value: string) => Promise<void>;
  onComplete: () => void;
}
```

Destructure `onSaveAffordability` in the function signature (next to the other props).

Then change the `financial` step to:

```tsx
{currentStep.key === "financial" && (
  <FinancialForm
    data={profileData.financial as never}
    onSave={onSaveFinancial as never}
    affordabilityValue={(profileData.profile as { affordability_value?: string | null }).affordability_value as never}
    isInternational={!!(profileData.profile as { is_international?: boolean | null }).is_international}
    onAffordabilityChange={onSaveAffordability as never}
  />
)}
```

- [ ] **Step 2: Update `/profile/page.tsx` to pass `onSaveAffordability` to `<ProfileWizard>`**

```tsx
<ProfileWizard
  profileData={profileData as never}
  onSaveIdentity={saveIdentity}
  onSaveAcademic={saveAcademic}
  onSaveActivity={saveActivity}
  onDeleteActivity={deleteActivity}
  onSaveHonor={saveHonor}
  onDeleteHonor={deleteHonor}
  onSaveFinancial={saveFinancial}
  onSaveAffordability={saveAffordability}
  onComplete={() => setShowWizard(false)}
/>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/cc/profile/ProfileWizard.tsx src/app/profile/page.tsx
git commit -m "feat(profile): ProfileWizard forwards affordability save through to FinancialForm"
```

---

## Task 8: CoachContext — add affordability fields, failing test first

**Files:**
- Modify: `src/lib/cc/__tests__/coach-prompt-builder.test.ts`
- Modify: `src/lib/cc/coach-prompt-builder.ts`

- [ ] **Step 1: Extend existing tests with the new fields in baseContext**

Edit `src/lib/cc/__tests__/coach-prompt-builder.test.ts` — in `baseContext`, add the two new fields:

```ts
const baseContext: CoachContext = {
  // ...existing fields...
  affordabilityValue: null,
  needsFullAid: false,
  // keep focusEssay, applicationSnapshot as they are
};
```

- [ ] **Step 2: Add new failing tests**

```ts
// append in the describe("buildSystemPrompt", ...) block
it("adds CSS Profile guidance in school-builder when needsFullAid and international", () => {
  const ctx: CoachContext = {
    ...baseContext,
    mode: "school-builder",
    needsFullAid: true,
    isInternational: true,
    affordabilityValue: "zero",
  };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).toContain("CSS Profile");
  expect(prompt).toContain("need-blind");
  expect(prompt).toContain("MIT");
});

it("does NOT add the needsFullAid branch when needsFullAid is false", () => {
  const ctx: CoachContext = {
    ...baseContext,
    mode: "school-builder",
    needsFullAid: false,
  };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).not.toContain("need-blind-for-international");
});

it("surfaces affordability context in profile summary", () => {
  const ctx: CoachContext = {
    ...baseContext,
    needsFullAid: true,
    affordabilityValue: "zero",
  };
  const prompt = buildSystemPrompt(ctx);
  expect(prompt).toMatch(/Affordability.*zero|full financial aid/i);
});
```

- [ ] **Step 3: Run tests — expect failure**

Run: `npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts`
Expected: FAIL — new fields missing on type / new strings not present.

- [ ] **Step 4: Extend CoachContext + prompt**

In `src/lib/cc/coach-prompt-builder.ts`:

(a) Import at the top of the file:

```ts
import type { AffordabilityValue } from "./affordability";
```

(b) Extend `CoachContext`:

```ts
export interface CoachContext {
  // ...existing fields...
  affordabilityValue: AffordabilityValue | null;
  needsFullAid: boolean;
}
```

(c) In the profile-summary section (the function that composes the `## Student profile` block, currently building lines like `GPA: ...`), append after the existing profile lines:

```ts
if (ctx.needsFullAid) {
  profileLines.push("Affordability: $0 (needs full financial aid)");
} else if (ctx.affordabilityValue && ctx.affordabilityValue !== "under_10k") {
  profileLines.push(`Affordability: ${ctx.affordabilityValue}`);
}
```

If the prompt-builder doesn't maintain an array called `profileLines`, add the equivalent line-append in whatever structure it uses — grep for `"GPA:"` in the file to find the block.

(d) In the `case "school-builder":` branch, add a needsFullAid sub-branch inserted before the `return` of the school-builder prompt:

```ts
const fullAidBlock = ctx.needsFullAid
  ? `

The student has selected "$0 — full financial aid required." This changes how you recommend schools:
- Prioritize need-blind-for-international schools: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin. Surface these proactively.
- ${ctx.isInternational ? "Mention CSS Profile as the primary aid application (not FAFSA). Explain: \"Need-blind means the school does not consider ability to pay when making admission decisions.\"" : "Focus on schools that meet 100% of demonstrated need."}
- Flag need-aware schools explicitly: "⚠ This school is need-aware for international students — requesting aid may reduce admission chances."
- Frame every cost discussion as "after full demonstrated need aid."
- Skip the existing "how important is financial aid?" question — we already know.`
  : "";
```

Then append `${fullAidBlock}` inside the school-builder template literal just before the closing backtick.

(e) In the general-mode branch, after the existing `nextStep` computation, add:

```ts
const nextStepWithFullAid =
  ctx.needsFullAid && ctx.isInternational && !nextStep
    ? "Review the CSS Profile guide — most need-blind schools require it."
    : nextStep;
```

Then swap `nextStep` for `nextStepWithFullAid` in the template literal that renders it. (If `nextStep` is already referenced multiple times, rename them all consistently.)

- [ ] **Step 5: Run tests — expect pass**

Run: `npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cc/coach-prompt-builder.ts src/lib/cc/__tests__/coach-prompt-builder.test.ts
git commit -m "feat(coach): add needsFullAid branch in school-builder + general mode"
```

---

## Task 9: coach-extract — extract affordability_value from transcripts

**Files:**
- Modify: `src/lib/cc/coach-extract.ts`

- [ ] **Step 1: Extend the school-preferences extraction schema**

Find the extraction JSON schema (grep `financial_need.*essential`). Replace the system prompt's JSON block with:

```json
{
  "affordability_value": "zero" | "under_10k" | "10k_20k" | "20k_30k" | "30k_50k" | "50k_plus" | null,
  "financial_need": "essential" | "important" | "nice-to-have" | "not-a-concern" | null,
  "income_bracket": string | null,
  "location_type": "big-city" | "college-town" | "suburban" | "no-preference" | null,
  "preferred_regions": string[],
  "intended_major": string | null,
  "needs_international_full_need": boolean | null,
  "extracurriculars_summary": string | null,
  "campus_size_preference": "small" | "large" | "no-preference" | null
}
```

Add instructions to the prompt text: *"Detect affordability phrases: 'I can't pay anything' / 'I need full aid' / 'my family has no money for college' → affordability_value='zero'. 'We can do up to 20k' → '10k_20k'. Always prefer a specific affordability_value over financial_need when both are clear."*

- [ ] **Step 2: Write affordability to both tables when extracted**

In the same file, after the existing `upsert` block that writes `cc_school_preferences`, add:

```ts
import { financialNeedFromAffordability, type AffordabilityValue } from "./affordability";

// ...inside extractSchoolPreferences, after computing `data`:

if (data.affordability_value) {
  // Write to cc_student_profiles
  await admin
    .from("cc_student_profiles")
    .update({ affordability_value: data.affordability_value, updated_at: new Date().toISOString() })
    .eq("id", studentId);

  // Derive financial_need for cc_school_preferences if the LLM didn't set it explicitly
  if (!upsert.financial_need) {
    upsert.financial_need = financialNeedFromAffordability(data.affordability_value as AffordabilityValue);
  }
}
```

(Exact placement: this runs immediately before the existing `cc_school_preferences` upsert so the derived value lands in the same row.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cc/coach-extract.ts
git commit -m "feat(coach): extract affordability_value from transcripts, persist to both tables"
```

---

## Task 10: Coach message route — fetch affordability fields

**Files:**
- Modify: `src/app/api/cc/coach/message/route.ts`

- [ ] **Step 1: Add to profile select + CoachContext population**

Find the `from("cc_student_profiles").select(...)` in the message route. Update the select string to include `affordability_value, needs_full_aid`.

Find the `const ctx: CoachContext = { ... }` object. Add:

```ts
affordabilityValue: profile.affordability_value ?? null,
needsFullAid: !!profile.needs_full_aid,
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/coach/message/route.ts
git commit -m "feat(coach): coach message route reads affordability + needs_full_aid"
```

---

## Task 11: School list generation — filter + aid_warning

**Files:**
- Modify: `src/app/api/cc/school-list/generate/route.ts`

- [ ] **Step 1: Extend profile select**

In the `from("cc_student_profiles").select(...)` near the top, add `affordability_value, needs_full_aid, is_international` to the select string (or switch to `"*"` if already wildcarded).

- [ ] **Step 2: Extend schools select**

Change the `from("cc_schools").select(...)` to include `need_blind_international`:

```ts
const { data: allSchools } = await admin
  .from("cc_schools")
  .select("id, name, acceptance_rate, avg_net_price, test_policy, state, school_type, meets_full_need, need_blind_international, ipeds_id")
  .order("name");
```

- [ ] **Step 3: Apply needs_full_aid filter**

Replace the existing `let filteredSchools = allSchools;` block with:

```ts
type SchoolRow = {
  id: string;
  name: string;
  acceptance_rate: number;
  avg_net_price: number;
  test_policy: string;
  state: string;
  school_type: string;
  meets_full_need: boolean;
  need_blind_international: boolean;
  ipeds_id: number | null;
};

let filteredSchools: SchoolRow[] = allSchools as SchoolRow[];

if (profile.needs_full_aid && profile.is_international) {
  const pool = filteredSchools.filter((s) => s.need_blind_international || s.meets_full_need);
  filteredSchools = pool.length >= 15 ? pool : filteredSchools;
} else if (profile.needs_full_aid) {
  const pool = filteredSchools.filter((s) => s.meets_full_need);
  filteredSchools = pool.length >= 15 ? pool : filteredSchools;
} else if (preferences?.needs_international_full_need) {
  const fullNeed = filteredSchools.filter((s) => s.meets_full_need);
  if (fullNeed.length >= 30) filteredSchools = fullNeed;
}
```

- [ ] **Step 4: Add affordability context into the prompt**

Update the `profileParts` construction to include:

```ts
if (profile.needs_full_aid) {
  profileParts.push("Affordability: $0 (needs full aid — must filter toward need-blind-international or meets-full-need schools)");
}
```

Add a rule into the prompt template (after the existing "Create a balanced list of 8-12 schools..." sentence):

```
If the student needs full aid, at least 6 of the 10 recommendations must be need-blind-for-international or meets-full-need schools. Always include several of: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin if they are in the candidate list.
```

- [ ] **Step 5: Tag each returned suggestion with aid_warning**

After the existing `for (const sug of suggestions) { const match = ... }` loop, add:

```ts
for (const sug of suggestions) {
  if (!sug.school_id) continue;
  const match = filteredSchools.find((s) => s.id === sug.school_id);
  if (!match) continue;
  if (profile.needs_full_aid && profile.is_international && !match.need_blind_international) {
    (sug as typeof sug & { aid_warning?: string }).aid_warning = "need-aware";
  }
}
```

And update the `NextResponse.json` to keep the `aid_warning` on the returned items (JSON will already carry it since we mutated the object).

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors in this file.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/cc/school-list/generate/route.ts
git commit -m "feat(schools): filter + aid_warning when student needs full aid"
```

---

## Task 12: SchoolCard — amber aid warning badge

**Files:**
- Modify: `src/components/cc/SchoolCard.tsx`

- [ ] **Step 1: Extend Props and render the badge**

Add `aidWarning?: "need-aware";` to the `Props` interface next to `chancingBand`.

Destructure `aidWarning` in the function signature.

Inside the tier-chip row (after the existing `{chancingBand && (...)}` block, before the `<ChevronRight />` icon), insert:

```tsx
{aidWarning === "need-aware" && (
  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-amber-500/15 text-amber-400 border-amber-500/30">
    ⚠ Need-aware intl
  </span>
)}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/SchoolCard.tsx
git commit -m "feat(schools): SchoolCard shows 'need-aware intl' badge when aidWarning set"
```

---

## Task 13: Chancing route — need-blind + affordability in prompt

**Files:**
- Modify: `src/app/api/cc/chances/[school_id]/route.ts`

- [ ] **Step 1: Extend profile + school selects**

Profile select (currently `id, preferred_name, ..., is_international`): add `affordability_value, needs_full_aid`.

School select (currently has `meets_full_need, first_gen_programs, ...`): add `need_blind_international`.

- [ ] **Step 2: Extend snapshot**

In the `const snapshot = { student: { ... } }` object, add under `student`:

```ts
affordabilityValue: profile.affordability_value,
needsFullAid: !!profile.needs_full_aid,
```

In the `const schoolContext = { ... }` object, add:

```ts
needBlindInternational: !!school.need_blind_international,
```

- [ ] **Step 3: Extend SYSTEM_PROMPT**

Add this bullet into the `RULES:` list in `SYSTEM_PROMPT`:

```
- If the student has needsFullAid=true and the school is NOT need-blind for internationals (needBlindInternational=false), downgrade the band by one tier and note the aid-admission risk in weaknesses.
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add "src/app/api/cc/chances/[school_id]/route.ts"
git commit -m "feat(chances): factor needsFullAid + need_blind_international into chancing"
```

---

## Task 14: Integration smoke test — run the full flow

**Files:** (no new files; verification-only)

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: all pass — affordability.test.ts, coach-prompt-builder.test.ts, gpa-converter.test.ts, plus any pre-existing suites.

- [ ] **Step 2: Full type-check**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by Section 2 work. (Pre-existing error in `tests/e2e/comprehensive-visual-audit.spec.ts` from commit `a8e4adc` is acceptable — leave it alone.)

- [ ] **Step 3: Migration smoke (manual, one-time per env)**

If Supabase local is running, run: `npx supabase db push`
Expected: migration `20260423_affordability.sql` applies cleanly. Verify via `select column_name from information_schema.columns where table_name='cc_student_profiles' and column_name in ('affordability_value','needs_full_aid');` — both rows exist.

- [ ] **Step 4: Verify seed**

Run: `select count(*) from cc_schools where need_blind_international = true;`
Expected: `8`.

- [ ] **Step 5: Manual UX smoke**

- Go to `/profile`, Financial tab.
- Confirm the new affordability selector is at the top, $0 option is first.
- Select $0. If `is_international` is true on the profile, the CSS Profile callout appears.
- Check `select affordability_value, needs_full_aid from cc_student_profiles where ...;` — `zero` + `true`.
- Check `select financial_need from cc_school_preferences where student_id = ...;` — `essential`.
- Open Coach Kairos in school-builder mode, start a conversation. The system prompt (visible via dev tools or logging) includes the `need-blind-for-international` block and mentions CSS Profile.
- Generate a school list. Confirm ≥6/10 recommendations are from need-blind-international or meets_full_need set. Need-aware suggestions carry `aid_warning: "need-aware"` in the JSON response.
- Add a need-aware school to the list and view the SchoolCard — amber badge renders.

- [ ] **Step 6: Final commit**

No code changes expected in this task. If anything was tweaked during smoke:

```bash
git add -A
git commit -m "fix(section-2): smoke-test fixes"
```

---

## Self-review against spec

Checked: every acceptance criterion in `docs/superpowers/specs/2026-04-22-full-financial-aid-design.md` maps to a task above.

| Acceptance criterion | Task(s) |
|---|---|
| `$0` first option in selector | Task 2 (constants), Task 5 (render) |
| `needs_full_aid = true` in DB | Task 1 (generated column) |
| MIT/Harvard/Yale/Princeton/Dartmouth/Amherst/Williams/Bowdoin in first 10 for zero-int'l | Task 1 (seed) + Task 11 (filter + prompt rule) |
| Need-aware warning badge in list | Task 11 (aid_warning field) + Task 12 (render) |
| Coach proactively mentions CSS Profile | Task 8 (prompt branches) + Task 4 (callout component) |
| Affordability visible on profile page | Task 5 (FinancialForm) + Tasks 6/7 (plumbing) |

No placeholders, no "TBD", no orphaned type references. Types: `AffordabilityValue`, `FinancialNeedDerived` defined in Task 2, referenced in Tasks 3, 5, 8, 9, 10. Column names (`affordability_value`, `needs_full_aid`, `need_blind_international`) consistent across Tasks 1, 3, 10, 11, 13.
