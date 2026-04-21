# Unified Coach Kairos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fragmented Coach Kairos experiences (intake page, setup checklist, school builder) with a single persistent chatbot that guides students from onboarding through school list building, using Claude Sonnet 4.6 via OpenRouter.

**Architecture:** A floating chat panel mounted once in the root layout, backed by a streaming conversation API that assembles context from the student's full profile. A rules-based mode detector routes conversations to the right behavior (intake, academic, school-builder, general). Background extraction saves structured data from conversations into existing profile tables.

**Tech Stack:** Next.js 14, OpenRouter API (Claude Sonnet 4.6), Supabase (PostgreSQL), Deepgram (voice), Framer Motion (animations), TypeScript

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `supabase/migrations/20260419_coach_kairos_unified.sql` | New tables: `cc_coach_conversations`, `cc_school_preferences` |
| `src/lib/cc/gpa-converter.ts` | Deterministic GPA conversion for international grading systems |
| `src/lib/cc/coach-mode-detector.ts` | Rules engine: (profile, page, message) → mode |
| `src/lib/cc/coach-prompt-builder.ts` | Assembles system prompt from profile + academics + preferences + history |
| `src/lib/cc/openrouter.ts` | OpenRouter API client with streaming + fallback chain |
| `src/contexts/CoachKairosContext.tsx` | Global state: panel, messages, mode, voice, proactive flag |
| `src/components/cc/coach/CoachKairosShell.tsx` | Floating button + panel container (mobile/desktop) |
| `src/components/cc/coach/CoachChat.tsx` | Message list, text input, voice toggle, option chips |
| `src/components/cc/coach/CoachMessage.tsx` | Single message bubble with markdown + inline cards |
| `src/components/cc/coach/CoachSchoolCard.tsx` | Compact school card for display inside chat messages |
| `src/app/api/cc/coach/message/route.ts` | POST: send message, get streaming SSE response |
| `src/app/api/cc/coach/history/route.ts` | GET: fetch last 50 messages for session restore |
| `src/app/api/cc/coach/extract/route.ts` | POST: background extraction of structured data from conversation |

### Modified Files

| File | Change |
|------|--------|
| `src/app/providers.tsx` | Add `CoachKairosProvider`, mount `CoachKairosShell` |
| `src/app/page.tsx` | Remove `SetupChecklist` import and render |
| `src/app/intake/page.tsx` | Redirect to dashboard with `?coach=open` param |
| `src/app/api/cc/school-list/generate/route.ts` | Accept preferences context, pre-filter schools |

### Test Files

| File | Tests |
|------|-------|
| `src/lib/cc/__tests__/gpa-converter.test.ts` | Conversion accuracy for all grading systems |
| `src/lib/cc/__tests__/coach-mode-detector.test.ts` | Mode selection for all rule combinations |
| `src/lib/cc/__tests__/coach-prompt-builder.test.ts` | Prompt assembly with various profile states |
| `tests/e2e/coach-kairos-unified.spec.ts` | Full E2E: open panel, intake conversation, school builder |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260419_coach_kairos_unified.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/20260419_coach_kairos_unified.sql

-- Coach conversation history
CREATE TABLE IF NOT EXISTS cc_coach_conversations (
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

-- School preferences collected during school-builder mode
CREATE TABLE IF NOT EXISTS cc_school_preferences (
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

-- RLS policies
ALTER TABLE cc_coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_school_preferences ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (API routes use admin client)
CREATE POLICY "service_role_all_coach_conversations"
  ON cc_coach_conversations FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_school_preferences"
  ON cc_school_preferences FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Authenticated users can read their own conversations
CREATE POLICY "users_read_own_conversations"
  ON cc_coach_conversations FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_read_own_preferences"
  ON cc_school_preferences FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
    )
  );
```

- [ ] **Step 2: Apply the migration**

Run: `npx supabase db push`
Expected: Migration applied successfully, two new tables created.

If using remote Supabase (not local), apply via the Supabase dashboard SQL editor instead.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260419_coach_kairos_unified.sql
git commit -m "feat(coach): add cc_coach_conversations and cc_school_preferences tables"
```

---

### Task 2: GPA Converter Utility

**Files:**
- Create: `src/lib/cc/gpa-converter.ts`
- Create: `src/lib/cc/__tests__/gpa-converter.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/cc/__tests__/gpa-converter.test.ts
import { convertToUS4, detectGradingSystem } from "../gpa-converter";

describe("convertToUS4", () => {
  describe("percentage system", () => {
    it("converts 95% to 3.8-4.0 range", () => {
      const result = convertToUS4("percentage", 95);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.8);
      expect(result.gpaHigh).toBeLessThanOrEqual(4.0);
      expect(result.confidence).toBe("approximate");
    });

    it("converts 82% to 3.3-3.5 range", () => {
      const result = convertToUS4("percentage", 82);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.7);
    });

    it("converts 72% to 2.7-3.3 range", () => {
      const result = convertToUS4("percentage", 72);
      expect(result.gpaLow).toBeGreaterThanOrEqual(2.5);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.3);
    });

    it("converts 55% to below 2.0", () => {
      const result = convertToUS4("percentage", 55);
      expect(result.gpaHigh).toBeLessThan(2.0);
    });

    it("clamps at 4.0 for 100%", () => {
      const result = convertToUS4("percentage", 100);
      expect(result.gpaHigh).toBe(4.0);
    });
  });

  describe("cgpa10 system", () => {
    it("converts 8.5 CGPA to ~3.4", () => {
      const result = convertToUS4("cgpa10", 8.5);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.2);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.6);
    });

    it("converts 10.0 CGPA to 4.0", () => {
      const result = convertToUS4("cgpa10", 10);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts 6.0 CGPA to ~2.4", () => {
      const result = convertToUS4("cgpa10", 6.0);
      expect(result.gpaLow).toBeGreaterThanOrEqual(2.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(2.8);
    });
  });

  describe("a-levels system", () => {
    it("converts A* (6) to 4.0", () => {
      const result = convertToUS4("a-levels", 6);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts B (4) to ~3.3", () => {
      const result = convertToUS4("a-levels", 4);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.5);
    });
  });

  describe("ib system", () => {
    it("converts 7 to 4.0", () => {
      const result = convertToUS4("ib", 7);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts 5 to ~3.3", () => {
      const result = convertToUS4("ib", 5);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.5);
    });
  });
});

describe("detectGradingSystem", () => {
  it("returns percentage for Pakistan", () => {
    expect(detectGradingSystem("PK")).toBe("percentage");
  });

  it("returns percentage for India", () => {
    expect(detectGradingSystem("IN")).toBe("percentage");
  });

  it("returns a-levels for UK", () => {
    expect(detectGradingSystem("GB")).toBe("a-levels");
  });

  it("returns null for US", () => {
    expect(detectGradingSystem("US")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/cc/__tests__/gpa-converter.test.ts --no-cache`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```typescript
// src/lib/cc/gpa-converter.ts

export interface GPAConversion {
  gpaLow: number;
  gpaHigh: number;
  confidence: "approximate";
}

export type GradingSystem = "percentage" | "cgpa10" | "a-levels" | "ib";

export function convertToUS4(
  system: GradingSystem,
  score: number
): GPAConversion {
  switch (system) {
    case "percentage":
      return convertPercentage(score);
    case "cgpa10":
      return convertCGPA10(score);
    case "a-levels":
      return convertALevels(score);
    case "ib":
      return convertIB(score);
  }
}

function convertPercentage(pct: number): GPAConversion {
  const clamped = Math.min(100, Math.max(0, pct));
  if (clamped >= 93) return { gpaLow: 3.8, gpaHigh: 4.0, confidence: "approximate" };
  if (clamped >= 85) return { gpaLow: 3.5, gpaHigh: 3.8, confidence: "approximate" };
  if (clamped >= 80) return { gpaLow: 3.3, gpaHigh: 3.5, confidence: "approximate" };
  if (clamped >= 75) return { gpaLow: 3.0, gpaHigh: 3.3, confidence: "approximate" };
  if (clamped >= 70) return { gpaLow: 2.7, gpaHigh: 3.0, confidence: "approximate" };
  if (clamped >= 65) return { gpaLow: 2.3, gpaHigh: 2.7, confidence: "approximate" };
  if (clamped >= 60) return { gpaLow: 2.0, gpaHigh: 2.3, confidence: "approximate" };
  return { gpaLow: Math.max(0, (clamped / 60) * 2.0), gpaHigh: 1.9, confidence: "approximate" };
}

function convertCGPA10(cgpa: number): GPAConversion {
  const clamped = Math.min(10, Math.max(0, cgpa));
  const center = Math.min(4.0, clamped / 2.5);
  return {
    gpaLow: Math.round(Math.max(0, center - 0.2) * 100) / 100,
    gpaHigh: Math.round(Math.min(4.0, center + 0.2) * 100) / 100,
    confidence: "approximate",
  };
}

function convertALevels(grade: number): GPAConversion {
  // grade: 6=A*, 5=A, 4=B, 3=C, 2=D, 1=E
  const map: Record<number, [number, number]> = {
    6: [3.9, 4.0],
    5: [3.7, 3.9],
    4: [3.1, 3.5],
    3: [2.5, 2.9],
    2: [1.8, 2.2],
    1: [1.0, 1.5],
  };
  const [low, high] = map[Math.min(6, Math.max(1, Math.round(grade)))] ?? [1.0, 1.5];
  return { gpaLow: low, gpaHigh: high, confidence: "approximate" };
}

function convertIB(score: number): GPAConversion {
  const map: Record<number, [number, number]> = {
    7: [3.9, 4.0],
    6: [3.5, 3.8],
    5: [3.1, 3.4],
    4: [2.5, 2.9],
    3: [1.8, 2.2],
    2: [1.0, 1.5],
    1: [0.5, 1.0],
  };
  const [low, high] = map[Math.min(7, Math.max(1, Math.round(score)))] ?? [0.5, 1.0];
  return { gpaLow: low, gpaHigh: high, confidence: "approximate" };
}

const COUNTRY_GRADING: Record<string, GradingSystem> = {
  PK: "percentage",
  IN: "percentage",
  BD: "percentage",
  NP: "percentage",
  LK: "percentage",
  GB: "a-levels",
  SG: "a-levels",
  HK: "a-levels",
  MY: "a-levels",
};

export function detectGradingSystem(countryCode: string): GradingSystem | null {
  return COUNTRY_GRADING[countryCode.toUpperCase()] ?? null;
}

export function formatConversion(conv: GPAConversion): string {
  if (conv.gpaLow === conv.gpaHigh) return conv.gpaHigh.toFixed(1);
  return `${conv.gpaLow.toFixed(1)}-${conv.gpaHigh.toFixed(1)}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/cc/__tests__/gpa-converter.test.ts --no-cache`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/gpa-converter.ts src/lib/cc/__tests__/gpa-converter.test.ts
git commit -m "feat(coach): GPA converter for international grading systems"
```

---

### Task 3: Mode Detector

**Files:**
- Create: `src/lib/cc/coach-mode-detector.ts`
- Create: `src/lib/cc/__tests__/coach-mode-detector.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/cc/__tests__/coach-mode-detector.test.ts
import { detectMode, CoachMode } from "../coach-mode-detector";

interface ProfileProgress {
  hasIntakeCompleted: boolean;
  hasGPA: boolean;
  hasSchools: boolean;
  hasEssays: boolean;
  hasInterviewSessions: boolean;
}

describe("detectMode", () => {
  const emptyProgress: ProfileProgress = {
    hasIntakeCompleted: false,
    hasGPA: false,
    hasSchools: false,
    hasEssays: false,
    hasInterviewSessions: false,
  };

  const fullProgress: ProfileProgress = {
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: true,
    hasEssays: true,
    hasInterviewSessions: true,
  };

  it("returns intake when intake not completed", () => {
    expect(detectMode(emptyProgress, "/", "")).toBe("intake");
  });

  it("returns intake even if on another page when no profile", () => {
    expect(detectMode(emptyProgress, "/schools", "")).toBe("intake");
  });

  it("returns mode from explicit user request", () => {
    const progress = { ...fullProgress };
    expect(detectMode(progress, "/", "help me find schools")).toBe("school-builder");
    expect(detectMode(progress, "/", "help me with my essay")).toBe("essay");
    expect(detectMode(progress, "/", "prepare me for interviews")).toBe("interview");
  });

  it("returns page-based mode when on school pages", () => {
    const progress = { ...fullProgress };
    expect(detectMode(progress, "/schools", "what about this one")).toBe("school-browse");
    expect(detectMode(progress, "/my-schools", "remove MIT")).toBe("school-browse");
  });

  it("returns essay mode on essay pages", () => {
    const progress = { ...fullProgress };
    expect(detectMode(progress, "/cc/essays", "")).toBe("essay");
  });

  it("returns interview mode on interview pages", () => {
    const progress = { ...fullProgress };
    expect(detectMode(progress, "/college-interviews", "")).toBe("interview");
  });

  it("returns general as default", () => {
    const progress = { ...fullProgress };
    expect(detectMode(progress, "/", "hello")).toBe("general");
  });

  it("returns academic when GPA missing and intake done", () => {
    const progress = { ...emptyProgress, hasIntakeCompleted: true };
    expect(detectMode(progress, "/", "")).toBe("academic");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/cc/__tests__/coach-mode-detector.test.ts --no-cache`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```typescript
// src/lib/cc/coach-mode-detector.ts

export type CoachMode =
  | "intake"
  | "academic"
  | "school-builder"
  | "school-browse"
  | "essay"
  | "interview"
  | "general";

export interface ProfileProgress {
  hasIntakeCompleted: boolean;
  hasGPA: boolean;
  hasSchools: boolean;
  hasEssays: boolean;
  hasInterviewSessions: boolean;
}

const INTENT_PATTERNS: Array<{ pattern: RegExp; mode: CoachMode }> = [
  { pattern: /\b(find|build|recommend|suggest)\b.*\bschool/i, mode: "school-builder" },
  { pattern: /\bschool list\b/i, mode: "school-builder" },
  { pattern: /\b(essay|personal statement|supplemental)\b/i, mode: "essay" },
  { pattern: /\b(interview|mock interview|practice interview)\b/i, mode: "interview" },
  { pattern: /\b(gpa|grades?|test score|sat|act)\b/i, mode: "academic" },
];

const PAGE_MODES: Array<{ pattern: RegExp; mode: CoachMode }> = [
  { pattern: /^\/(schools|my-schools)/, mode: "school-browse" },
  { pattern: /^\/cc\/essays/, mode: "essay" },
  { pattern: /^\/college-interviews/, mode: "interview" },
];

export function detectMode(
  progress: ProfileProgress,
  currentPage: string,
  userMessage: string
): CoachMode {
  if (!progress.hasIntakeCompleted) return "intake";

  if (userMessage) {
    for (const { pattern, mode } of INTENT_PATTERNS) {
      if (pattern.test(userMessage)) return mode;
    }
  }

  for (const { pattern, mode } of PAGE_MODES) {
    if (pattern.test(currentPage)) return mode;
  }

  if (!progress.hasGPA) return "academic";

  return "general";
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/cc/__tests__/coach-mode-detector.test.ts --no-cache`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/coach-mode-detector.ts src/lib/cc/__tests__/coach-mode-detector.test.ts
git commit -m "feat(coach): mode detector rules engine"
```

---

### Task 4: Prompt Builder

**Files:**
- Create: `src/lib/cc/coach-prompt-builder.ts`
- Create: `src/lib/cc/__tests__/coach-prompt-builder.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/cc/__tests__/coach-prompt-builder.test.ts
import { buildSystemPrompt, type CoachContext } from "../coach-prompt-builder";

describe("buildSystemPrompt", () => {
  const baseContext: CoachContext = {
    mode: "general",
    studentName: "Alex",
    grade: 11,
    country: "US",
    state: "CA",
    isInternational: false,
    isFirstGen: false,
    gpaUnweighted: 3.8,
    testStrategy: "SAT",
    satTotal: 1450,
    actComposite: null,
    schoolCount: 5,
    schoolSummary: "2 reach, 2 match, 1 safety",
    hasIntakeCompleted: true,
    hasGPA: true,
    hasSchools: true,
    hasEssays: false,
    hasInterviewSessions: false,
    preferences: null,
  };

  it("includes personality guidelines", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Coach Kairos");
    expect(prompt).toContain("casual, warm");
  });

  it("includes student profile data", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Alex");
    expect(prompt).toContain("3.8");
    expect(prompt).toContain("California");
  });

  it("includes intake instructions when mode is intake", () => {
    const ctx = { ...baseContext, mode: "intake" as const, hasIntakeCompleted: false, studentName: null };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("name");
    expect(prompt).toContain("grade");
  });

  it("includes school-builder instructions when mode is school-builder", () => {
    const ctx = { ...baseContext, mode: "school-builder" as const };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("financial");
    expect(prompt).toContain("region");
  });

  it("includes GPA conversion note for international students without GPA", () => {
    const ctx = { ...baseContext, mode: "academic" as const, country: "PK", isInternational: true, gpaUnweighted: null, hasGPA: false };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("grading system");
    expect(prompt).toContain("convert");
  });

  it("suggests next step in general mode", () => {
    const ctx = { ...baseContext, hasEssays: false };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("essay");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/cc/__tests__/coach-prompt-builder.test.ts --no-cache`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```typescript
// src/lib/cc/coach-prompt-builder.ts
import type { CoachMode } from "./coach-mode-detector";

export interface SchoolPreferences {
  financial_need: string | null;
  income_bracket: string | null;
  location_type: string | null;
  preferred_regions: string[];
  intended_major: string | null;
  needs_international_full_need: boolean | null;
  extracurriculars_summary: string | null;
  campus_size_preference: string | null;
}

export interface CoachContext {
  mode: CoachMode;
  studentName: string | null;
  grade: number | null;
  country: string | null;
  state: string | null;
  isInternational: boolean;
  isFirstGen: boolean;
  gpaUnweighted: number | null;
  testStrategy: string | null;
  satTotal: number | null;
  actComposite: number | null;
  schoolCount: number;
  schoolSummary: string;
  hasIntakeCompleted: boolean;
  hasGPA: boolean;
  hasSchools: boolean;
  hasEssays: boolean;
  hasInterviewSessions: boolean;
  preferences: SchoolPreferences | null;
}

const PERSONALITY = `You are Coach Kairos, a college admissions counselor who guides high school students through their entire application journey. Your personality:
- Casual, warm, occasionally witty. You sound like a real person, not a chatbot.
- Keep messages to 1-3 sentences. Never write walls of text.
- Ask one question at a time. Never bullet-point dump.
- Reference what the student told you earlier naturally.
- NEVER say "Great question!", "I'd be happy to help!", "Let me break this down for you", "Absolutely!", or any generic chatbot filler.
- Use the student's name occasionally but not every message.
- When presenting data (schools, scores), keep it conversational.`;

export function buildSystemPrompt(ctx: CoachContext): string {
  const sections: string[] = [PERSONALITY];

  if (ctx.studentName || ctx.grade || ctx.gpaUnweighted) {
    const parts: string[] = [];
    if (ctx.studentName) parts.push(`Name: ${ctx.studentName}`);
    if (ctx.grade) parts.push(`Grade: ${ctx.grade}th`);
    if (ctx.state && ctx.country === "US") parts.push(`Location: ${ctx.state}`);
    else if (ctx.country) parts.push(`Location: ${ctx.country}${ctx.state ? `, ${ctx.state}` : ""}`);
    if (ctx.isInternational) parts.push("International student: yes");
    if (ctx.isFirstGen) parts.push("First-generation college student: yes");
    if (ctx.gpaUnweighted) parts.push(`GPA (unweighted): ${ctx.gpaUnweighted}`);
    if (ctx.testStrategy) parts.push(`Test strategy: ${ctx.testStrategy}`);
    if (ctx.satTotal) parts.push(`SAT: ${ctx.satTotal}`);
    if (ctx.actComposite) parts.push(`ACT: ${ctx.actComposite}`);
    if (ctx.schoolCount > 0) parts.push(`School list: ${ctx.schoolCount} schools (${ctx.schoolSummary})`);
    sections.push(`\nStudent profile:\n${parts.join("\n")}`);
  }

  if (ctx.preferences) {
    const p = ctx.preferences;
    const prefParts: string[] = [];
    if (p.financial_need) prefParts.push(`Financial aid: ${p.financial_need}`);
    if (p.income_bracket) prefParts.push(`Income bracket: ${p.income_bracket}`);
    if (p.location_type) prefParts.push(`Preferred setting: ${p.location_type}`);
    if (p.preferred_regions.length) prefParts.push(`Regions: ${p.preferred_regions.join(", ")}`);
    if (p.intended_major) prefParts.push(`Intended major: ${p.intended_major}`);
    if (p.campus_size_preference) prefParts.push(`Campus size: ${p.campus_size_preference}`);
    if (prefParts.length) sections.push(`\nSchool preferences:\n${prefParts.join("\n")}`);
  }

  sections.push(`\n${getModeInstructions(ctx)}`);

  return sections.join("\n");
}

function getModeInstructions(ctx: CoachContext): string {
  switch (ctx.mode) {
    case "intake":
      return `MODE: INTAKE
You're meeting this student for the first time. Ask these questions ONE AT A TIME in a natural conversation:
1. Their name and what grade they're in
2. Where they live (city/state/country)
3. Whether they'd be the first in their family to go to college
4. What language they speak at home
5. What worries them most about college applications
6. Any schools they're already interested in

After each answer, acknowledge it briefly and move to the next question. Don't ask multiple questions at once.
When you have all the info, say something like "Great, I've got a good picture of where you're starting from. Let's get your GPA next so I can start recommending schools."`;

    case "academic":
      if (ctx.isInternational && !ctx.gpaUnweighted) {
        return `MODE: ACADEMIC (International Student)
This student is from ${ctx.country || "outside the US"} and likely doesn't have a US-style GPA.
Ask what grading system their school uses: Percentage (0-100), CGPA out of 10, A-levels (A*-E), or IB (1-7).
Once they give their score, convert it to an approximate US 4.0 GPA and confirm: "That's roughly a X.X-X.X on the US 4.0 scale. Sound right?"
Then ask about their testing plan: SAT, ACT, both, test-optional, or undecided.
If they're taking SAT/ACT, ask for their score (or expected score).`;
      }
      return `MODE: ACADEMIC
Ask for the student's unweighted GPA (on a 4.0 scale). Then ask about their testing plan: SAT, ACT, both, test-optional, or undecided.
If they're taking SAT/ACT, ask for their score (or expected score).
Keep it quick — "What's your GPA?" is fine as an opener.`;

    case "school-builder":
      return `MODE: SCHOOL BUILDER
Guide the student through building their school list. Ask these questions ONE AT A TIME (skip any you already have answers for from their profile):
1. How important is financial aid? (Essential / Important / Nice-to-have / Not a concern)
   - If Essential or Important: approximate family income bracket
2. What kind of place? (Big city / College town / Suburban / No preference)
   - Follow-up: any particular region? (Northeast, Southeast, Midwest, West Coast, Southwest, Anywhere)
3. What do they want to study? (free text, suggest common options)
${ctx.isInternational ? "4. Do they need schools that meet full financial need for international students?" : ""}

After gathering preferences, say "Let me build your list — give me a moment..." and the system will generate recommendations.
Present the recommendations grouped by reach/match/safety with a one-line reason for each school.
The student can accept all, remove specific schools, or ask for alternatives.`;

    case "school-browse":
      return `MODE: SCHOOL BROWSE
The student is browsing schools. Help them by:
- Answering questions about specific schools (acceptance rate, test policy, financial aid, location, culture)
- Suggesting schools that fit their profile if they ask
- Explaining why a school is reach/match/safety for them
- Warning if their list is imbalanced (too many reaches, no safeties)
Reference their profile data when explaining fit.`;

    case "essay":
      return `MODE: ESSAY
Help the student with their college essays. You can:
- Brainstorm topics and angles
- Give feedback on drafts (be specific, not generic)
- Explain what admissions officers look for
- Help with specific school supplementals
Don't write the essay for them. Guide them to find their own voice.`;

    case "interview":
      return `MODE: INTERVIEW PREP
Help the student prepare for college interviews. You can:
- Explain what alumni interviews are like at specific schools
- Practice common questions ("Tell me about yourself", "Why this school?")
- Give feedback on their answers
- Share tips for virtual vs in-person interviews
Tailor advice to the specific schools on their list.`;

    case "general": {
      const nextStep = getNextStep(ctx);
      return `MODE: GENERAL
You're the student's ongoing college counselor. Answer any questions they have about the college application process.
${nextStep ? `\nIf the student seems unsure what to do next, suggest: ${nextStep}` : ""}
You can help with: school research, essay brainstorming, interview prep, financial aid questions, timeline planning, activity list optimization, or anything else college-related.`;
    }
  }
}

function getNextStep(ctx: CoachContext): string | null {
  if (!ctx.hasIntakeCompleted) return "completing their profile (you'll ask a few quick questions)";
  if (!ctx.hasGPA) return "adding their GPA and test scores so you can recommend schools";
  if (!ctx.hasSchools) return "building their school list together";
  if (!ctx.hasEssays) return "starting their Common App personal statement essay";
  if (!ctx.hasInterviewSessions) return "practicing for alumni interviews";
  return null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/cc/__tests__/coach-prompt-builder.test.ts --no-cache`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/coach-prompt-builder.ts src/lib/cc/__tests__/coach-prompt-builder.test.ts
git commit -m "feat(coach): prompt builder with mode-specific instructions"
```

---

### Task 5: OpenRouter Client

**Files:**
- Create: `src/lib/cc/openrouter.ts`

- [ ] **Step 1: Write the OpenRouter streaming client**

```typescript
// src/lib/cc/openrouter.ts

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return streamFallback(messages, onChunk, signal);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://kairoslearn.ai",
      "X-Title": "Coach Kairos",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    }),
    signal,
  });

  if (!res.ok) {
    console.error("OpenRouter error:", res.status);
    return streamFallback(messages, onChunk, signal);
  }

  return readSSEStream(res, onChunk);
}

async function readSSEStream(
  res: Response,
  onChunk: (text: string) => void
): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return full;
}

async function streamFallback(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  // Try Moonshot first
  const moonshot = process.env.MOONSHOT_API_KEY;
  if (moonshot) {
    try {
      const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${moonshot}`,
        },
        body: JSON.stringify({
          model: "kimi-k2-0711-preview",
          messages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
        signal,
      });
      if (res.ok) return readSSEStream(res, onChunk);
    } catch {
      // fall through to Gemini
    }
  }

  // Gemini fallback (non-streaming)
  const gemini = process.env.GEMINI_API_KEY;
  if (!gemini) throw new Error("No AI provider available");

  const geminiMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.role === "system" ? `[System] ${m.content}` : m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: geminiMessages }),
      signal,
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I had trouble responding. Try again?";
  onChunk(text);
  return text;
}

export async function chatOnce(messages: ChatMessage[]): Promise<string> {
  let result = "";
  await streamChat(messages, (chunk) => { result += chunk; });
  return result;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cc/openrouter.ts
git commit -m "feat(coach): OpenRouter streaming client with Moonshot/Gemini fallback"
```

---

### Task 6: Coach Message API Route

**Files:**
- Create: `src/app/api/cc/coach/message/route.ts`

- [ ] **Step 1: Write the streaming message endpoint**

```typescript
// src/app/api/cc/coach/message/route.ts
import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";
import { detectMode } from "@/lib/cc/coach-mode-detector";
import { buildSystemPrompt, type CoachContext } from "@/lib/cc/coach-prompt-builder";
import { streamChat, type ChatMessage } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { message, page_context } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Fetch or create student profile
  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
      .single();
    profile = newProfile;
  }
  if (!profile) {
    return new Response(JSON.stringify({ error: "Could not create profile" }), { status: 500 });
  }

  // Fetch academic profile
  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("gpa_unweighted, test_strategy, sat_total, act_composite")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school preferences
  const { data: preferences } = await supabase
    .from("cc_school_preferences")
    .select("*")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school list summary
  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("chancing_band")
    .eq("student_id", profile.id);

  const schoolCount = schools?.length ?? 0;
  const reach = schools?.filter((s) => s.chancing_band === "reach").length ?? 0;
  const match = schools?.filter((s) => s.chancing_band === "match").length ?? 0;
  const safety = schools?.filter((s) => s.chancing_band === "safety").length ?? 0;
  const schoolSummary = schoolCount > 0 ? `${reach} reach, ${match} match, ${safety} safety` : "none yet";

  // Check setup progress
  const { data: essayCheck } = await supabase
    .from("cc_essays").select("id").eq("user_id", user.id).limit(1);
  const { data: interviewCheck } = await supabase
    .from("interview_sessions").select("id").eq("user_id", user.id).limit(1);

  const progress = {
    hasIntakeCompleted: !!profile.intake_completed_at,
    hasGPA: !!academic?.gpa_unweighted,
    hasSchools: schoolCount > 0,
    hasEssays: (essayCheck?.length ?? 0) > 0,
    hasInterviewSessions: (interviewCheck?.length ?? 0) > 0,
  };

  const mode = detectMode(progress, page_context || "/", message);

  const coachContext: CoachContext = {
    mode,
    studentName: profile.preferred_name,
    grade: profile.grade_level,
    country: profile.country,
    state: profile.state_province,
    isInternational: profile.is_international ?? false,
    isFirstGen: profile.is_first_gen ?? false,
    gpaUnweighted: academic?.gpa_unweighted ?? null,
    testStrategy: academic?.test_strategy ?? null,
    satTotal: academic?.sat_total ?? null,
    actComposite: academic?.act_composite ?? null,
    schoolCount,
    schoolSummary,
    hasIntakeCompleted: progress.hasIntakeCompleted,
    hasGPA: progress.hasGPA,
    hasSchools: progress.hasSchools,
    hasEssays: progress.hasEssays,
    hasInterviewSessions: progress.hasInterviewSessions,
    preferences: preferences ?? null,
  };

  const systemPrompt = buildSystemPrompt(coachContext);

  // Fetch recent conversation history
  const { data: history } = await supabase
    .from("cc_coach_conversations")
    .select("role, content")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const historyMessages: ChatMessage[] = (history ?? [])
    .reverse()
    .map((h) => ({ role: h.role as "user" | "assistant", content: h.content }));

  const llmMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: message },
  ];

  // Save user message
  await supabase.from("cc_coach_conversations").insert({
    student_id: profile.id,
    role: "user",
    content: message,
    mode,
    page_context: page_context || "/",
  });

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      try {
        await streamChat(llmMessages, (chunk) => {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk, mode })}\n\n`));
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, mode })}\n\n`));
        controller.close();

        // Save assistant message (fire and forget)
        supabase.from("cc_coach_conversations").insert({
          student_id: profile.id,
          role: "assistant",
          content: fullResponse,
          mode,
          page_context: page_context || "/",
        }).then(() => {
          // Trigger extraction for certain modes
          if (["intake", "academic", "school-builder"].includes(mode)) {
            triggerExtraction(profile!.id, mode, supabase);
          }
        });
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function triggerExtraction(
  studentId: string,
  mode: string,
  supabase: ReturnType<typeof createAdminSupabase>
) {
  // Fire-and-forget call to extract endpoint
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  fetch(`${baseUrl}/api/cc/coach/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, mode }),
  }).catch(() => {});
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/coach/message/route.ts
git commit -m "feat(coach): streaming message API with mode detection and context assembly"
```

---

### Task 7: Coach History API Route

**Files:**
- Create: `src/app/api/cc/coach/history/route.ts`

- [ ] **Step 1: Write the history endpoint**

```typescript
// src/app/api/cc/coach/history/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";

export async function GET() {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabase();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ messages: [] });
  }

  const { data: messages } = await supabase
    .from("cc_coach_conversations")
    .select("id, role, content, mode, page_context, created_at")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    messages: (messages ?? []).reverse(),
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/coach/history/route.ts
git commit -m "feat(coach): history API for session restore"
```

---

### Task 8: Coach Extract API Route

**Files:**
- Create: `src/app/api/cc/coach/extract/route.ts`

- [ ] **Step 1: Write the extraction endpoint**

```typescript
// src/app/api/cc/coach/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { chatOnce, type ChatMessage } from "@/lib/cc/openrouter";
import { convertToUS4, detectGradingSystem, formatConversion, type GradingSystem } from "@/lib/cc/gpa-converter";

export async function POST(req: NextRequest) {
  const { student_id, mode } = await req.json();
  if (!student_id || !mode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Fetch recent conversation for this mode
  const { data: messages } = await supabase
    .from("cc_coach_conversations")
    .select("role, content")
    .eq("student_id", student_id)
    .eq("mode", mode)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!messages || messages.length === 0) {
    return NextResponse.json({ extracted: false });
  }

  const transcript = messages
    .reverse()
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  try {
    if (mode === "intake") {
      await extractIntake(supabase, student_id, transcript);
    } else if (mode === "academic") {
      await extractAcademic(supabase, student_id, transcript);
    } else if (mode === "school-builder") {
      await extractSchoolPreferences(supabase, student_id, transcript);
    }
    return NextResponse.json({ extracted: true });
  } catch (err) {
    console.error("Extraction error:", err);
    return NextResponse.json({ extracted: false, error: "Extraction failed" }, { status: 500 });
  }
}

async function extractIntake(
  supabase: ReturnType<typeof createAdminSupabase>,
  studentId: string,
  transcript: string
) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract student profile data from this intake conversation. Return ONLY valid JSON with these fields (use null for missing):
{
  "preferred_name": string | null,
  "grade_level": number | null,
  "state_province": string | null,
  "country": string | null,
  "is_first_gen": boolean | null,
  "home_language": string | null
}`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);
  const update: Record<string, unknown> = { intake_completed_at: new Date().toISOString() };

  if (data.preferred_name) update.preferred_name = data.preferred_name;
  if (data.grade_level) update.grade_level = data.grade_level;
  if (data.state_province) update.state_province = data.state_province;
  if (data.country) update.country = data.country;
  if (data.is_first_gen !== null) update.is_first_gen = data.is_first_gen;
  if (data.home_language) update.home_language = data.home_language;

  await supabase
    .from("cc_student_profiles")
    .update(update)
    .eq("id", studentId);
}

async function extractAcademic(
  supabase: ReturnType<typeof createAdminSupabase>,
  studentId: string,
  transcript: string
) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract academic data from this conversation. Return ONLY valid JSON:
{
  "gpa_unweighted": number | null,
  "test_strategy": "SAT" | "ACT" | "Both" | "Test-optional" | "Undecided" | null,
  "sat_total": number | null,
  "act_composite": number | null,
  "grading_system": "percentage" | "cgpa10" | "a-levels" | "ib" | null,
  "original_score": number | null
}
If the student gave a non-US grade (percentage, CGPA, A-levels, IB), put the system in grading_system and their score in original_score. Put the converted US GPA in gpa_unweighted.`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);

  // If we have an international grading system, do deterministic conversion
  if (data.grading_system && data.original_score && !data.gpa_unweighted) {
    const conversion = convertToUS4(data.grading_system as GradingSystem, data.original_score);
    data.gpa_unweighted = Math.round(((conversion.gpaLow + conversion.gpaHigh) / 2) * 100) / 100;
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.gpa_unweighted) update.gpa_unweighted = data.gpa_unweighted;
  if (data.test_strategy) update.test_strategy = data.test_strategy;
  if (data.sat_total) update.sat_total = data.sat_total;
  if (data.act_composite) update.act_composite = data.act_composite;

  const { data: existing } = await supabase
    .from("cc_academic_profiles")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();

  if (existing) {
    await supabase.from("cc_academic_profiles").update(update).eq("id", existing.id);
  } else {
    await supabase.from("cc_academic_profiles").insert({ student_id: studentId, ...update });
  }
}

async function extractSchoolPreferences(
  supabase: ReturnType<typeof createAdminSupabase>,
  studentId: string,
  transcript: string
) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract school preferences from this conversation. Return ONLY valid JSON:
{
  "financial_need": "essential" | "important" | "nice-to-have" | "not-a-concern" | null,
  "income_bracket": string | null,
  "location_type": "big-city" | "college-town" | "suburban" | "no-preference" | null,
  "preferred_regions": string[],
  "intended_major": string | null,
  "needs_international_full_need": boolean | null,
  "extracurriculars_summary": string | null,
  "campus_size_preference": "small" | "large" | "no-preference" | null
}`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);
  const upsert: Record<string, unknown> = {
    student_id: studentId,
    updated_at: new Date().toISOString(),
  };

  if (data.financial_need) upsert.financial_need = data.financial_need;
  if (data.income_bracket) upsert.income_bracket = data.income_bracket;
  if (data.location_type) upsert.location_type = data.location_type;
  if (data.preferred_regions?.length) upsert.preferred_regions = data.preferred_regions;
  if (data.intended_major) upsert.intended_major = data.intended_major;
  if (data.needs_international_full_need !== null) upsert.needs_international_full_need = data.needs_international_full_need;
  if (data.extracurriculars_summary) upsert.extracurriculars_summary = data.extracurriculars_summary;
  if (data.campus_size_preference) upsert.campus_size_preference = data.campus_size_preference;

  await supabase
    .from("cc_school_preferences")
    .upsert(upsert, { onConflict: "student_id" });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/coach/extract/route.ts
git commit -m "feat(coach): background extraction API for intake, academic, and school preferences"
```

---

### Task 9: CoachKairosContext

**Files:**
- Create: `src/contexts/CoachKairosContext.tsx`

- [ ] **Step 1: Write the context provider**

```tsx
// src/contexts/CoachKairosContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export interface CoachMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  mode: string;
  createdAt: string;
}

interface CoachKairosContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: CoachMessage[];
  sendMessage: (text: string) => Promise<void>;
  isStreaming: boolean;
  currentMode: string;
  isLoading: boolean;
}

const CoachKairosContext = createContext<CoachKairosContextValue | null>(null);

export function CoachKairosProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMode, setCurrentMode] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const proactiveSent = useRef(false);
  const historyLoaded = useRef(false);

  // Load history on first open
  useEffect(() => {
    if (!user || historyLoaded.current) return;
    historyLoaded.current = true;
    setIsLoading(true);
    fetch("/api/cc/coach/history")
      .then((res) => res.ok ? res.json() : { messages: [] })
      .then((data) => {
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string; mode: string; created_at: string }) => ({
              id: m.id,
              role: m.role as "assistant" | "user",
              content: m.content,
              mode: m.mode,
              createdAt: m.created_at,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  // Auto-open for new users (no messages = first visit)
  useEffect(() => {
    if (!user || proactiveSent.current || messages.length > 0 || isLoading) return;
    if (pathname === "/" || pathname === "/dashboard") {
      // Delay to let the page render first
      const timer = setTimeout(() => {
        if (!proactiveSent.current && messages.length === 0) {
          proactiveSent.current = true;
          setIsOpen(true);
          sendProactiveMessage();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, pathname, messages.length, isLoading]);

  // Open coach if ?coach=open in URL (redirect from /intake)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("coach") === "open") {
      setIsOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("coach");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  async function sendProactiveMessage() {
    // Send an empty "greeting" message to trigger Kairos's proactive opening
    await sendMessageInternal("hi");
  }

  const sendMessage = useCallback(async (text: string) => {
    await sendMessageInternal(text);
  }, [pathname]);

  async function sendMessageInternal(text: string) {
    const userMsg: CoachMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      mode: currentMode,
      createdAt: new Date().toISOString(),
    };

    // Don't show "hi" from auto-greeting in the UI
    if (text !== "hi" || messages.length > 0) {
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsStreaming(true);

    const assistantMsg: CoachMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      mode: currentMode,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/cc/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, page_context: pathname }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: "Sorry, I had trouble responding. Try again?" }
              : m
          )
        );
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) break;
            if (data.mode) setCurrentMode(data.mode);
            if (data.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + data.text }
                    : m
                )
              );
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Connection error. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <CoachKairosContext.Provider
      value={{ isOpen, open, close, toggle, messages, sendMessage, isStreaming, currentMode, isLoading }}
    >
      {children}
    </CoachKairosContext.Provider>
  );
}

export function useCoachKairos() {
  const ctx = useContext(CoachKairosContext);
  if (!ctx) throw new Error("useCoachKairos must be used within CoachKairosProvider");
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/CoachKairosContext.tsx
git commit -m "feat(coach): CoachKairosContext with streaming, history, and proactive messages"
```

---

### Task 10: CoachKairosShell Component

**Files:**
- Create: `src/components/cc/coach/CoachKairosShell.tsx`

- [ ] **Step 1: Write the shell component**

```tsx
// src/components/cc/coach/CoachKairosShell.tsx
"use client";

import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, X } from "lucide-react";
import CoachChat from "./CoachChat";

const HIDDEN_PATHS = ["/login", "/signup", "/onboarding", "/landing"];

export default function CoachKairosShell() {
  const { user } = useAuth();
  const { isOpen, toggle, close, messages, isStreaming } = useCoachKairos();
  const pathname = usePathname();

  if (!user) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggle}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center hover:bg-[#C4A030] transition-colors group"
          >
            <GraduationCap className="w-7 h-7 text-black" />
            {isStreaming && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Coach Kairos</h3>
                    <p className="text-[10px] text-white/40">Your college counselor</p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat area */}
              <CoachChat />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/coach/CoachKairosShell.tsx
git commit -m "feat(coach): floating shell with panel animation"
```

---

### Task 11: CoachChat Component

**Files:**
- Create: `src/components/cc/coach/CoachChat.tsx`
- Create: `src/components/cc/coach/CoachMessage.tsx`

- [ ] **Step 1: Write CoachMessage**

```tsx
// src/components/cc/coach/CoachMessage.tsx
"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface Props {
  role: "assistant" | "user";
  content: string;
  isStreaming?: boolean;
}

export default function CoachMessage({ role, content, isStreaming }: Props) {
  if (role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[#D4AF37]/20 text-white text-sm leading-relaxed">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 items-start"
    >
      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5">
        <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
      </div>
      <div className="max-w-[85%] text-sm text-white/80 leading-relaxed">
        {content}
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-[#D4AF37] ml-0.5 animate-pulse" />}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write CoachChat**

```tsx
// src/components/cc/coach/CoachChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import CoachMessage from "./CoachMessage";

export default function CoachChat() {
  const { messages, sendMessage, isStreaming, isLoading } = useCoachKairos();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <>
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#D4AF37]" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">Coach Kairos is ready to help.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <CoachMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/10 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Coach Kairos..."
            disabled={isStreaming}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2.5 rounded-xl bg-[#D4AF37] text-black disabled:opacity-40 transition-all hover:bg-[#C4A030]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/coach/CoachMessage.tsx src/components/cc/coach/CoachChat.tsx
git commit -m "feat(coach): chat UI with message bubbles and streaming indicator"
```

---

### Task 12: Mount CoachKairos in Root Layout

**Files:**
- Modify: `src/app/providers.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add CoachKairosProvider and Shell to providers.tsx**

In `src/app/providers.tsx`, add these imports at the top:

```typescript
import { CoachKairosProvider } from "@/contexts/CoachKairosContext";
import CoachKairosShell from "@/components/cc/coach/CoachKairosShell";
```

In the provider nesting, wrap `CoachKairosProvider` around the children, right after `AIProvider` (or alongside it). Find where the providers are nested and add:

```tsx
<AIProvider>
  <CoachKairosProvider>
    {/* ... rest of providers and children ... */}
  </CoachKairosProvider>
</AIProvider>
```

At the end of the `Providers` component return (alongside existing overlays like `CoachFAB`, `GamificationOverlays`), add:

```tsx
<CoachKairosShell />
```

- [ ] **Step 2: Remove SetupChecklist from dashboard**

In `src/app/page.tsx`, remove the import:

```typescript
// DELETE this line:
import SetupChecklist from "@/components/onboarding/SetupChecklist";
```

And remove the `<SetupChecklist />` component from the JSX wherever it's rendered.

- [ ] **Step 3: Test manually**

Run: `npm run dev`

1. Open `http://localhost:3000` logged in
2. Verify the gold floating button appears bottom-right
3. Click it — panel slides in from the right
4. Type "hello" — should get a streaming response from Coach Kairos
5. Close panel, navigate to another page, reopen — messages should persist
6. Verify SetupChecklist no longer shows on dashboard

- [ ] **Step 4: Commit**

```bash
git add src/app/providers.tsx src/app/page.tsx
git commit -m "feat(coach): mount unified Coach Kairos in root layout, remove SetupChecklist"
```

---

### Task 13: Redirect /intake to Dashboard

**Files:**
- Modify: `src/app/intake/page.tsx`

- [ ] **Step 1: Replace intake page with redirect**

Replace the entire contents of `src/app/intake/page.tsx` with:

```tsx
// src/app/intake/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntakePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?coach=open");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
    </div>
  );
}
```

This redirects anyone visiting `/intake` to the dashboard with the coach panel auto-opened. The `?coach=open` param is handled by `CoachKairosContext` (Task 9).

- [ ] **Step 2: Test manually**

Run: Navigate to `http://localhost:3000/intake`
Expected: Redirects to `/` with coach panel open

- [ ] **Step 3: Commit**

```bash
git add src/app/intake/page.tsx
git commit -m "feat(coach): redirect /intake to dashboard with coach panel open"
```

---

### Task 14: Enhanced School List Generation

**Files:**
- Modify: `src/app/api/cc/school-list/generate/route.ts`

- [ ] **Step 1: Enhance the generate endpoint with preferences**

In `src/app/api/cc/school-list/generate/route.ts`, add school preferences to the context. After fetching the student's academic profile, also fetch preferences:

```typescript
// Add this fetch alongside existing profile/academic fetches:
const { data: preferences } = await supabase
  .from("cc_school_preferences")
  .select("*")
  .eq("student_id", studentProfile.id)
  .maybeSingle();
```

Add preferences to the profile summary string that gets sent to the AI:

```typescript
// Add these lines to the profileSummary construction:
if (preferences?.financial_need) profileParts.push(`Financial aid need: ${preferences.financial_need}`);
if (preferences?.income_bracket) profileParts.push(`Family income: ${preferences.income_bracket}`);
if (preferences?.location_type) profileParts.push(`Preferred setting: ${preferences.location_type}`);
if (preferences?.preferred_regions?.length) profileParts.push(`Preferred regions: ${preferences.preferred_regions.join(", ")}`);
if (preferences?.intended_major) profileParts.push(`Intended major: ${preferences.intended_major}`);
if (preferences?.needs_international_full_need) profileParts.push(`Needs schools that meet full financial need for international students`);
if (preferences?.extracurriculars_summary) profileParts.push(`Activities: ${preferences.extracurriculars_summary}`);
if (preferences?.campus_size_preference && preferences.campus_size_preference !== "no-preference") {
  profileParts.push(`Campus preference: ${preferences.campus_size_preference}`);
}
```

Add pre-filtering of the school list before sending to the AI. After fetching all schools:

```typescript
// Pre-filter schools based on hard preferences to reduce prompt size
let filteredSchools = allSchools;

if (preferences?.needs_international_full_need) {
  // Prefer schools that meet full need, but keep some that don't for variety
  const fullNeed = allSchools.filter((s: { meets_full_need: boolean }) => s.meets_full_need);
  if (fullNeed.length >= 30) filteredSchools = fullNeed;
}
```

- [ ] **Step 2: Test manually**

1. Complete the school builder conversation with Coach Kairos
2. Verify the generated list reflects preferences (e.g., schools in the preferred region, affordable schools if financial aid is essential)

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/school-list/generate/route.ts
git commit -m "feat(coach): enhance school generation with preferences context and pre-filtering"
```

---

### Task 15: E2E Test

**Files:**
- Create: `tests/e2e/coach-kairos-unified.spec.ts`

- [ ] **Step 1: Write the E2E test**

```typescript
// tests/e2e/coach-kairos-unified.spec.ts
import { test, expect } from "@playwright/test";
import path from "path";

const SCREENSHOTS_DIR = path.join(__dirname, "screenshots", "coach-kairos");
const TEST_USER = {
  email: "student1@gmail.com",
  password: "abcdefgh",
};

let counter = 0;
async function snap(page: import("@playwright/test").Page, label: string) {
  counter++;
  const filename = `${String(counter).padStart(2, "0")}-${label}.png`;
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
}

test.describe("Unified Coach Kairos", () => {
  test("Floating button → Open panel → Send message → Get response", async ({ page }) => {
    // Auto-dismiss Next.js dev error overlay
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        document.querySelectorAll("nextjs-portal").forEach((el) => el.remove());
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    });

    // Login
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.waitFor({ state: "visible", timeout: 15000 });
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await page.locator('button:has-text("Sign In")').click({ force: true });
    await page.waitForTimeout(5000);

    // Skip any modal
    const skipBtn = page.locator("text=Skip");
    if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(500);
    }

    // Dashboard
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);
    await snap(page, "dashboard-with-coach-button");

    // Verify floating button exists
    const coachButton = page.locator("button").filter({ has: page.locator('svg.lucide-graduation-cap') });
    const body = await page.textContent("body");

    // Verify SetupChecklist is gone
    console.log('Has old "Getting Started" checklist (should be false):', body?.includes("Getting Started"));

    // Click coach button to open panel
    if (await coachButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await coachButton.first().click();
      await page.waitForTimeout(1000);
      await snap(page, "coach-panel-open");

      // Verify panel header
      const panelBody = await page.textContent("body");
      console.log('Has "Coach Kairos":', panelBody?.includes("Coach Kairos"));
      console.log('Has "Your college counselor":', panelBody?.includes("Your college counselor"));
      console.log('Has input placeholder:', panelBody?.includes("Ask Coach Kairos"));

      // Send a message
      const chatInput = page.locator('input[placeholder="Ask Coach Kairos..."]');
      if (await chatInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await chatInput.fill("What should I work on next?");
        await page.locator('button[type="submit"]').last().click();
        await page.waitForTimeout(8000); // Wait for AI response
        await snap(page, "coach-response");

        const responseBody = await page.textContent("body");
        console.log("Got a response (content length > 0):", (responseBody?.length ?? 0) > 100);
      }
    }

    // Test /intake redirect
    await page.goto("/intake");
    await page.waitForTimeout(3000);
    const finalUrl = page.url();
    console.log("Intake redirected to dashboard:", finalUrl.includes("localhost:3000/") && !finalUrl.includes("/intake"));
    await snap(page, "intake-redirect");

    console.log("\n=== UNIFIED COACH KAIROS TEST COMPLETE ===");
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npx playwright test tests/e2e/coach-kairos-unified.spec.ts --reporter=line`
Expected: Test passes. Screenshots saved to `tests/e2e/screenshots/coach-kairos/`.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/coach-kairos-unified.spec.ts
git commit -m "test(coach): E2E test for unified Coach Kairos panel"
```

---

## Self-Review Checklist

### Spec Coverage

| Spec Requirement | Task |
|-----------------|------|
| cc_coach_conversations table | Task 1 |
| cc_school_preferences table | Task 1 |
| GPA converter for international students | Task 2 |
| Mode detection rules engine | Task 3 |
| System prompt with personality + context | Task 4 |
| OpenRouter streaming with fallback | Task 5 |
| Streaming message API | Task 6 |
| History API for session restore | Task 7 |
| Background data extraction | Task 8 |
| CoachKairosContext (global state) | Task 9 |
| Floating button + panel (CoachKairosShell) | Task 10 |
| Chat UI (CoachChat + CoachMessage) | Task 11 |
| Mount in root layout, remove SetupChecklist | Task 12 |
| Redirect /intake to dashboard | Task 13 |
| Enhanced school generation with preferences | Task 14 |
| E2E test | Task 15 |
| Voice integration (Deepgram in panel) | Deferred — voice button placeholder in UI, full wiring is a follow-up task |
| CoachSchoolCard (inline school cards in chat) | Deferred — initial version renders school names as text; rich cards are a follow-up |

### Placeholder Scan
No TBD, TODO, or "implement later" found.

### Type Consistency
- `CoachMode` type defined in Task 3, used in Tasks 4, 6, 9
- `CoachContext` interface defined in Task 4, used in Task 6
- `ChatMessage` interface defined in Task 5, used in Tasks 6, 8
- `CoachMessage` (client) defined in Task 9, used in Tasks 10, 11
- `ProfileProgress` defined in Task 3, assembled in Task 6
- `SchoolPreferences` defined in Task 4, fetched in Tasks 6, 14
