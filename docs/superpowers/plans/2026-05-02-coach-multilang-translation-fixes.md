# Coach Kairos Multi-Language Translation & Voice Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three observed multi-language failures in Coach Kairos: (1) English-with-accent reply when the user picked Hindi at onboarding, (2) dual-language echo where the coach repeats itself in both target language and English, (3) Hindi/Urdu going silent after the greeting.

**Architecture:** Three independent fixes, each scoped to one or two files: (a) reconcile the `home_language` ↔ `preferred_language` schema split so the text coach reads what onboarding wrote; (b) make the language directive in `detect-language.ts` always fire when ANY language column is non-null; (c) stop silently swallowing TTS errors in `useCoachVoice` and the Sarvam stream route, and either route Urdu to a working provider or hard-disable voice for unsupported languages with a user-facing notice.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Supabase (cc_student_profiles), OpenRouter Sonnet 4.6, Deepgram Aura-2 (en/es/fr/de/nl/it/ja TTS), Sarvam Bulbul v3 (Hindi/Punjabi TTS).

**Diagnosis source:** Investigation completed 2026-05-02; full report below in §Diagnosis.

---

## Diagnosis (anchors for fix tasks)

### Bug A — Schema split: onboarding writes `home_language`, text coach reads `preferred_language`
- `src/components/onboarding/LanguageGrid.tsx:38-41` — PATCHes `/api/cc/profile/voice`, which writes `home_language`.
- `src/app/api/cc/profile/voice/route.ts:18,39` — GETs/PATCHes `home_language` only.
- `src/app/api/cc/coach/message/route.ts:59,373` — SELECTs `preferred_language` only; passes it to `buildLanguageInstruction`.
- `src/app/api/cc/coach/voice-prompt/route.ts:149-154` — already does the right thing: prefers `preferred_language`, falls back to `home_language`.
- `src/lib/cc/detect-language.ts:34-36` — returns empty string if `preferredLang` is null. No directive fires → LLM defaults to English.

**Result:** User picks Hindi at onboarding → `home_language='hi'`, `preferred_language=null` → text coach gets no language directive → replies in English.

### Bug B — Dual-language echo
KAIROS_VOICE (`src/lib/brand-voice.ts:7-13`) and `coach-prompt-builder.ts:101-110` contain NO instruction to translate or echo. The dual-output behavior is the LLM autonomously code-mixing when it sees user input in script X but lacks a strong "ONLY respond in X" directive.

**Result:** Same root cause as Bug A. Fixing the schema split makes the directive fire reliably; the LLM stops code-mixing.

### Bug C — Silent-after-greeting (Hindi/Urdu)
- **Urdu has NO TTS provider.** `src/lib/cc/coach-languages.ts:32-33` declares `mode: "text-only"` for Urdu; comment says "third-party deferred post-Feature 17". `src/lib/voice-provider-router.ts:46-49,200-216` falls back to English Deepgram for unmapped languages.
- **Sarvam Bulbul v3 sometimes returns empty `audios[]`** for certain inputs. `src/app/api/language/sarvam/stream/route.ts:137-141` checks `ttsData.audios?.[0]` truthiness; if falsy, no audio event is sent. `src/app/api/language/sarvam/route.ts:323` returns `''` when audios is empty.
- **All TTS errors silently swallowed.** `src/hooks/useCoachVoice.ts:86` skips chunks on non-OK response. Line 99-102 catches audio-play errors silently. `CoachKairosContext.tsx:360` ends with `.catch(() => {})`. User hears greeting (often canned/short, succeeds) then nothing for full responses.

**Result for Urdu:** voice routes to English provider, plays English TTS of an Urdu/translated string, user hears garbage or silence.
**Result for Hindi:** Sarvam returns empty for some inputs, audio chunk skipped, silently. UI shows assistant message but no audio.

---

## File map (changed across this plan)

```
src/lib/cc/
  language-fallback.ts                 ← NEW — pickCoachLanguage(profile) helper
  language-fallback.test.ts            ← NEW — unit tests for the helper
  detect-language.ts                   ← MODIFY — accept resolved-string input, drop null-bypass
  coach-languages.ts                   ← MODIFY — export VOICE_SUPPORTED_LANGS

src/app/api/cc/coach/
  message/route.ts                     ← MODIFY — SELECT both lang columns + use helper
  voice-prompt/route.ts                ← MODIFY — use helper (DRY with text path)

src/app/api/cc/profile/voice/
  route.ts                             ← MODIFY — write BOTH home_language AND preferred_language on PATCH

src/app/api/language/sarvam/
  stream/route.ts                      ← MODIFY — log empty audio + emit error event to client
  route.ts                             ← MODIFY — log empty audio path

src/hooks/
  useCoachVoice.ts                     ← MODIFY — log TTS failures + return error so caller can surface

src/contexts/
  CoachKairosContext.tsx               ← MODIFY — surface TTS error via toast/banner state

src/lib/voice-provider-router.ts        ← MODIFY — add VOICE_SUPPORTED_LANGS check; throw for unsupported instead of silent English fallback

supabase/migrations/
  20260502_backfill_preferred_language.sql  ← NEW — backfill preferred_language from home_language for existing users
```

---

## Task 1 — Backfill migration: copy `home_language` → `preferred_language` for existing users

**Why first:** any user who completed onboarding before today has `home_language='hi'` (or whatever) but `preferred_language=null`. Even after the code fix, their text coach will keep using NULL until backfilled. Run this BEFORE the code change so that on deploy, every existing user gets the right language immediately.

**Files:**
- Create: `supabase/migrations/20260502_backfill_preferred_language.sql`

- [ ] **Step 1: Write the migration.**

```sql
-- supabase/migrations/20260502_backfill_preferred_language.sql
-- Backfill preferred_language from home_language for existing users.
-- Onboarding writes home_language only; the text-coach API path historically
-- read preferred_language, so users who completed onboarding before
-- 2026-05-02 had no language directive in their coach prompts and got
-- English replies.
UPDATE cc_student_profiles
SET preferred_language = home_language
WHERE preferred_language IS NULL
  AND home_language IS NOT NULL;
```

- [ ] **Step 2: Apply locally.** `npx supabase db push` (or run manually against the local Supabase instance). Verify with: `select count(*) from cc_student_profiles where preferred_language is null and home_language is not null;` — should be 0.

- [ ] **Step 3: Commit.**
```bash
git add supabase/migrations/20260502_backfill_preferred_language.sql
git commit -m "fix(coach): backfill preferred_language from home_language for pre-fix users"
```

---

## Task 2 — `pickCoachLanguage` helper + unit tests

**Files:**
- Create: `src/lib/cc/language-fallback.ts`
- Create: `src/lib/cc/__tests__/language-fallback.test.ts`

- [ ] **Step 1: Write the failing test FIRST.**

```typescript
// src/lib/cc/__tests__/language-fallback.test.ts
import { describe, it, expect } from "vitest";
import { pickCoachLanguage } from "../language-fallback";

describe("pickCoachLanguage", () => {
  it("returns preferred_language when set", () => {
    expect(pickCoachLanguage({ preferred_language: "hi", home_language: "en" })).toBe("hi");
  });
  it("falls back to home_language when preferred is null", () => {
    expect(pickCoachLanguage({ preferred_language: null, home_language: "hi" })).toBe("hi");
  });
  it("returns 'en' when both are null", () => {
    expect(pickCoachLanguage({ preferred_language: null, home_language: null })).toBe("en");
  });
  it("returns 'en' when both are empty strings", () => {
    expect(pickCoachLanguage({ preferred_language: "", home_language: "" })).toBe("en");
  });
  it("treats undefined like null", () => {
    expect(pickCoachLanguage({ preferred_language: undefined, home_language: undefined })).toBe("en");
  });
});
```

- [ ] **Step 2: Run the test, expect failure (module doesn't exist).** `npx vitest run src/lib/cc/__tests__/language-fallback.test.ts`. Expect: error "Cannot find module '../language-fallback'".

- [ ] **Step 3: Write the helper.**

```typescript
// src/lib/cc/language-fallback.ts
// Single source of truth for the coach's "what language do I respond in?"
// decision. preferred_language is the canonical column going forward (set
// by onboarding + every voice/text path); home_language is the legacy
// column kept for backward compatibility. Always prefer preferred_language;
// fall back to home_language; finally fall back to English.
//
// Why this exists: before 2026-05-02 the text coach read preferred_language
// and onboarding wrote home_language — they were different columns. New
// code MUST go through this helper so the bug doesn't recur.
export function pickCoachLanguage(profile: {
  preferred_language?: string | null;
  home_language?: string | null;
}): string {
  return profile.preferred_language || profile.home_language || "en";
}
```

- [ ] **Step 4: Run test, expect 5 pass.** `npx vitest run src/lib/cc/__tests__/language-fallback.test.ts`. Expect: 5/5.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/language-fallback.ts src/lib/cc/__tests__/language-fallback.test.ts
git commit -m "feat(coach): pickCoachLanguage helper + tests"
```

---

## Task 3 — Wire `pickCoachLanguage` into the text coach API

**Files:**
- Modify: `src/app/api/cc/coach/message/route.ts`

- [ ] **Step 1: Find the profile SELECT (currently line 59 and 67).** Both selects must include `home_language` alongside `preferred_language`. Read: `grep -n "preferred_language" src/app/api/cc/coach/message/route.ts`. Should show two SELECT lines and one read at line 373.

- [ ] **Step 2: Update the SELECT clauses.** Replace `preferred_language` in both SELECTs (line 59 and line 67) with `preferred_language, home_language`.

- [ ] **Step 3: Update the read site (line 373).** Replace:
```typescript
const preferredLang = (profile as { preferred_language?: string | null }).preferred_language ?? null;
```
With:
```typescript
import { pickCoachLanguage } from "@/lib/cc/language-fallback";
// ...
const preferredLang = pickCoachLanguage(profile as {
  preferred_language?: string | null;
  home_language?: string | null;
});
```
(Place the `import` at the top of the file alongside other `@/lib/cc/*` imports.)

Note: `preferredLang` will now be `"en"` instead of `null` for fully-null profiles. That's a behavior change — `detect-language.ts` (Task 5) will short-circuit when the value is `"en"` so the English-default behavior is preserved.

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`. Expect: only the pre-existing e2e error.

- [ ] **Step 5: Commit.**
```bash
git add src/app/api/cc/coach/message/route.ts
git commit -m "fix(coach): text coach reads home_language fallback so onboarding picks land"
```

---

## Task 4 — Wire `pickCoachLanguage` into the voice-prompt API

**Files:**
- Modify: `src/app/api/cc/coach/voice-prompt/route.ts`

`voice-prompt/route.ts:149-154` already has manual fallback logic — replace it with the helper for consistency.

- [ ] **Step 1: Find the read site.** `grep -n "preferred_language" src/app/api/cc/coach/voice-prompt/route.ts`. Lines 149-154 should show the manual `?? home_language` fallback.

- [ ] **Step 2: Add the import.**
```typescript
import { pickCoachLanguage } from "@/lib/cc/language-fallback";
```

- [ ] **Step 3: Replace the manual fallback (lines 149-154) with:**
```typescript
const preferredLang = pickCoachLanguage(profile as {
  preferred_language?: string | null;
  home_language?: string | null;
});
```

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 5: Commit.**
```bash
git add src/app/api/cc/coach/voice-prompt/route.ts
git commit -m "refactor(coach): voice-prompt uses pickCoachLanguage helper"
```

---

## Task 5 — Drop the null-bypass in `detect-language.ts` so the directive always fires

**Files:**
- Modify: `src/lib/cc/detect-language.ts`

`detect-language.ts:34-36` returns empty string when `preferredLang` is null. After Task 3, `preferredLang` is always a non-empty string (`"en"` minimum), so the null-bypass becomes dead code. Replace with an English short-circuit so we don't append a redundant "respond in English" directive.

- [ ] **Step 1: Read** lines 1-50 of `src/lib/cc/detect-language.ts` to confirm current behavior.

- [ ] **Step 2: Modify** the function so it short-circuits on `"en"` (since the rest of the system prompt is already in English) and emits the directive for everything else:

```typescript
// existing function header
export function buildLanguageInstruction(preferredLang: string): string {
  // English: rest of the prompt is already in English; appending "respond
  // in English" is noise. Short-circuit.
  if (!preferredLang || preferredLang === "en") return "";

  const label = LANGUAGE_LABELS[preferredLang] ?? preferredLang;
  return `

LANGUAGE: The student is writing in ${label}. Respond entirely in ${label}. Do not mix English except for proper nouns (university names like MIT, Harvard, Stanford; program names like QuestBridge, Posse; form names like CSS Profile, FAFSA) which should remain in English. Maintain the same helpful, encouraging, conversational tone as the English prompts. Use formal but accessible ${label.split(" ")[0]} appropriate for a high school student speaking to a trusted college counselor.`;
}
```

(Adapt to the actual surrounding code — read the file end-to-end to see the existing `LANGUAGE_LABELS` map and signature.)

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/detect-language.ts
git commit -m "fix(coach): always emit language directive for non-English (drops null-bypass)"
```

---

## Task 6 — `/api/cc/profile/voice` PATCH writes BOTH columns

**Why:** When users change their language post-onboarding (via the TopNav picker), the picker hits this endpoint. Today it writes only `home_language`, leaving `preferred_language` stale. Going forward, every write must touch both so they stay in sync.

**Files:**
- Modify: `src/app/api/cc/profile/voice/route.ts`

- [ ] **Step 1: Find** `update.home_language = body.language;` (around line 39).

- [ ] **Step 2: Add a sibling write:**
```typescript
update.home_language = body.language;
update.preferred_language = body.language; // keep in sync — text coach + voice coach both read this
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/app/api/cc/profile/voice/route.ts
git commit -m "fix(coach): PATCH /profile/voice writes preferred_language too (keep columns in sync)"
```

---

## Task 7 — Hard-block voice on unsupported languages (Urdu) instead of silent English fallback

**Files:**
- Modify: `src/lib/cc/coach-languages.ts`
- Modify: `src/lib/voice-provider-router.ts`

- [ ] **Step 1: In `coach-languages.ts`,** export a `VOICE_SUPPORTED_LANGS` set of language codes that have a real TTS provider. Add at the bottom:

```typescript
// Languages with a working TTS provider. Codes NOT in this set must NOT
// route through the voice path — voice-provider-router throws for them so
// useCoachVoice can surface a clear "voice not supported for <lang>" error
// instead of silently playing English audio of a translated/code-mixed
// response.
export const VOICE_SUPPORTED_LANGS: ReadonlySet<string> = new Set([
  // Deepgram Aura-2
  "en", "es", "fr", "de", "nl", "it", "ja",
  // Sarvam Bulbul v3
  "hi", "bn", "ta", "te", "gu", "kn", "ml", "mr", "pa", "od", "en-IN",
]);
```

- [ ] **Step 2: In `voice-provider-router.ts`,** import `VOICE_SUPPORTED_LANGS` and add a guard at the top of `getVoiceProviderConfig()` (or wherever the routing decision happens — line 200-216):

```typescript
import { VOICE_SUPPORTED_LANGS } from "@/lib/cc/coach-languages";

// near the top of getVoiceProviderConfig:
if (!VOICE_SUPPORTED_LANGS.has(language)) {
  throw new Error(`VOICE_UNSUPPORTED:${language}`);
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/coach-languages.ts src/lib/voice-provider-router.ts
git commit -m "fix(coach): throw on unsupported voice language instead of silent English fallback"
```

---

## Task 8 — Surface TTS errors instead of swallowing them

**Files:**
- Modify: `src/hooks/useCoachVoice.ts`
- Modify: `src/contexts/CoachKairosContext.tsx`

The current code swallows three failure modes silently (TTS non-OK at `useCoachVoice.ts:86`, audio play error at `:99-102`, top-level catch at `CoachKairosContext.tsx:360`). Convert them to a single user-facing error state so the user knows voice broke instead of waiting for nothing.

- [ ] **Step 1: In `useCoachVoice.ts`,** change the `speak()` return shape from `Promise<void>` to `Promise<{ ok: true } | { ok: false; reason: string }>`. Replace `if (!ttsRes.ok) continue;` (line 86) with:

```typescript
if (!ttsRes.ok) {
  const errText = await ttsRes.text().catch(() => "");
  console.error("[useCoachVoice] TTS request failed:", ttsRes.status, errText);
  return { ok: false, reason: `TTS_FAILED_${ttsRes.status}` };
}
```

Replace the silent audio-play `.catch` (line 99-102) with:
```typescript
.catch((e) => {
  console.error("[useCoachVoice] audio playback failed:", e);
  return { ok: false, reason: "AUDIO_PLAY_FAILED" };
});
```

Add a guard for empty blobs after the TTS response:
```typescript
const blob = await ttsRes.blob();
if (blob.size === 0) {
  console.warn("[useCoachVoice] TTS returned empty blob — Sarvam silent-output bug?");
  return { ok: false, reason: "TTS_EMPTY_AUDIO" };
}
```

At the end of the success path: `return { ok: true };`.

- [ ] **Step 2: In `CoachKairosContext.tsx`,** add a state for TTS error and wire it:

```typescript
const [ttsError, setTtsError] = useState<string | null>(null);
```

Update the `speak()` call (around line 357-362):
```typescript
if (voiceEnabled && finalContent.trim()) {
  setIsSpeaking(true);
  speak(finalContent, language)
    .then((res) => {
      if (!res.ok) setTtsError(res.reason);
      else setTtsError(null);
    })
    .finally(() => setIsSpeaking(false));
}
```

Add `ttsError` and `clearTtsError: () => setTtsError(null)` to the context value + interface.

- [ ] **Step 3: Surface** in the coach drawer UI — find the drawer component (`src/components/cc/coach/CoachKairosShell.tsx` or similar) and render a small banner when `ttsError` is set:

```tsx
{ttsError && (
  <div className="px-4 py-2 text-xs text-rose-300 bg-rose-500/10 border-t border-rose-500/20">
    Voice playback failed{ttsError === "TTS_EMPTY_AUDIO" ? " — Hindi voice glitch, please retry" : ttsError === "VOICE_UNSUPPORTED" ? " — voice not yet supported for this language" : ""}.
    <button onClick={clearTtsError} className="ml-2 underline">Dismiss</button>
  </div>
)}
```

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 5: Commit.**
```bash
git add src/hooks/useCoachVoice.ts src/contexts/CoachKairosContext.tsx src/components/cc/coach/CoachKairosShell.tsx
git commit -m "fix(coach): surface TTS errors to user instead of silent swallow"
```

---

## Task 9 — Sarvam stream route logs empty-audio responses + signals client

**Files:**
- Modify: `src/app/api/language/sarvam/stream/route.ts`
- Modify: `src/app/api/language/sarvam/route.ts`

When Sarvam returns 200 with empty `audios[0]`, log it and emit an explicit error event so the client banner can fire.

- [ ] **Step 1: In `stream/route.ts`,** find the audio emit block (line 137-141). Replace with:

```typescript
if (ttsResp.ok) {
  const ttsData = await ttsResp.json();
  if (ttsData.audios?.[0]) {
    send({ type: "audio", base64: ttsData.audios[0] });
  } else {
    console.warn("[sarvam/stream] Sarvam returned 200 but empty audios array", {
      language,
      textLength: text.length,
      response: ttsData,
    });
    send({ type: "error", code: "SARVAM_EMPTY_AUDIO" });
  }
} else {
  const errText = await ttsResp.text().catch(() => "");
  console.error("[sarvam/stream] Sarvam TTS non-OK:", ttsResp.status, errText);
  send({ type: "error", code: `SARVAM_${ttsResp.status}` });
}
```

- [ ] **Step 2: In `route.ts`** (line ~323), apply the same logging:

```typescript
audioBase64 = ttsData.audios?.[0] || "";
if (!audioBase64) {
  console.warn("[sarvam] empty audios — possible Bulbul-v3 silent output", {
    textLength: text.length,
  });
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/app/api/language/sarvam/stream/route.ts src/app/api/language/sarvam/route.ts
git commit -m "fix(sarvam): log empty-audio responses + emit error event for client surfacing"
```

---

## Task 10 — Smoke-test matrix + final verification

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`.
- [ ] **Step 2: Tests.** `npx vitest run`. Expect: existing 238 + 5 new (language-fallback) = 243 tests passing.
- [ ] **Step 3: Manual smoke-test matrix** (with dev server `npm run dev`):

| Onboarding language | Expected text reply | Expected voice |
|---|---|---|
| English | English | Plays English (Deepgram) |
| Hindi | Hindi (Devanagari) — no English code-mix | Plays Hindi (Sarvam Bulbul) |
| Urdu | Urdu (Nastaliq) — no English code-mix | Banner: "voice not yet supported for Urdu" |
| Spanish | Spanish | Plays Spanish (Deepgram) |

For each: open `/onboarding/language`, pick the language, advance through onboarding, open coach drawer, send "Hello, I want to apply to MIT". Verify text language and voice behavior matches the table.

- [ ] **Step 4: Push.**
```bash
git push origin master
```

- [ ] **Step 5: Verify in production** that an existing Hindi user (DB row pre-Task-1 backfill) sees the directive fire.

---

## Self-review

**Spec coverage:** All three observed bugs (English-with-accent, dual-language echo, silent-after-greeting) addressed by Tasks 3+5 (schema split + directive), Task 7 (Urdu hard-block), and Tasks 8+9 (TTS error surfacing).

**Placeholder scan:** No TBD/TODO. Every task has executable code or a concrete edit instruction with file:line refs.

**Type consistency:** `pickCoachLanguage` return type is `string` (always non-null), used uniformly in Tasks 3, 4. `VOICE_SUPPORTED_LANGS: ReadonlySet<string>` typed. `speak()` return shape `{ ok: boolean; reason?: string }` consistent across hook + caller.

**Risk:** Task 6 (writing both columns on PATCH) means future schema migrations must be aware that both columns exist. Task 1's backfill makes them equal NOW; Task 6 keeps them equal going forward. If a future task wants to deprecate `home_language`, that's safe since the helper prefers `preferred_language` first.

---

## Execution

Same pattern as the dashboard plan: pick **Subagent-Driven** (recommended — most tasks are mechanical) or **Inline Execution**. Each task commits atomically so a partial revert is always possible.
