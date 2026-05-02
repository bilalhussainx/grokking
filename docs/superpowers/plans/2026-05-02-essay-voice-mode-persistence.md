# Essay Editor Voice Mode Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the essay editor's voice-input mode (Web Speech API speech-to-text in `BrainstormChat`) persist across phase changes, page navigation, and component remounts — so the user doesn't have to re-enable it every time the editor re-renders. Mirror the persistence pattern already proven in `CoachKairosContext` (localStorage key + rehydration on mount).

**Out of scope (deferred):** The user's adjacent ask "I can hear the AI as well (similar to the Coach Kairos chatbot)" — i.e. adding TTS *output* to the essay editor so the AI's coaching feedback is read aloud. That's a feature add, not a bug fix; tracked separately.

**Architecture:** A single small hook (`useVoicePreference`) that reads/writes a localStorage flag and exposes `[on, setOn]`. `BrainstormChat` swaps its `useState(false)` for this hook. Pattern matches `CoachKairosContext.tsx:62-97,229-238`.

**Tech Stack:** Next.js 16, TypeScript 5, Web Speech API (browser), localStorage.

**Diagnosis source:** Investigation completed 2026-05-02; see §Diagnosis.

---

## Diagnosis (anchors)

- `src/components/cc/essay/BrainstormChat.tsx:277` — `const [voiceOn, setVoiceOn] = useState(false);` — component-local, no persistence.
- `BrainstormChat.tsx:520-531` — `handleVoiceToggle()` calls `setVoiceOn`; no localStorage write.
- `BrainstormChat.tsx:487-495` — `rec.onend` only restarts recognition while `voiceOn && !streaming`; correct in-session behavior, but state resets to `false` when the component re-mounts.
- `src/app/cc/essays/[id]/page.tsx:243-256` — phase changes (brainstorm → outline → draft → revise) re-render and may unmount `BrainstormChat`; that's the primary cause of the toggle "turning off."
- `src/contexts/CoachKairosContext.tsx:62-97,229-238` — reference pattern. Defines `LS_VOICE_KEY = "coach_kairos_voice_enabled"`, reads on mount with `useEffect`, writes on toggle.

The fix is mechanical: replicate the localStorage pattern for the essay-side voice toggle.

---

## File map (changed)

```
src/hooks/
  useVoicePreference.ts                                  ← NEW — generic localStorage-backed boolean toggle
  __tests__/useVoicePreference.test.tsx                   ← NEW — render-mount + persistence tests

src/components/cc/essay/
  BrainstormChat.tsx                                      ← MODIFY — replace useState(false) with useVoicePreference
```

---

## Task 1 — `useVoicePreference` hook + tests (TDD)

**Files:**
- Create: `src/hooks/useVoicePreference.ts`
- Create: `src/hooks/__tests__/useVoicePreference.test.tsx`

The hook is intentionally generic (`useVoicePreference(key: string, defaultValue = false)`) so future voice-toggles in other features can reuse it without duplication.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/hooks/__tests__/useVoicePreference.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useVoicePreference } from "../useVoicePreference";

function Probe({ storageKey }: { storageKey: string }) {
  const [on, setOn] = useVoicePreference(storageKey);
  return (
    <div>
      <span data-testid="value">{String(on)}</span>
      <button data-testid="toggle" onClick={() => setOn(!on)}>toggle</button>
    </div>
  );
}

describe("useVoicePreference", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts false when nothing in storage", () => {
    render(<Probe storageKey="test-voice-1" />);
    expect(screen.getByTestId("value").textContent).toBe("false");
  });

  it("rehydrates true when 'true' is in storage", () => {
    localStorage.setItem("test-voice-2", "true");
    render(<Probe storageKey="test-voice-2" />);
    expect(screen.getByTestId("value").textContent).toBe("true");
  });

  it("writes 'true' to storage when toggled on", () => {
    render(<Probe storageKey="test-voice-3" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(screen.getByTestId("value").textContent).toBe("true");
    expect(localStorage.getItem("test-voice-3")).toBe("true");
  });

  it("writes 'false' to storage when toggled off (after on)", () => {
    localStorage.setItem("test-voice-4", "true");
    render(<Probe storageKey="test-voice-4" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(localStorage.getItem("test-voice-4")).toBe("false");
  });

  it("survives unmount + remount when storage value is 'true'", () => {
    const { unmount } = render(<Probe storageKey="test-voice-5" />);
    act(() => {
      screen.getByTestId("toggle").click();
    });
    expect(localStorage.getItem("test-voice-5")).toBe("true");
    unmount();
    render(<Probe storageKey="test-voice-5" />);
    expect(screen.getByTestId("value").textContent).toBe("true");
  });

  it("treats any non-'true' string as false", () => {
    localStorage.setItem("test-voice-6", "1");
    render(<Probe storageKey="test-voice-6" />);
    expect(screen.getByTestId("value").textContent).toBe("false");
  });
});
```

- [ ] **Step 2: Run, expect failure.** `npx vitest run src/hooks/__tests__/useVoicePreference.test.tsx`. Expect: "Cannot find module".

- [ ] **Step 3: Write the hook.**

```typescript
// src/hooks/useVoicePreference.ts
// Boolean preference toggle backed by localStorage. Mirrors the pattern
// used by CoachKairosContext for `voiceEnabled` (key
// `coach_kairos_voice_enabled`) so feature-side voice toggles
// (BrainstormChat, future TTS output controls, etc.) survive remounts and
// page navigation without re-introducing the same localStorage plumbing
// in every component.
//
// Storage convention: the value is the literal string "true" or "false".
// We deliberately don't JSON.parse so corrupted/foreign values fall to
// `false` instead of throwing.
import { useEffect, useState, useCallback } from "react";

export function useVoicePreference(
  storageKey: string,
  defaultValue = false,
): [boolean, (next: boolean) => void] {
  const [on, setOnState] = useState(defaultValue);

  // Rehydrate after mount. Doing this in useEffect (not useState init) is
  // intentional: it prevents an SSR/CSR hydration mismatch when the
  // component renders server-side (Next.js App Router) where localStorage
  // is unavailable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnState(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const setOn = useCallback(
    (next: boolean) => {
      setOnState(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(next));
      }
    },
    [storageKey],
  );

  return [on, setOn];
}
```

- [ ] **Step 4: Run tests, expect 6 pass.** `npx vitest run src/hooks/__tests__/useVoicePreference.test.tsx`. The first render in test 2 ("rehydrates true when 'true' is in storage") may briefly show `false` because of the post-mount useEffect, then re-render with `true`. Testing-library's `render` returns after effects flush, so the assertion against the re-rendered value should pass. If the test fails on this race, switch the assertion to use `findByText` or wrap the render in `act` — adjust as needed.

- [ ] **Step 5: Commit.**
```bash
git add src/hooks/useVoicePreference.ts src/hooks/__tests__/useVoicePreference.test.tsx
git commit -m "feat(hooks): useVoicePreference — localStorage-backed boolean toggle"
```

---

## Task 2 — Wire `useVoicePreference` into `BrainstormChat`

**Files:**
- Modify: `src/components/cc/essay/BrainstormChat.tsx`

- [ ] **Step 1: Read** `BrainstormChat.tsx` lines 270-300 to understand the surrounding state. Specifically: confirm line 277's exact form (`const [voiceOn, setVoiceOn] = useState(false);`).

- [ ] **Step 2: Add the import** at the top of the file (alongside other `@/hooks/*` or `@/contexts/*` imports):

```typescript
import { useVoicePreference } from "@/hooks/useVoicePreference";
```

- [ ] **Step 3: Replace** the `useState(false)` line with:

```typescript
// Voice mode persists across phase changes (brainstorm → outline → draft →
// revise) and page reloads. Same pattern as CoachKairosContext's
// `voiceEnabled` — see useVoicePreference for the storage convention.
const [voiceOn, setVoiceOn] = useVoicePreference("essay-brainstorm-voice-on");
```

- [ ] **Step 4: Verify** the call sites still work. `setVoiceOn(true)` and `setVoiceOn(false)` patterns should be unchanged. The handler at line 520-531 (`handleVoiceToggle`) still calls `setVoiceOn(!voiceOn)` (or whatever its current form is) — no edit needed there.

- [ ] **Step 5: Type-check.** `npx tsc --noEmit`. Expect: only the pre-existing e2e error.

- [ ] **Step 6: Smoke-test in dev.**
   1. `npm run dev`.
   2. Open an essay's brainstorm phase.
   3. Toggle voice on.
   4. Advance to the outline phase (essay phase change unmounts `BrainstormChat`).
   5. Return to the brainstorm phase. **Expect:** voice is still on.
   6. Refresh the page. **Expect:** voice is still on.

- [ ] **Step 7: Commit.**
```bash
git add src/components/cc/essay/BrainstormChat.tsx
git commit -m "fix(essay): persist voice-input toggle across brainstorm phase changes"
```

---

## Task 3 — Final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`.
- [ ] **Step 2: Tests.** `npx vitest run`. Expect: previous count + 6 new (useVoicePreference) all green.
- [ ] **Step 3: Smoke-test** per Task 2 Step 6. If voice doesn't persist, check the storage key matches in DevTools Application → Local Storage.
- [ ] **Step 4: Push.**
```bash
git push origin master
```

---

## Self-review

**Spec coverage:** The user said "the voice mode keeps turning off." Task 2 makes it survive every known reset trigger (phase change, parent re-render, page refresh). The "I want to hear the AI" follow-on request is intentionally NOT in this plan — it requires adding TTS output to the brainstorm panel, which is a feature add of separate scope.

**Placeholder scan:** No TBD/TODO. Each step has either complete code or a concrete edit instruction with file:line refs.

**Type consistency:** `useVoicePreference` returns `[boolean, (next: boolean) => void]` — drop-in replacement for the existing `useState(false)` shape, so no consumer-side changes needed beyond the import.

**Risk:** None substantial. Smallest plan in this trio. The only edge case is SSR — handled by the post-mount effect (default `false` during server render, hydrated client-side).

---

## Execution

This is a 3-task plan. Inline Execution is fine (the whole thing is ~15 min). Subagent-Driven is overkill here. **Recommend: Inline.**
