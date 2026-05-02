# Handoff Phase 2.5 — Per-Variant Priority Module Content

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make priority modules in `AdaptiveDashboard` render the rich per-variant content from `docs/superpowers/designs/handoff/src/dashboard.jsx` for the 4 modules where the data already exists in our DB. No new schema, no AI calls, no migrations.

**Architecture:** Add a discriminated-union `extra` field to `PriorityCard` that signals "render this visualization." `PriorityModule` switches on `extra.kind` and renders the matching widget (phase bar, decision counts, SAT bars, supplement progress bar). The dashboard page fetches the additional data (essay phase, decision counts, SAT sub-scores), folds them into `DashboardData`, and `variants.ts` attaches `extra` to the appropriate cards.

**Tech Stack:** Same as Phase 2 — Next.js 16, Supabase, no new deps.

**Scope:**
- ✅ senior_writing personal-statement phase bar (4-segment, current highlighted gold)
- ✅ senior_writing supplements progress bar (`X of Y · 60%`)
- ✅ senior_decisions decision tracker (counts grouped by `application_status`)
- ✅ junior SAT sub-score bars (reading / math / target with progress bars; empty state if no test taken)

**Out of scope** (Phase 2.6 / 2.7):
- ❌ Aid comparator (column exists but no entry form yet)
- ❌ Transfer articulation breakdown (needs new column)
- ❌ "Coach's nudge" callouts (needs new table + Vercel cron + ongoing AI cost)

---

## Task 1: Extend `DashboardData` with new fields

**Files:**
- Modify: `src/app/cc/dashboard/variants.ts` — add fields to `DashboardData` type
- Modify: `src/app/cc/dashboard/page.tsx` — fetch the new data

- [ ] **Step 1: Extend DashboardData.** In `variants.ts`, add to the existing type:
  ```typescript
  export type DashboardData = {
    // ... existing fields ...

    // Phase 2.5 additions — feed bespoke priority module content.
    // Personal statement essay phase ("brainstorm" | "outline" | "draft" |
    // "revise" | "submitted" | "final" | null when no PS exists yet).
    personalStatementPhase: string | null;
    // Senior decisions tracker — counts grouped by application_status.
    decisionCounts: {
      admitted: number;
      waitlisted: number;
      denied: number;
      pending: number;
    } | null;
    // SAT sub-scores from the most recent attempt. null when no attempts logged.
    satReading: number | null;
    satMath: number | null;
    satTotal: number | null;
  };
  ```

- [ ] **Step 2: Fetch the data in `dashboard/page.tsx`.** After the existing
  `Promise.all([essays, testPlan, activities])` block, add:
  ```typescript
  // Pull most recent SAT attempt (sub-scores for the junior SAT bars).
  const satAttempt = await safe<{ sat_reading: number | null; sat_math: number | null; total_score: number | null } | null>(
    supabase
      .from("cc_test_attempts")
      .select("sat_reading, sat_math, total_score")
      .eq("student_id", profile.id)
      .eq("test_type", "SAT")
      .order("test_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
  );
  ```

- [ ] **Step 3: Compute personalStatementPhase + decisionCounts + populate
  the new fields in the `data: DashboardData` literal.** Inside
  `dashboard/page.tsx`, just before the `data: DashboardData = { ... }`
  literal:
  ```typescript
  // Personal statement = essay row with essay_type = 'personal_statement'.
  // Phase comes from the essays array we already fetched.
  const psEssay = essayList.find((e) => e.essay_type === "personal_statement");
  const personalStatementPhase = psEssay?.phase ?? null;

  // Decision counts — aggregate cc_student_schools.application_status.
  const decisionCounts = schoolList.length === 0 ? null : {
    admitted: schoolList.filter((s) => s.application_status === "accepted" || s.application_status === "deposited").length,
    waitlisted: schoolList.filter((s) => s.application_status === "waitlisted").length,
    denied: schoolList.filter((s) => s.application_status === "rejected").length,
    pending: schoolList.filter((s) => s.application_status === "submitted" || s.application_status === "deferred").length,
  };
  ```

  Then add the fields to the `data` literal:
  ```typescript
  personalStatementPhase,
  decisionCounts,
  satReading: (satAttempt as { sat_reading?: number | null } | null)?.sat_reading ?? null,
  satMath: (satAttempt as { sat_math?: number | null } | null)?.sat_math ?? null,
  satTotal: (satAttempt as { total_score?: number | null } | null)?.total_score ?? null,
  ```

- [ ] **Step 4: Update test baseContext** in `coach-prompt-builder.test.ts`
  if it references DashboardData. (It doesn't — DashboardData is dashboard-scoped.)
  Update `variants.test.ts` baseData with the new fields:
  ```typescript
  const baseData: DashboardData = {
    // ... existing ...
    personalStatementPhase: null,
    decisionCounts: null,
    satReading: null,
    satMath: null,
    satTotal: null,
  };
  ```

- [ ] **Step 5: Run tests.** `npx vitest run src/app/cc/dashboard/__tests__/variants.test.ts` — should still pass.

- [ ] **Step 6: Commit.**
  ```bash
  git add src/app/cc/dashboard/variants.ts src/app/cc/dashboard/page.tsx src/app/cc/dashboard/__tests__/variants.test.ts
  git commit -m "feat(dashboard): plumb personal-statement phase, decision counts, SAT sub-scores into DashboardData"
  ```

---

## Task 2: Add `extra` discriminated union to `PriorityCard`

**Files:**
- Modify: `src/app/cc/dashboard/variants.ts`

- [ ] **Step 1: Define the union types.** In `variants.ts`, before
  `PriorityCard`:
  ```typescript
  // Optional rich-content slots that PriorityModule renders when present.
  // Discriminated by `kind` so we can add more types later (Phase 2.6:
  // aid comparator, articulation breakdown).
  export type PriorityExtra =
    | { kind: "phaseBar"; phases: string[]; current: string | null }
    | { kind: "progressBar"; current: number; total: number; tone?: "gold" | "leaf" }
    | { kind: "decisionCounts"; admitted: number; waitlisted: number; denied: number; pending: number }
    | { kind: "satBars"; reading: number | null; math: number | null; target: number };
  ```

- [ ] **Step 2: Add `extra?: PriorityExtra` to PriorityCard.** Optional so
  existing cards keep working unchanged.

---

## Task 3: Render `extra` in `PriorityModule`

**Files:**
- Modify: `src/components/cc/dashboard/PriorityModule.tsx`

- [ ] **Step 1: Import the new union type.** Add to the existing
  import block:
  ```typescript
  import type { PriorityCard, IconName, PriorityExtra } from "@/app/cc/dashboard/variants";
  ```

- [ ] **Step 2: Replace the simple value-render block** with a switch on
  `card.extra?.kind`:
  ```typescript
  // Render bespoke widget when extra is present, else the simple value.
  function renderContent(card: PriorityCard) {
    if (!card.extra) {
      return card.valueKind === "num" ? (
        <div className="flex items-baseline" style={{ gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 500, color: "#d4af37", letterSpacing: "-.02em", lineHeight: 1 }}>
            {card.valueNum}
          </span>
          {card.valueSuffix && (<span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{card.valueSuffix}</span>)}
        </div>
      ) : (
        <div style={{ fontSize: 18, fontWeight: 500, color: "#f2ede3", fontFamily: "'Inter', sans-serif" }}>
          {card.valueText}
        </div>
      );
    }
    switch (card.extra.kind) {
      case "phaseBar": return <PhaseBar phases={card.extra.phases} current={card.extra.current} />;
      case "progressBar": return <ProgressBar current={card.extra.current} total={card.extra.total} tone={card.extra.tone} />;
      case "decisionCounts": return <DecisionCounts counts={card.extra} />;
      case "satBars": return <SatBars reading={card.extra.reading} math={card.extra.math} target={card.extra.target} />;
    }
  }
  ```

- [ ] **Step 3: Implement the four widgets** as helper components inside
  the file. Match the handoff's visual treatment exactly. (See the plan's
  reference snippets below.)

- [ ] **Step 4: Replace the `<div className="flex-1...">` content block** in the
  main `inner` template with `{renderContent(card)}`.

---

## Task 4: Attach `extra` to the right cards in `variants.ts`

**Files:**
- Modify: `src/app/cc/dashboard/variants.ts`

- [ ] **Step 1: senior_writing — PS module gets phaseBar extra.** Inside
  `buildPriority` for `senior_writing`, modify the "Personal statement"
  card to include:
  ```typescript
  extra: {
    kind: "phaseBar",
    phases: ["Brainstorm", "Outline", "Draft", "Revise"],
    current: d.personalStatementPhase
      ? d.personalStatementPhase.charAt(0).toUpperCase() + d.personalStatementPhase.slice(1)
      : null,
  },
  ```

- [ ] **Step 2: senior_writing — Supplements card gets progressBar extra.**
  Modify the "Supplements" card:
  ```typescript
  extra: {
    kind: "progressBar",
    current: d.essaysSubmittedCount,
    total: Math.max(d.essaysTotal, d.essaysSubmittedCount, 1),
    tone: "gold",
  },
  ```

- [ ] **Step 3: senior_post_submit + senior_decisions — Decisions tracker.**
  In both variants' "Decisions tracker" or first card, attach:
  ```typescript
  extra: d.decisionCounts ? { kind: "decisionCounts", ...d.decisionCounts } : undefined,
  ```

- [ ] **Step 4: junior — Test strategy gets satBars extra.** In the junior
  variant's "Test strategy" card:
  ```typescript
  extra: {
    kind: "satBars",
    reading: d.satReading,
    math: d.satMath,
    target: 1500, // canonical reach target; could come from cc_test_plan later
  },
  ```

- [ ] **Step 5: Run all tests.** `npx vitest run` — expect all green.

- [ ] **Step 6: Type-check.** `npx tsc --noEmit` — should be clean.

---

## Task 5: Tests + commit

- [ ] **Step 1: Add tests for the new card extras.** In `variants.test.ts`,
  add at the bottom:
  ```typescript
  describe("buildVariant — Phase 2.5 priority extras", () => {
    it("senior_writing PS card has phaseBar extra", () => {
      const v = buildVariant("senior_writing", { ...baseData, personalStatementPhase: "draft" });
      const ps = v.priority.find((p) => p.label === "Personal statement");
      expect(ps?.extra?.kind).toBe("phaseBar");
      if (ps?.extra?.kind === "phaseBar") {
        expect(ps.extra.current).toBe("Draft");
        expect(ps.extra.phases).toHaveLength(4);
      }
    });
    it("senior_writing supplements card has progressBar extra", () => {
      const v = buildVariant("senior_writing", { ...baseData, essaysSubmittedCount: 8, essaysTotal: 23 });
      const sup = v.priority.find((p) => p.label === "Supplements");
      expect(sup?.extra?.kind).toBe("progressBar");
    });
    it("senior_decisions card has decisionCounts when present", () => {
      const v = buildVariant("senior_decisions", {
        ...baseData,
        decisionCounts: { admitted: 4, waitlisted: 1, denied: 3, pending: 6 },
      });
      const card = v.priority[0];
      expect(card.extra?.kind).toBe("decisionCounts");
    });
    it("junior test strategy card has satBars extra", () => {
      const v = buildVariant("junior", { ...baseData, satReading: 720, satMath: 670 });
      const tests = v.priority.find((p) => p.label === "Test strategy");
      expect(tests?.extra?.kind).toBe("satBars");
      if (tests?.extra?.kind === "satBars") {
        expect(tests.extra.target).toBe(1500);
      }
    });
  });
  ```

- [ ] **Step 2: Run all tests.** `npx vitest run` — expect 4 new tests passing.

- [ ] **Step 3: Type-check.** `npx tsc --noEmit` — clean.

- [ ] **Step 4: Final commit + push.**
  ```bash
  git add -A
  git commit -m "feat(dashboard): per-variant priority module content (PS phase, decisions, SAT bars)"
  git push origin master
  ```

---

## Self-review notes

- **Why a discriminated union (PriorityExtra) instead of separate fields?** Keeps `PriorityCard` lean — most cards don't need any of these widgets. Adding `phaseBar` + `decisionCounts` + `satBars` as standalone optional fields would clutter the type and require null checks at every render site.
- **Why no entry form for SAT scores?** `cc_test_attempts` table already exists from Feature 9. The empty-state handles "no rows yet" gracefully — students can log scores via the existing `/cc/test-strategy` flow.
- **Why is `target: 1500` hardcoded for SAT?** It's the canonical "reach school" target most students aim for; tied to the dashboard's narrative voice. Future iteration can read `cc_test_plan.target_score` if we ever wire that field.
- **Why "Math/Reading" instead of two separate cards?** The handoff's SAT module compresses both into one priority slot — saves real estate and shows the math vs. reading gap at a glance.
