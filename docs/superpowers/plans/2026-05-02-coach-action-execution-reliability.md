# Coach Kairos Action Execution Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the "coach says it'll add schools but never does" failure mode AND make the v2 dashboard auto-refresh after coach mutations succeed. After this plan ships, when a user says "add Stanford to my list," Coach Kairos will (a) actually insert the row, (b) tell the user with a canonical confirmation, and (c) the dashboard's school list will refresh without a manual reload.

**Architecture:** Two coordinated fixes:
1. **Reliable extraction** — harden the existing text-extraction path (`extractAndSaveSchools` in `coach-extract.ts`) by forcing the LLM to emit a canonical confirmation block (`<<actions>>...<</actions>>`) and parsing that block authoritatively, falling back to the existing fuzzy text scan only when the block is missing. This is meaningfully more reliable than the current pattern-match approach without requiring a full migration to OpenRouter tool-calling (deferred as Phase 2).
2. **Dashboard auto-refresh** — `AdaptiveDashboard.tsx` (the v2 orchestrator) listens for `kairos:message-complete`, refetches `/api/cc/dashboard/summary`. The `/schools` page already does this; the v2 dashboard inherited the gap.

**Tech Stack:** Next.js 16, TypeScript 5, OpenRouter (Sonnet 4.6, no tool-calling yet), Supabase. The existing extraction infrastructure (`runCoachExtraction`, `kairos:message-complete` event) is preserved and extended.

**Diagnosis source:** Investigation completed 2026-05-02; see §Diagnosis below.

---

## Diagnosis (anchors)

### What works today (do not regress)
- `src/lib/cc/coach-extract.ts:13-57` — `runCoachExtraction(studentId, mode)` is invoked after every coach turn (called from `/api/cc/coach/message/route.ts:436`).
- `coach-extract.ts:303-447` — `extractAndSaveSchools()` reads the transcript, uses an LLM extraction pass to pull school names, fuzzy-matches against `cc_schools`, inserts into `cc_student_schools`. **The plumbing exists.**
- `src/contexts/CoachKairosContext.tsx:349-355` — emits `window` `CustomEvent("kairos:message-complete", { detail: { mode, content, source } })` after every turn.
- `src/app/schools/page.tsx:95-104` — listens to `kairos:message-complete`, calls `loadMySchools()`. Auto-refresh works on `/schools`.

### What's broken
- **Extraction is fragile.** The LLM is called via `src/lib/cc/openrouter.ts:6-38` with NO `tools:[]` parameter — pure text generation. The extractor expects the assistant message to literally say "I've added [SchoolName]" so the regex on `coach-extract.ts:307` matches. When the LLM says "Sure, I'll note Stanford for you" or just "Done!", the extractor pulls 0 schools and silently fails.
- **Failure is invisible to the user.** No "I tried to add Stanford but couldn't find it in our catalog" feedback; no "extraction failed, please retry" UI; no log surfaced to the user.
- **v2 dashboard doesn't refresh.** `src/app/cc/dashboard/AdaptiveDashboard.tsx` (orchestrator) does `useEffect(() => fetch(...), [])` once on mount and never refetches. After the user adds a school via coach, the school list in the SchoolCardGrid stays stale until manual reload.

---

## File map (changed)

```
src/lib/cc/
  coach-actions-block.ts                    ← NEW — parser for the canonical <<actions>>...<</actions>> block
  coach-actions-block.test.ts               ← NEW — unit tests for parser

src/lib/cc/
  coach-prompt-builder.ts                   ← MODIFY — add ACTIONS BLOCK directive at the bottom
  coach-extract.ts                          ← MODIFY — extractAndSaveSchools prefers actions-block, falls back to existing scan

src/app/api/cc/coach/message/
  route.ts                                  ← MODIFY — strip <<actions>> blocks from streamed assistant text
                                                       (so users don't see the confirmation block in the UI)
                                          ← MODIFY — emit `extracted` count back to client in final SSE event

src/contexts/CoachKairosContext.tsx          ← MODIFY — broadcast kairos:message-complete with `extracted` count;
                                                       update message-complete event detail shape

src/app/cc/dashboard/AdaptiveDashboard.tsx   ← MODIFY — listen for kairos:message-complete, refetch summary

src/components/cc/coach/CoachKairosShell.tsx ← MODIFY — show toast/inline confirmation when schools were added
                                                       ("Added Stanford to your list — view on /schools")

src/lib/cc/__tests__/
  coach-extract.test.ts                     ← MODIFY (or create if missing) — test the actions-block fast path
                                                       and the fallback path
```

---

## Task 1 — Canonical actions-block parser + tests (TDD)

**Files:**
- Create: `src/lib/cc/coach-actions-block.ts`
- Create: `src/lib/cc/__tests__/coach-actions-block.test.ts`

**Spec:** The LLM will emit (after Task 2 wires the prompt directive) a fenced JSON block at the END of its assistant turn:

```
<<actions>>
{"add_schools": ["Stanford University", "MIT"]}
<</actions>>
```

This parser extracts the JSON and returns a typed object, or returns `null` if no block is present (fallback to legacy fuzzy extraction).

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/__tests__/coach-actions-block.test.ts
import { describe, it, expect } from "vitest";
import { parseActionsBlock, stripActionsBlock } from "../coach-actions-block";

describe("parseActionsBlock", () => {
  it("returns null when no block present", () => {
    expect(parseActionsBlock("Sure, I'll add Stanford for you.")).toBeNull();
  });
  it("parses add_schools array", () => {
    const result = parseActionsBlock(`Sure!
<<actions>>
{"add_schools": ["Stanford University", "MIT"]}
<</actions>>`);
    expect(result).toEqual({ add_schools: ["Stanford University", "MIT"] });
  });
  it("ignores empty arrays", () => {
    const result = parseActionsBlock(`<<actions>>
{"add_schools": []}
<</actions>>`);
    expect(result).toEqual({ add_schools: [] });
  });
  it("returns null for malformed JSON", () => {
    expect(parseActionsBlock("<<actions>>{not json}<</actions>>")).toBeNull();
  });
  it("trims whitespace and newlines around the JSON", () => {
    const result = parseActionsBlock(`<<actions>>

{"add_schools": ["Yale"]}

<</actions>>`);
    expect(result).toEqual({ add_schools: ["Yale"] });
  });
  it("only accepts the LAST block when multiple are present", () => {
    // Defensive: model occasionally repeats. Last wins because that's the
    // model's final commitment.
    const result = parseActionsBlock(`<<actions>>{"add_schools":["A"]}<</actions>>
text
<<actions>>{"add_schools":["B"]}<</actions>>`);
    expect(result).toEqual({ add_schools: ["B"] });
  });
});

describe("stripActionsBlock", () => {
  it("removes the block + trims trailing whitespace", () => {
    const text = `Sure, here's your update.

<<actions>>
{"add_schools":["MIT"]}
<</actions>>`;
    expect(stripActionsBlock(text)).toBe("Sure, here's your update.");
  });
  it("returns original when no block present", () => {
    expect(stripActionsBlock("plain text")).toBe("plain text");
  });
});
```

- [ ] **Step 2: Run, expect failure.** `npx vitest run src/lib/cc/__tests__/coach-actions-block.test.ts`. Expect: "Cannot find module".

- [ ] **Step 3: Write the implementation.**

```typescript
// src/lib/cc/coach-actions-block.ts
// Canonical confirmation block the coach LLM is instructed to emit at the
// END of any assistant turn that performs an action (e.g. adding schools).
// The block is parsed authoritatively by the extraction pipeline; the
// rendered assistant message has the block stripped so the user only sees
// natural-language confirmation.
//
// Format:
//
//   <<actions>>
//   {"add_schools": ["Stanford University", "MIT"]}
//   <</actions>>
//
// We deliberately choose a fenced block instead of OpenRouter tool-calling
// for now (Phase 2): tool-calling requires per-provider differences and
// breaks streaming UX. A fenced block survives the existing streaming +
// extraction pipeline with a one-line prompt change.

export interface CoachActions {
  add_schools?: string[];
}

const BLOCK_RE = /<<actions>>([\s\S]*?)<<\/actions>>/g;

export function parseActionsBlock(text: string): CoachActions | null {
  const matches = [...text.matchAll(BLOCK_RE)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1][1].trim();
  try {
    const parsed = JSON.parse(last) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as CoachActions;
  } catch {
    return null;
  }
}

export function stripActionsBlock(text: string): string {
  return text.replace(BLOCK_RE, "").trimEnd();
}
```

- [ ] **Step 4: Run tests, expect 8 pass.** `npx vitest run src/lib/cc/__tests__/coach-actions-block.test.ts`.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/coach-actions-block.ts src/lib/cc/__tests__/coach-actions-block.test.ts
git commit -m "feat(coach): canonical <<actions>> block parser + tests"
```

---

## Task 2 — Add actions-block directive to the coach system prompt

**Files:**
- Modify: `src/lib/cc/coach-prompt-builder.ts`

- [ ] **Step 1: Read** the file end-to-end to understand the current prompt structure (mostly around lines 100-150 per the diagnosis).

- [ ] **Step 2: Append** a new directive section at the END of the assembled system prompt (after personality, language, etc.). The block should make the LLM's commitment explicit:

```typescript
// Inside the prompt builder, append after the existing PERSONALITY +
// LANGUAGE blocks:

const ACTIONS_DIRECTIVE = `

ACTIONS — MANDATORY FORMAT FOR DB-MUTATING TURNS:

When you commit to adding schools to the student's list, you MUST emit an actions block at the very end of your reply, AFTER your natural-language confirmation. The system parses this block and performs the actual database insert.

Format (literal — copy exactly):

<<actions>>
{"add_schools": ["Stanford University", "MIT"]}
<</actions>>

Rules:
- Use the school's official full name as it would appear in our catalog (e.g. "Stanford University", not "Stanford" or "Stanford U").
- Only include schools the student has explicitly approved or asked you to add. Never add unilaterally.
- If the student is just exploring and hasn't approved, omit the block.
- ONE block per reply. Always at the very end.
- The block is invisible to the student — they only see your natural-language reply. So you must STILL say "I've added Stanford and MIT to your list" in your reply text. Just emit the block on top.
- If you have nothing to add, do NOT emit an empty block. Omit it entirely.

Example response:

  Great picks. I've added Stanford and MIT to your list. You can review them on /schools.

  <<actions>>
  {"add_schools": ["Stanford University", "Massachusetts Institute of Technology"]}
  <</actions>>
`;

// Append ACTIONS_DIRECTIVE to the system prompt string.
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.ts
git commit -m "feat(coach): instruct LLM to emit canonical <<actions>> confirmation block"
```

---

## Task 3 — Strip the actions-block from the streamed assistant text + emit count

**Files:**
- Modify: `src/app/api/cc/coach/message/route.ts`

The LLM's stream now contains `<<actions>>...<</actions>>` at the end. We must strip it before sending the assistant message to the client (so the user doesn't see the JSON), AND we want to know how many schools got added so the client can show a confirmation toast.

- [ ] **Step 1: Read** the route file. Find the assistant-message accumulation logic (the place that builds `finalContent` after streaming completes — likely around line 400 where the message is saved to `cc_coach_conversations`).

- [ ] **Step 2: After accumulation, before returning the SSE done frame:**

```typescript
import { stripActionsBlock, parseActionsBlock } from "@/lib/cc/coach-actions-block";

// ... after `let finalContent = "";` is fully populated by the stream ...

const actions = parseActionsBlock(finalContent);
const cleanContent = stripActionsBlock(finalContent);

// IMPORTANT: save the CLEAN content to cc_coach_conversations so the user's
// scrollback doesn't show the JSON block on reload.
await supabase.from("cc_coach_conversations").insert({
  // ... existing fields ...
  content: cleanContent,
  // ... existing fields ...
});

// runCoachExtraction now has access to actions via the transcript it
// reloads — but we'll also pass it explicitly for the fast path (Task 4).
const extractionResult = await runCoachExtraction(profileId, mode, actions);
```

- [ ] **Step 3: Update the streaming layer** to send the clean content (not the raw stream-with-block). Two options:
   - **Option A (preferred):** Buffer the entire stream server-side, strip, then emit one SSE message with the clean text. Simpler but loses streaming feel.
   - **Option B:** Emit chunks as they arrive but watch for `<<actions>>` and stop forwarding once it appears. The remaining text after `<<` is buffered and not sent to the client.

   Implement Option B (preserves streaming UX). The streaming loop should track `seenActionsTag: boolean` and only emit chunks while it's false.

```typescript
// Pseudo — inside the streaming chunk handler:
let buffer = "";
let cutAt = -1;
for await (const chunk of stream) {
  buffer += chunk;
  if (cutAt < 0) {
    const idx = buffer.indexOf("<<actions>>");
    if (idx >= 0) cutAt = idx;
  }
  const visible = cutAt < 0 ? chunk : buffer.slice(0, cutAt).slice(-chunk.length);
  if (visible) sendChunk(visible);
  // Once we hit <<actions>>, suppress all subsequent chunks from the wire.
  if (cutAt >= 0) break /* keep accumulating but not sending */;
}
```

(The exact loop structure depends on the existing stream implementation. The principle: emit nothing once we've seen `<<actions>>`.)

- [ ] **Step 4: After the stream completes, emit a final SSE event with the action result:**

```typescript
const extractedCount = extractionResult.extracted ? extractionResult.schoolsAddedCount ?? 0 : 0;
sendEvent("done", { mode, extracted: extractedCount, action_kinds: actions ? Object.keys(actions) : [] });
```

(Update `runCoachExtraction` in Task 4 to return `schoolsAddedCount`.)

- [ ] **Step 5: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 6: Commit.**
```bash
git add src/app/api/cc/coach/message/route.ts
git commit -m "feat(coach): strip <<actions>> block from streamed text + emit extracted count"
```

---

## Task 4 — `extractAndSaveSchools` prefers the actions-block, falls back to legacy scan

**Files:**
- Modify: `src/lib/cc/coach-extract.ts`

- [ ] **Step 1: Update** `runCoachExtraction(studentId, mode, actions?)` to accept the parsed actions object and pass it down.

```typescript
import type { CoachActions } from "./coach-actions-block";

export async function runCoachExtraction(
  studentId: string,
  mode: string,
  actions?: CoachActions | null,
): Promise<{ extracted: boolean; schoolsAddedCount?: number; error?: string }> {
  // existing logic ...
  const schoolsResult = await extractAndSaveSchools(supabase, studentId, transcript, actions);
  // ...
  return { extracted: true, schoolsAddedCount: schoolsResult.added };
}
```

- [ ] **Step 2: Update** `extractAndSaveSchools` signature to accept actions and use it as a fast path:

```typescript
async function extractAndSaveSchools(
  supabase: AdminSupabase,
  studentId: string,
  transcript: string,
  actions?: CoachActions | null,
): Promise<{ added: number }> {
  // FAST PATH: the LLM emitted a canonical actions block — trust it
  // authoritatively. Skip the second LLM extraction pass entirely.
  const schoolNames = actions?.add_schools && actions.add_schools.length > 0
    ? actions.add_schools
    : await extractSchoolNamesFromTranscript(transcript); // existing legacy logic

  if (schoolNames.length === 0) return { added: 0 };

  // Match each name against the cc_schools catalog (existing fuzzy logic).
  // Insert matched rows into cc_student_schools.
  let added = 0;
  for (const name of schoolNames) {
    const matched = await matchSchool(supabase, name);
    if (!matched) {
      console.warn("[extractAndSaveSchools] no catalog match for", name);
      continue;
    }
    const { error } = await supabase
      .from("cc_student_schools")
      .insert({ student_id: studentId, school_id: matched.id, added_at: new Date().toISOString() })
      .select("id");
    if (!error) added += 1;
  }
  return { added };
}

// extractSchoolNamesFromTranscript = the existing extraction prompt + LLM
// call that lives in the current extractAndSaveSchools body. Pull it out
// into its own private function so the fast path can skip it.
```

- [ ] **Step 3: Add a unit test** that verifies the fast path skips the LLM call when actions are present.

```typescript
// src/lib/cc/__tests__/coach-extract.test.ts (add to existing file or create)
import { describe, it, expect, vi } from "vitest";
// ... mock supabase + chatOnce ...

it("uses actions.add_schools and skips the LLM extraction pass", async () => {
  const chatOnceSpy = vi.fn();
  vi.mock("../openrouter", () => ({ chatOnce: chatOnceSpy }));
  // ... call extractAndSaveSchools with actions = { add_schools: ["Stanford"] }
  // ... assert chatOnceSpy was NOT called
});
```

- [ ] **Step 4: Run tests.** `npx vitest run src/lib/cc/__tests__/`. Expect: all pass.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/coach-extract.ts src/lib/cc/__tests__/coach-extract.test.ts
git commit -m "feat(coach): extractAndSaveSchools fast-path on canonical actions block"
```

---

## Task 5 — `kairos:message-complete` event carries `extracted` count

**Files:**
- Modify: `src/contexts/CoachKairosContext.tsx`

- [ ] **Step 1: Update** the event detail shape (line 350-354):

```typescript
window.dispatchEvent(
  new CustomEvent("kairos:message-complete", {
    detail: {
      mode: currentMode,
      content: finalContent,
      source: extra?.sourceEvent ?? null,
      // NEW — populated from the SSE done frame's `extracted` field
      extracted: lastDoneEvent?.extracted ?? 0,
      actionKinds: lastDoneEvent?.action_kinds ?? [],
    },
  })
);
```

(The streaming loop needs to capture the final `done` event's payload into a local `lastDoneEvent` variable. Update the SSE parsing block accordingly.)

- [ ] **Step 2: Update** the TypeScript event-detail type (in a shared `src/types/coach-events.ts` if such a file exists, otherwise inline at the dispatch site):

```typescript
export interface KairosMessageCompleteDetail {
  mode: string;
  content: string;
  source: string | null;
  extracted: number;
  actionKinds: string[];
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/contexts/CoachKairosContext.tsx src/types/coach-events.ts
git commit -m "feat(coach): broadcast extracted count + action kinds on message-complete event"
```

---

## Task 6 — `AdaptiveDashboard` listens to `kairos:message-complete` and refetches

**Files:**
- Modify: `src/app/cc/dashboard/AdaptiveDashboard.tsx`

- [ ] **Step 1: Open** `src/app/cc/dashboard/AdaptiveDashboard.tsx`. Currently 48 lines, single `useEffect` fetch on mount.

- [ ] **Step 2: Replace** the fetch effect with a refetch-capable version that ALSO listens for `kairos:message-complete`:

```typescript
"use client";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Greeting from "@/components/cc/dashboard/sections/Greeting";
import { SECTION_ORDER, SECTION_REGISTRY } from "@/components/cc/dashboard/sections/variant-sections";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

export default function AdaptiveDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(() => {
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: DashboardSummary) => setSummary(d))
      .catch((e: Error) => setError(e.message));
  }, []);

  // Initial mount fetch.
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Refetch when Coach Kairos completes a turn that mutated state — e.g.
  // it added schools, updated the profile, etc. The `extracted` field on
  // the event tells us something changed; we conservatively refetch when
  // it's >0 OR when actionKinds is non-empty.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{
        extracted?: number;
        actionKinds?: string[];
      }>).detail;
      if ((detail?.extracted ?? 0) > 0 || (detail?.actionKinds?.length ?? 0) > 0) {
        fetchSummary();
      }
    };
    window.addEventListener("kairos:message-complete", handler);
    return () => window.removeEventListener("kairos:message-complete", handler);
  }, [fetchSummary]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-rose-300 text-sm">
        Couldn&apos;t load your dashboard: {error}
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }
  const sectionIds = SECTION_ORDER[summary.variantKey] ?? SECTION_ORDER.unknown;
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pt-12 pb-20">
      <Greeting summary={summary} />
      {sectionIds.map((id) => {
        const Section = SECTION_REGISTRY[id];
        return <Section key={id} summary={summary} />;
      })}
    </div>
  );
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/app/cc/dashboard/AdaptiveDashboard.tsx
git commit -m "fix(dashboard): v2 orchestrator refetches summary on kairos:message-complete"
```

---

## Task 7 — User-facing confirmation toast in the coach drawer

**Files:**
- Modify: `src/components/cc/coach/CoachKairosShell.tsx` (or wherever the coach drawer lives — confirm path with grep)

- [ ] **Step 1: Find the drawer.** `grep -rn "CoachKairos" src/components/cc/coach/ | head -10`. The shell component renders the message list.

- [ ] **Step 2: Subscribe to the same event** (the drawer is where the user is when this fires):

```typescript
// inside the drawer component
const [actionToast, setActionToast] = useState<string | null>(null);

useEffect(() => {
  if (typeof window === "undefined") return;
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ extracted?: number; actionKinds?: string[] }>).detail;
    if ((detail?.extracted ?? 0) > 0) {
      setActionToast(`Added ${detail.extracted} school${detail.extracted === 1 ? "" : "s"} to your list`);
      const t = setTimeout(() => setActionToast(null), 4000);
      return () => clearTimeout(t);
    }
  };
  window.addEventListener("kairos:message-complete", handler);
  return () => window.removeEventListener("kairos:message-complete", handler);
}, []);
```

- [ ] **Step 3: Render** an inline toast above the input box when `actionToast` is set:

```tsx
{actionToast && (
  <div className="px-4 py-2 text-xs text-emerald-300 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2">
    <CheckCircle2 className="w-3.5 h-3.5" />
    {actionToast}
    <Link href="/schools" className="underline ml-auto">Open list →</Link>
  </div>
)}
```

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 5: Commit.**
```bash
git add src/components/cc/coach/CoachKairosShell.tsx
git commit -m "feat(coach): toast confirms when schools are added via coach"
```

---

## Task 8 — Smoke-test matrix + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 2: Tests.** `npx vitest run`. Expect: all green (existing 238 + 8 new from action-block + extractor).

- [ ] **Step 3: Manual smoke-test** with `npm run dev`, logged-in test user:

| Flow | Expected |
|---|---|
| Type "Add Stanford and MIT to my list" in coach drawer | Coach replies with natural-language confirmation. The `<<actions>>` block is hidden. Toast shows "Added 2 schools to your list". |
| Open `/cc/dashboard?dashboard=v2` in another tab — schools appear | Yes, after the message-complete event fires. |
| Open `/schools` — schools appear | Already worked pre-fix (existing listener); should still work. |
| Type "I'm exploring schools" without commitment | No actions block emitted, no DB insert, no toast. |
| Type "Add Foobar U" (not in catalog) | LLM emits actions, extractor logs no-match, toast does NOT fire (extracted=0), warning in server log. |

- [ ] **Step 4: Commit any final tweaks** discovered during smoke-test, then push.

```bash
git push origin master
```

---

## Self-review

**Spec coverage:** User reports "coach says it'll add but doesn't." Tasks 1-4 make the LLM emit a canonical block parsed authoritatively. Task 7 adds visible confirmation. Task 6 makes the v2 dashboard reflect the change.

**Placeholder scan:** No TBD/TODO. All code blocks are concrete.

**Type consistency:** `CoachActions` interface defined once in Task 1, used in Tasks 4 + 5. `KairosMessageCompleteDetail` defined in Task 5, consumed in Task 6 + 7. `runCoachExtraction` return shape extended consistently in Task 4.

**Risk:** Task 3's "Option B" stream-stripping of the actions block is the trickiest piece. If the streaming layer is awkward to modify, fall back to Option A (buffer entire stream). The cost is the user sees a loading dot a half-second longer per turn — acceptable.

**Phase 2 deferred:** Migrating to OpenRouter tool-calling (proper `tools:[]` parameter) would make extraction even more reliable but breaks existing streaming + extraction pipelines. Worth doing once the actions-block approach has stabilized in production.

---

## Execution

Pick **Subagent-Driven** (recommended — most tasks are mechanical with one judgment call in Task 3) or **Inline Execution**. Atomic commits throughout.
