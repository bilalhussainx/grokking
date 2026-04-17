# Student Profile Builder (Feature 6.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hybrid wizard/dashboard at `/profile` where students fill in their college application profile across 5 sections (Identity, Academic, Activities, Honors, Financial), with auto-save and completion tracking.

**Architecture:** Five PATCH API routes write to existing `cc_*` tables. A single GET route joins all tables and computes completion %. Client-side page renders either a wizard (first visit) or tabbed dashboard (return visits). Each form section is its own component with debounced auto-save on blur.

**Tech Stack:** Next.js App Router, Supabase (authenticated client), React state, Framer Motion for transitions.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/cc/profile-completion.ts` | Create | Pure completion % calculator |
| `src/app/api/cc/profile/route.ts` | Modify | GET full profile with completion % |
| `src/app/api/cc/profile/identity/route.ts` | Modify | PATCH identity fields |
| `src/app/api/cc/profile/academic/route.ts` | Modify | PATCH/upsert academic fields |
| `src/app/api/cc/profile/activities/route.ts` | Modify | PATCH upsert + DELETE activity |
| `src/app/api/cc/profile/honors/route.ts` | Modify | PATCH upsert + DELETE honor |
| `src/app/api/cc/profile/financial/route.ts` | Modify | PATCH/upsert financial fields |
| `src/components/cc/profile/CompletionRing.tsx` | Create | SVG ring component |
| `src/components/cc/profile/IdentityForm.tsx` | Create | Identity section form |
| `src/components/cc/profile/AcademicForm.tsx` | Create | Academic section form |
| `src/components/cc/profile/ActivitiesForm.tsx` | Create | Card-based activity list |
| `src/components/cc/profile/HonorsForm.tsx` | Create | Card-based honor list |
| `src/components/cc/profile/FinancialForm.tsx` | Create | Financial section form |
| `src/components/cc/profile/ProfileWizard.tsx` | Create | Wizard step navigation |
| `src/app/profile/layout.tsx` | Create | Page layout |
| `src/app/profile/page.tsx` | Create | Main page (wizard or tabs) |

---

### Task 1: Profile Completion Calculator

**Files:**
- Create: `src/lib/cc/profile-completion.ts`

- [ ] **Step 1: Create the completion calculator**

```typescript
// src/lib/cc/profile-completion.ts

export interface ProfileData {
  legal_first_name?: string | null;
  grade_level?: number | null;
  graduation_year?: number | null;
  high_school_name?: string | null;
  state_province?: string | null;
}

export interface AcademicData {
  gpa_unweighted?: number | null;
  sat_total?: number | null;
  act_composite?: number | null;
  test_strategy?: string | null;
}

export interface ActivityData {
  id: string;
  position: number;
  activity_type?: string | null;
}

export interface HonorData {
  id: string;
  position: number;
  title?: string | null;
}

export interface FinancialData {
  household_income_bracket?: string | null;
  household_size?: number | null;
}

export function calculateCompletion(
  profile: ProfileData | null,
  academic: AcademicData | null,
  activities: ActivityData[],
  honors: HonorData[],
  financial: FinancialData | null,
): number {
  const identityRequired: (keyof ProfileData)[] = [
    "legal_first_name",
    "grade_level",
    "graduation_year",
    "high_school_name",
    "state_province",
  ];
  const identityFilled = profile
    ? identityRequired.filter((f) => profile[f] != null && profile[f] !== "").length
    : 0;
  const identityPct = (identityFilled / identityRequired.length) * 20;

  const hasGPA = !!academic?.gpa_unweighted;
  const hasTest =
    !!academic?.sat_total ||
    !!academic?.act_composite ||
    academic?.test_strategy === "Test-optional";
  const academicPct = (((hasGPA ? 1 : 0) + (hasTest ? 1 : 0)) / 2) * 25;

  const activityPct = activities.length >= 1 ? 25 : 0;

  const honorsPct = honors.length >= 1 ? 10 : 0;

  const financialRequired: (keyof FinancialData)[] = [
    "household_income_bracket",
    "household_size",
  ];
  const financialFilled = financial
    ? financialRequired.filter((f) => financial[f] != null && financial[f] !== "").length
    : 0;
  const financialPct = (financialFilled / financialRequired.length) * 20;

  return Math.round(identityPct + academicPct + activityPct + honorsPct + financialPct);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cc/profile-completion.ts
git commit -m "feat(profile): completion percentage calculator"
```

---

### Task 2: GET /api/cc/profile — Full Profile Fetch

**Files:**
- Modify: `src/app/api/cc/profile/route.ts`

- [ ] **Step 1: Wire the GET route to join all tables**

```typescript
// src/app/api/cc/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";
import { calculateCompletion } from "@/lib/cc/profile-completion";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  // Fetch or create profile
  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    profile = newProfile;
  }

  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("*")
    .eq("student_id", profile.id)
    .single();

  const { data: activities } = await supabase
    .from("cc_activities")
    .select("*")
    .eq("student_id", profile.id)
    .order("position");

  const { data: honors } = await supabase
    .from("cc_honors")
    .select("*")
    .eq("student_id", profile.id)
    .order("position");

  const { data: financial } = await supabase
    .from("cc_financial_profiles")
    .select("*")
    .eq("student_id", profile.id)
    .single();

  const completion_pct = calculateCompletion(
    profile,
    academic,
    activities || [],
    honors || [],
    financial,
  );

  // Update stored completion if changed
  if (completion_pct !== profile.profile_completion_pct) {
    await supabase
      .from("cc_student_profiles")
      .update({ profile_completion_pct: completion_pct })
      .eq("id", profile.id);
  }

  return NextResponse.json({
    profile,
    academic: academic || null,
    activities: activities || [],
    honors: honors || [],
    financial: financial || null,
    completion_pct,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/profile/route.ts
git commit -m "feat(profile): GET route with full profile join and completion %"
```

---

### Task 3: PATCH Identity + Academic + Financial Routes

**Files:**
- Modify: `src/app/api/cc/profile/identity/route.ts`
- Modify: `src/app/api/cc/profile/academic/route.ts`
- Modify: `src/app/api/cc/profile/financial/route.ts`

- [ ] **Step 1: Wire identity PATCH**

```typescript
// src/app/api/cc/profile/identity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "legal_first_name", "preferred_name", "grade_level", "graduation_year",
  "high_school_name", "high_school_ceeb_code", "state_province", "country",
  "home_language", "is_first_gen", "is_international", "citizenship_status",
  "race_ethnicity", "gender",
];

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

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
  return NextResponse.json({ updated: true, id: data.id });
}
```

- [ ] **Step 2: Wire academic PATCH (upsert)**

```typescript
// src/app/api/cc/profile/academic/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "gpa_unweighted", "gpa_weighted", "gpa_scale", "class_rank", "class_size",
  "courses", "ap_ib_courses", "test_strategy", "sat_total", "sat_math",
  "sat_erw", "act_composite", "act_subscores", "toefl_score", "ielts_score",
  "duolingo_english_score",
];

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  // Get student_id
  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const fields: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_FIELDS) {
    if (key in body) fields[key] = body[key];
  }

  // Check if academic row exists
  const { data: existing } = await supabase
    .from("cc_academic_profiles")
    .select("id")
    .eq("student_id", profile.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_academic_profiles")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("cc_academic_profiles")
      .insert({ student_id: profile.id, ...fields });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}
```

- [ ] **Step 3: Wire financial PATCH (upsert)**

```typescript
// src/app/api/cc/profile/financial/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_FIELDS = [
  "household_income_bracket", "household_size", "dependents_in_college",
  "parents_marital_status", "pell_eligible_estimate", "sai_estimate",
  "free_reduced_lunch", "willing_to_take_loans", "max_loans_comfortable",
  "fafsa_submitted", "fafsa_ed", "css_profile_submitted",
];

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const fields: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_FIELDS) {
    if (key in body) fields[key] = body[key];
  }

  const { data: existing } = await supabase
    .from("cc_financial_profiles")
    .select("id")
    .eq("student_id", profile.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_financial_profiles")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("cc_financial_profiles")
      .insert({ student_id: profile.id, ...fields });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/cc/profile/identity/route.ts src/app/api/cc/profile/academic/route.ts src/app/api/cc/profile/financial/route.ts
git commit -m "feat(profile): wire identity, academic, financial PATCH routes"
```

---

### Task 4: Activities + Honors PATCH/DELETE Routes

**Files:**
- Modify: `src/app/api/cc/profile/activities/route.ts`
- Modify: `src/app/api/cc/profile/honors/route.ts`

- [ ] **Step 1: Wire activities PATCH + DELETE**

```typescript
// src/app/api/cc/profile/activities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { position, ...fields } = body;
  if (!position || position < 1 || position > 10) {
    return NextResponse.json({ error: "Position must be 1-10" }, { status: 400 });
  }

  // Check existing activity at this position
  const { data: existing } = await supabase
    .from("cc_activities")
    .select("id")
    .eq("student_id", profile.id)
    .eq("position", position)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_activities")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ updated: true, id: existing.id });
  } else {
    const { data, error } = await supabase
      .from("cc_activities")
      .insert({ student_id: profile.id, position, ...fields })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ created: true, id: data.id });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Verify ownership through student profile
  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { error } = await supabase
    .from("cc_activities")
    .delete()
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
```

- [ ] **Step 2: Wire honors PATCH + DELETE**

```typescript
// src/app/api/cc/profile/honors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { position, ...fields } = body;
  if (!position || position < 1 || position > 5) {
    return NextResponse.json({ error: "Position must be 1-5" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("cc_honors")
    .select("id")
    .eq("student_id", profile.id)
    .eq("position", position)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_honors")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ updated: true, id: existing.id });
  } else {
    const { data, error } = await supabase
      .from("cc_honors")
      .insert({ student_id: profile.id, position, ...fields })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ created: true, id: data.id });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { error } = await supabase
    .from("cc_honors")
    .delete()
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/profile/activities/route.ts src/app/api/cc/profile/honors/route.ts
git commit -m "feat(profile): wire activities and honors PATCH/DELETE routes"
```

---

### Task 5: CompletionRing Component

**Files:**
- Create: `src/components/cc/profile/CompletionRing.tsx`

- [ ] **Step 1: Create the SVG ring**

```typescript
// src/components/cc/profile/CompletionRing.tsx
"use client";

interface CompletionRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export default function CompletionRing({ percent, size = 80, strokeWidth = 6 }: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{percent}%</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/CompletionRing.tsx
git commit -m "feat(profile): SVG completion ring component"
```

---

### Task 6: Identity Form Component

**Files:**
- Create: `src/components/cc/profile/IdentityForm.tsx`

- [ ] **Step 1: Create the identity form**

```typescript
// src/components/cc/profile/IdentityForm.tsx
"use client";

import { useState, useCallback, useRef } from "react";

interface IdentityData {
  legal_first_name?: string | null;
  preferred_name?: string | null;
  grade_level?: number | null;
  graduation_year?: number | null;
  high_school_name?: string | null;
  high_school_ceeb_code?: string | null;
  state_province?: string | null;
  country?: string | null;
  home_language?: string | null;
  is_first_gen?: boolean | null;
  is_international?: boolean | null;
  citizenship_status?: string | null;
  race_ethnicity?: string[] | null;
  gender?: string | null;
}

interface Props {
  data: IdentityData;
  onSave: (fields: Partial<IdentityData>) => Promise<void>;
}

const CITIZENSHIP_OPTIONS = ["US Citizen", "Permanent Resident", "International", "DACA", "Undocumented"];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const ETHNICITY_OPTIONS = ["American Indian/Alaska Native", "Asian", "Black/African American", "Hispanic/Latino", "Native Hawaiian/Pacific Islander", "White", "Two or more races", "Prefer not to say"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

export default function IdentityForm({ data, onSave }: Props) {
  const [form, setForm] = useState<IdentityData>({ ...data });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof IdentityData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Legal first name *</label>
          <input
            type="text"
            value={form.legal_first_name || ""}
            onChange={(e) => update("legal_first_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
          <Nudge show={!form.legal_first_name} text="Required for your college applications" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Preferred name</label>
          <input
            type="text"
            value={form.preferred_name || ""}
            onChange={(e) => update("preferred_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Grade level *</label>
          <select
            value={form.grade_level || ""}
            onChange={(e) => {
              const grade = Number(e.target.value);
              update("grade_level", grade);
              const gradYear = currentYear + (12 - grade) + 1;
              update("graduation_year", gradYear);
            }}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            <option value="9">9th (Freshman)</option>
            <option value="10">10th (Sophomore)</option>
            <option value="11">11th (Junior)</option>
            <option value="12">12th (Senior)</option>
            <option value="13">Gap year / Post-grad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Graduation year *</label>
          <input
            type="number"
            value={form.graduation_year || ""}
            onChange={(e) => update("graduation_year", Number(e.target.value))}
            min={currentYear}
            max={currentYear + 5}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">High school name *</label>
          <input
            type="text"
            value={form.high_school_name || ""}
            onChange={(e) => update("high_school_name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">CEEB code (optional)</label>
          <input
            type="text"
            value={form.high_school_ceeb_code || ""}
            onChange={(e) => update("high_school_ceeb_code", e.target.value)}
            placeholder="6-digit code"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">State/Province *</label>
          <input
            type="text"
            value={form.state_province || ""}
            onChange={(e) => update("state_province", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Country</label>
          <select
            value={form.country || "US"}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Citizenship status</label>
          <select
            value={form.citizenship_status || ""}
            onChange={(e) => update("citizenship_status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            {CITIZENSHIP_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Gender</label>
          <select
            value={form.gender || ""}
            onChange={(e) => update("gender", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Race/Ethnicity (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {ETHNICITY_OPTIONS.map((eth) => {
            const selected = (form.race_ethnicity || []).includes(eth);
            return (
              <button
                key={eth}
                type="button"
                onClick={() => {
                  const current = form.race_ethnicity || [];
                  const next = selected ? current.filter((e) => e !== eth) : [...current, eth];
                  update("race_ethnicity", next);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  selected
                    ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                {eth}
              </button>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/IdentityForm.tsx
git commit -m "feat(profile): identity form component with auto-save"
```

---

### Task 7: Academic Form Component

**Files:**
- Create: `src/components/cc/profile/AcademicForm.tsx`

- [ ] **Step 1: Create the academic form**

```typescript
// src/components/cc/profile/AcademicForm.tsx
"use client";

import { useState, useCallback, useRef } from "react";

interface AcademicData {
  gpa_unweighted?: number | null;
  gpa_weighted?: number | null;
  gpa_scale?: string | null;
  class_rank?: number | null;
  class_size?: number | null;
  test_strategy?: string | null;
  sat_total?: number | null;
  sat_math?: number | null;
  sat_erw?: number | null;
  act_composite?: number | null;
  toefl_score?: number | null;
  ielts_score?: number | null;
  duolingo_english_score?: number | null;
}

interface Props {
  data: AcademicData | null;
  onSave: (fields: Partial<AcademicData>) => Promise<void>;
}

const TEST_STRATEGIES = ["SAT", "ACT", "Both", "Test-optional", "Undecided"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

export default function AcademicForm({ data, onSave }: Props) {
  const [form, setForm] = useState<AcademicData>(data || {});
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback((field: string, value: unknown) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave({ [field]: value });
    }, 500);
  }, [onSave]);

  const update = (field: keyof AcademicData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  };

  const numUpdate = (field: keyof AcademicData, raw: string) => {
    const val = raw === "" ? null : Number(raw);
    update(field, val);
  };

  const showSAT = form.test_strategy === "SAT" || form.test_strategy === "Both";
  const showACT = form.test_strategy === "ACT" || form.test_strategy === "Both";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA (unweighted) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={form.gpa_unweighted ?? ""}
            onChange={(e) => numUpdate("gpa_unweighted", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
          <Nudge show={!form.gpa_unweighted} text="Adding your GPA helps Coach Kairos recommend better-fit schools" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA (weighted)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            value={form.gpa_weighted ?? ""}
            onChange={(e) => numUpdate("gpa_weighted", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">GPA scale</label>
          <select
            value={form.gpa_scale || "4.0"}
            onChange={(e) => update("gpa_scale", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="4.0">4.0 scale</option>
            <option value="5.0">5.0 scale</option>
            <option value="100-point">100-point scale</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Class rank</label>
          <input
            type="number"
            min="1"
            value={form.class_rank ?? ""}
            onChange={(e) => numUpdate("class_rank", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Class size</label>
          <input
            type="number"
            min="1"
            value={form.class_size ?? ""}
            onChange={(e) => numUpdate("class_size", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Testing strategy *</label>
        <div className="flex flex-wrap gap-2">
          {TEST_STRATEGIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("test_strategy", s)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                form.test_strategy === s
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Nudge show={!form.test_strategy} text="Even if you're going test-optional, entering scores helps estimate merit aid" />
      </div>

      {showSAT && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT Total</label>
            <input type="number" min="400" max="1600" value={form.sat_total ?? ""} onChange={(e) => numUpdate("sat_total", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT Math</label>
            <input type="number" min="200" max="800" value={form.sat_math ?? ""} onChange={(e) => numUpdate("sat_math", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">SAT ERW</label>
            <input type="number" min="200" max="800" value={form.sat_erw ?? ""} onChange={(e) => numUpdate("sat_erw", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
          </div>
        </div>
      )}

      {showACT && (
        <div>
          <label className="block text-sm text-white/60 mb-1">ACT Composite</label>
          <input type="number" min="1" max="36" value={form.act_composite ?? ""} onChange={(e) => numUpdate("act_composite", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">TOEFL</label>
          <input type="number" value={form.toefl_score ?? ""} onChange={(e) => numUpdate("toefl_score", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">IELTS</label>
          <input type="number" step="0.5" min="0" max="9" value={form.ielts_score ?? ""} onChange={(e) => numUpdate("ielts_score", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Duolingo English</label>
          <input type="number" value={form.duolingo_english_score ?? ""} onChange={(e) => numUpdate("duolingo_english_score", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/AcademicForm.tsx
git commit -m "feat(profile): academic form with conditional test score fields"
```

---

### Task 8: Activities Form Component

**Files:**
- Create: `src/components/cc/profile/ActivitiesForm.tsx`

- [ ] **Step 1: Create the activities card list**

```typescript
// src/components/cc/profile/ActivitiesForm.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const ACTIVITY_TYPES = [
  "Academic", "Art", "Athletics", "Career", "Community Service",
  "Computer/Technology", "Cultural", "Dance", "Debate/Speech",
  "Environmental", "Family Responsibilities", "Foreign Exchange",
  "Journalism/Publication", "Junior ROTC", "LGBTQ+", "Music",
  "Religious", "Research", "Robotics", "School Spirit", "Science/Math",
  "Social Justice", "Student Government", "Theater/Drama", "Volunteer",
  "Work (paid)", "Other",
];

interface Activity {
  id?: string;
  position: number;
  activity_type?: string | null;
  organization?: string | null;
  role?: string | null;
  description_150?: string | null;
  grades_participated?: number[] | null;
  hours_per_week?: number | null;
  weeks_per_year?: number | null;
  is_continuing?: boolean;
}

interface Props {
  activities: Activity[];
  onSave: (activity: Partial<Activity> & { position: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CharCount({ current, max }: { current: number; max: number }) {
  const over = current > max;
  return (
    <span className={`text-xs ${over ? "text-red-400" : "text-white/30"}`}>
      {current}/{max}
    </span>
  );
}

export default function ActivitiesForm({ activities, onSave, onDelete }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const nextPosition = activities.length > 0
    ? Math.max(...activities.map((a) => a.position)) + 1
    : 1;

  const addActivity = () => {
    if (nextPosition > 10) return;
    onSave({ position: nextPosition, activity_type: "", organization: "", role: "", description_150: "", grades_participated: [], hours_per_week: 0, weeks_per_year: 0, is_continuing: true });
    setExpanded(nextPosition);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/40">{activities.length}/10 activities</p>
        {activities.length < 10 && (
          <button
            onClick={addActivity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add activity
          </button>
        )}
      </div>

      {activities.length === 0 && (
        <p className="text-xs text-[#D4AF37]/60">Colleges want to see what you do outside class — add your first activity</p>
      )}

      {activities.map((act) => (
        <div key={act.position} className="border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === act.position ? null : act.position)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-white/30 font-mono w-5">{act.position}</span>
              <span className="text-sm text-white truncate">{act.organization || act.activity_type || "New activity"}</span>
              {act.role && <span className="text-xs text-white/40">— {act.role}</span>}
            </div>
            {expanded === act.position ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
          </button>

          {expanded === act.position && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Activity type *</label>
                  <select
                    value={act.activity_type || ""}
                    onChange={(e) => onSave({ position: act.position, activity_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  >
                    <option value="">Select...</option>
                    {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Organization (100 chars)</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={act.organization || ""}
                    onChange={(e) => onSave({ position: act.position, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <CharCount current={(act.organization || "").length} max={100} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Your role (50 chars)</label>
                <input
                  type="text"
                  maxLength={50}
                  value={act.role || ""}
                  onChange={(e) => onSave({ position: act.position, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
                <CharCount current={(act.role || "").length} max={50} />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Description (150 chars)</label>
                <textarea
                  maxLength={150}
                  rows={2}
                  value={act.description_150 || ""}
                  onChange={(e) => onSave({ position: act.position, description_150: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
                <CharCount current={(act.description_150 || "").length} max={150} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Grades *</label>
                  <div className="flex gap-1">
                    {[9, 10, 11, 12].map((g) => {
                      const selected = (act.grades_participated || []).includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            const current = act.grades_participated || [];
                            const next = selected ? current.filter((x) => x !== g) : [...current, g];
                            onSave({ position: act.position, grades_participated: next });
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                            selected ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" : "bg-white/5 text-white/40 border border-white/10"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Hrs/week *</label>
                  <input type="number" min="0" max="168" value={act.hours_per_week ?? ""} onChange={(e) => onSave({ position: act.position, hours_per_week: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Weeks/yr *</label>
                  <input type="number" min="0" max="52" value={act.weeks_per_year ?? ""} onChange={(e) => onSave({ position: act.position, weeks_per_year: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={act.is_continuing ?? true} onChange={(e) => onSave({ position: act.position, is_continuing: e.target.checked })} className="w-4 h-4 rounded accent-[#D4AF37]" />
                    <span className="text-xs text-white/50">Continuing</span>
                  </label>
                </div>
              </div>

              {act.id && (
                <button onClick={() => onDelete(act.id!)} className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors mt-2">
                  <Trash2 className="w-3.5 h-3.5" /> Remove activity
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/ActivitiesForm.tsx
git commit -m "feat(profile): activities form with 10-slot card list and char counts"
```

---

### Task 9: Honors Form Component

**Files:**
- Create: `src/components/cc/profile/HonorsForm.tsx`

- [ ] **Step 1: Create the honors card list**

```typescript
// src/components/cc/profile/HonorsForm.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const HONOR_LEVELS = ["School", "State/Regional", "National", "International"];

interface Honor {
  id?: string;
  position: number;
  title?: string | null;
  level?: string | null;
  grade?: number | null;
  description_100?: string | null;
}

interface Props {
  honors: Honor[];
  onSave: (honor: Partial<Honor> & { position: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CharCount({ current, max }: { current: number; max: number }) {
  const over = current > max;
  return <span className={`text-xs ${over ? "text-red-400" : "text-white/30"}`}>{current}/{max}</span>;
}

export default function HonorsForm({ honors, onSave, onDelete }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const nextPosition = honors.length > 0
    ? Math.max(...honors.map((h) => h.position)) + 1
    : 1;

  const addHonor = () => {
    if (nextPosition > 5) return;
    onSave({ position: nextPosition, title: "", level: "", grade: null, description_100: "" });
    setExpanded(nextPosition);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/40">{honors.length}/5 honors</p>
        {honors.length < 5 && (
          <button
            onClick={addHonor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add honor
          </button>
        )}
      </div>

      {honors.map((hon) => (
        <div key={hon.position} className="border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === hon.position ? null : hon.position)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-white/30 font-mono w-5">{hon.position}</span>
              <span className="text-sm text-white truncate">{hon.title || "New honor"}</span>
              {hon.level && <span className="text-xs text-white/40">— {hon.level}</span>}
            </div>
            {expanded === hon.position ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
          </button>

          {expanded === hon.position && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Title (100 chars) *</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={hon.title || ""}
                    onChange={(e) => onSave({ position: hon.position, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <CharCount current={(hon.title || "").length} max={100} />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Level *</label>
                  <select
                    value={hon.level || ""}
                    onChange={(e) => onSave({ position: hon.position, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  >
                    <option value="">Select...</option>
                    {HONOR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Grade received *</label>
                <div className="flex gap-2">
                  {[9, 10, 11, 12].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onSave({ position: hon.position, grade: g })}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        hon.grade === g ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" : "bg-white/5 text-white/40 border border-white/10"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Description (100 chars)</label>
                <textarea
                  maxLength={100}
                  rows={2}
                  value={hon.description_100 || ""}
                  onChange={(e) => onSave({ position: hon.position, description_100: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
                <CharCount current={(hon.description_100 || "").length} max={100} />
              </div>

              {hon.id && (
                <button onClick={() => onDelete(hon.id!)} className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove honor
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/HonorsForm.tsx
git commit -m "feat(profile): honors form with 5-slot card list and char counts"
```

---

### Task 10: Financial Form Component

**Files:**
- Create: `src/components/cc/profile/FinancialForm.tsx`

- [ ] **Step 1: Create the financial form**

```typescript
// src/components/cc/profile/FinancialForm.tsx
"use client";

import { useState, useCallback, useRef } from "react";

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
}

const INCOME_BRACKETS = ["$0-30k", "$30-48k", "$48-75k", "$75-110k", "$110k+"];
const MARITAL_OPTIONS = ["Married/Partnered", "Single parent", "Divorced/Separated", "Widowed", "Prefer not to say"];

function Nudge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-[#D4AF37]/60 mt-1">{text}</p>;
}

export default function FinancialForm({ data, onSave }: Props) {
  const [form, setForm] = useState<FinancialData>(data || {});
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

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

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/40 leading-relaxed">
        This information is private and never shared with colleges. It helps Coach Kairos estimate your net price at each school and find scholarships you qualify for.
      </p>

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
          <input
            type="number"
            min="1"
            max="20"
            value={form.household_size ?? ""}
            onChange={(e) => update("household_size", e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Family members in college</label>
          <input
            type="number"
            min="0"
            max="10"
            value={form.dependents_in_college ?? 1}
            onChange={(e) => update("dependents_in_college", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Parents&apos; marital status</label>
          <select
            value={form.parents_marital_status || ""}
            onChange={(e) => update("parents_marital_status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          >
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
          <input
            type="number"
            min="0"
            step="1000"
            value={form.max_loans_comfortable ?? ""}
            onChange={(e) => update("max_loans_comfortable", e.target.value ? Number(e.target.value) : null)}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
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

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/FinancialForm.tsx
git commit -m "feat(profile): financial form with income brackets and loan comfort"
```

---

### Task 11: Profile Wizard Component

**Files:**
- Create: `src/components/cc/profile/ProfileWizard.tsx`

- [ ] **Step 1: Create the wizard wrapper**

```typescript
// src/components/cc/profile/ProfileWizard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import IdentityForm from "./IdentityForm";
import AcademicForm from "./AcademicForm";
import ActivitiesForm from "./ActivitiesForm";
import HonorsForm from "./HonorsForm";
import FinancialForm from "./FinancialForm";

const STEPS = [
  { key: "identity", label: "Identity", icon: "1" },
  { key: "academic", label: "Academic", icon: "2" },
  { key: "activities", label: "Activities", icon: "3" },
  { key: "honors", label: "Honors", icon: "4" },
  { key: "financial", label: "Financial", icon: "5" },
] as const;

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
  onComplete: () => void;
}

export default function ProfileWizard({
  profileData, onSaveIdentity, onSaveAcademic,
  onSaveActivity, onDeleteActivity, onSaveHonor, onDeleteHonor,
  onSaveFinancial, onComplete,
}: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      localStorage.setItem("profile_wizard_done", "true");
      onComplete();
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const skip = () => next();

  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? "bg-[#D4AF37] text-black" :
              i === step ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]" :
              "bg-white/5 text-white/30 border border-white/10"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : s.icon}
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-[#D4AF37]" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-1">{currentStep.label}</h2>
      <p className="text-sm text-white/40 mb-6">Step {step + 1} of {STEPS.length}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep.key === "identity" && (
            <IdentityForm data={profileData.profile as never} onSave={onSaveIdentity as never} />
          )}
          {currentStep.key === "academic" && (
            <AcademicForm data={profileData.academic as never} onSave={onSaveAcademic as never} />
          )}
          {currentStep.key === "activities" && (
            <ActivitiesForm activities={profileData.activities as never} onSave={onSaveActivity as never} onDelete={onDeleteActivity} />
          )}
          {currentStep.key === "honors" && (
            <HonorsForm honors={profileData.honors as never} onSave={onSaveHonor as never} onDelete={onDeleteHonor} />
          )}
          {currentStep.key === "financial" && (
            <FinancialForm data={profileData.financial as never} onSave={onSaveFinancial as never} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={skip}
            className="px-4 py-2 rounded-lg text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-all"
          >
            {step === STEPS.length - 1 ? "Finish" : "Save & Next"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/profile/ProfileWizard.tsx
git commit -m "feat(profile): wizard wrapper with step navigation"
```

---

### Task 12: Profile Page + Layout

**Files:**
- Create: `src/app/profile/layout.tsx`
- Create: `src/app/profile/page.tsx`

- [ ] **Step 1: Create profile layout**

```typescript
// src/app/profile/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Your Profile — Coach Kairos",
  description: "Build your college application profile",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create profile page**

```typescript
// src/app/profile/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import CompletionRing from "@/components/cc/profile/CompletionRing";
import ProfileWizard from "@/components/cc/profile/ProfileWizard";
import IdentityForm from "@/components/cc/profile/IdentityForm";
import AcademicForm from "@/components/cc/profile/AcademicForm";
import ActivitiesForm from "@/components/cc/profile/ActivitiesForm";
import HonorsForm from "@/components/cc/profile/HonorsForm";
import FinancialForm from "@/components/cc/profile/FinancialForm";

const TABS = ["Identity", "Academic", "Activities", "Honors", "Financial"] as const;

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const wizardParam = searchParams.get("wizard") === "1";
    const wizardDone = localStorage.getItem("profile_wizard_done") === "true";
    if (wizardParam && !wizardDone) setShowWizard(true);
    fetchProfile();
  }, [searchParams]);

  async function fetchProfile() {
    setLoading(true);
    const res = await fetch("/api/cc/profile");
    if (res.ok) {
      const data = await res.json();
      setProfileData(data);
    }
    setLoading(false);
  }

  const saveIdentity = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/identity", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, []);

  const saveAcademic = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/academic", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, []);

  const saveActivity = useCallback(async (activity: Record<string, unknown>) => {
    await fetch("/api/cc/profile/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    fetchProfile();
  }, []);

  const deleteActivity = useCallback(async (id: string) => {
    await fetch("/api/cc/profile/activities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProfile();
  }, []);

  const saveHonor = useCallback(async (honor: Record<string, unknown>) => {
    await fetch("/api/cc/profile/honors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(honor),
    });
    fetchProfile();
  }, []);

  const deleteHonor = useCallback(async (id: string) => {
    await fetch("/api/cc/profile/honors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProfile();
  }, []);

  const saveFinancial = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/financial", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, []);

  if (loading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (showWizard) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <GraduationCap className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Let&apos;s build your profile</h1>
          <p className="text-sm text-white/50 mt-1">This helps Coach Kairos give you personalized college guidance.</p>
        </div>
        <ProfileWizard
          profileData={profileData as never}
          onSaveIdentity={saveIdentity}
          onSaveAcademic={saveAcademic}
          onSaveActivity={saveActivity}
          onDeleteActivity={deleteActivity}
          onSaveHonor={saveHonor}
          onDeleteHonor={deleteHonor}
          onSaveFinancial={saveFinancial}
          onComplete={() => setShowWizard(false)}
        />
      </div>
    );
  }

  // Tabbed dashboard
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <CompletionRing percent={(profileData as { completion_pct: number }).completion_pct} />
        <div>
          <h1 className="text-xl font-bold text-white">Your Profile</h1>
          <p className="text-sm text-white/40">
            {(profileData as { completion_pct: number }).completion_pct}% complete
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && <IdentityForm data={(profileData as { profile: never }).profile} onSave={saveIdentity as never} />}
      {activeTab === 1 && <AcademicForm data={(profileData as { academic: never }).academic} onSave={saveAcademic as never} />}
      {activeTab === 2 && <ActivitiesForm activities={(profileData as { activities: never[] }).activities} onSave={saveActivity as never} onDelete={deleteActivity} />}
      {activeTab === 3 && <HonorsForm honors={(profileData as { honors: never[] }).honors} onSave={saveHonor as never} onDelete={deleteHonor} />}
      {activeTab === 4 && <FinancialForm data={(profileData as { financial: never }).financial} onSave={saveFinancial as never} />}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/layout.tsx src/app/profile/page.tsx
git commit -m "feat(profile): profile page with wizard/tabbed dashboard hybrid"
```

---

### Task 13: Final Integration Check

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -E "(profile|Profile)" | head -20
```

Expected: zero errors in profile files.

- [ ] **Step 2: Start dev server and smoke test**

```bash
npm run dev
```

1. Log in → navigate to `/profile?wizard=1`
2. Verify wizard shows 5 steps with step indicators
3. Fill in identity fields → click "Save & Next"
4. Skip academic → verify advances to activities
5. Click "Finish" on last step → verify switches to tabbed dashboard
6. Navigate to `/profile` → verify tabs show (no re-wizard)
7. Edit a field → verify auto-save (check Network tab)
8. Add an activity → verify card appears with char counter
9. Verify completion ring updates as fields are filled

- [ ] **Step 3: Final commit if any fixes needed**
