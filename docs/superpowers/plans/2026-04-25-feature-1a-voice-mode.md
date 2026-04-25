# Feature 1A — Hindi/Punjabi Voice + Multilingual Coach Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the multilingual coach moat — first-login language picker (18 langs incl. Urdu text-only), Family Mode for parents, bilingual brainstorm dual-output, Urdu RTL/Nastaliq, voice quality check, and the Urdu-voice-fails-silently latent bug fix.

**Architecture:** Next.js 14 App Router + Supabase (Postgres + RLS). Streaming brainstorm reply unchanged; English canvas-fragment extraction runs as a small post-stream Claude call gated by `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED` with silent fallback. Family Mode is a modal overlay reusing existing voice provider routing with system-prompt swap; transcripts go to an isolated `cc_family_mode_turns` table. Urdu is text-only (no TTS provider supports it yet) — voice toggle gated with "Try Hindi voice instead." Middleware enforces one-time language picker via `language_picker_seen_at IS NULL`.

**Tech Stack:** Next.js 14 App Router, TypeScript 5 strict, React 19, Tailwind v4, Supabase (Postgres + pgvector + RLS), Claude Sonnet 4.6 via OpenRouter, Deepgram Aura TTS (7 langs) + Sarvam Bulbul v3 (11 Indic), Vitest for unit tests, Playwright for e2e.

**Spec:** [`docs/superpowers/specs/2026-04-25-feature-1a-voice-mode-design.md`](../specs/2026-04-25-feature-1a-voice-mode-design.md)

---

## Codebase corrections (vs spec)

Three minor spec/code mismatches surfaced during exploration. The plan resolves each:

1. **`/api/cc/profile/voice` uses `PATCH`, not `POST`.** Spec said POST; the existing route is PATCH. Plan extends PATCH with optional flags.
2. **Coach drawer language picker (`CoachKairosShell.tsx`) uses `COACH_LANGUAGES` from `src/lib/cc/coach-languages.ts`, which only has 8 entries.** Plan expands this single source file to 18 entries (drives drawer + onboarding + brainstorm picker).
3. **`TopNavLanguagePicker` already renders globally for any authenticated user** (TopNav.tsx:81 `{user && ...}`); only the autosave indicator is `/cc`-gated. So the "global picker" deliverable reduces to: add the text-only Urdu badge to that picker. Real fix: use the same expanded language list and surface mode badges.

---

## File Structure

### New files
| Path | Purpose |
|---|---|
| `supabase/migrations/20260425_feature_1a_voice_mode.sql` | Schema migration (3 column adds + 1 new table + RLS) |
| `src/app/onboarding/language/page.tsx` | First-login full-screen 18-tile picker route |
| `src/components/onboarding/LanguageGrid.tsx` | Reusable 18-tile picker grid |
| `src/app/api/cc/essays/[id]/canvas-extract/route.ts` | POST: extract English fragment from latest brainstorm turn |
| `src/lib/cc/canvas-extract.ts` | Extraction prompt + non-Latin regex guard + retry helper |
| `src/lib/cc/family-mode-prompts.ts` | System prompts × 17 voice langs |
| `src/lib/cc/family-mode-strings.ts` | UI strings (17 voice langs × 6 keys = 102) |
| `src/components/family-mode/FamilyModeView.tsx` | Reskinned coach surface modal overlay |
| `src/components/family-mode/FamilyModeMicButton.tsx` | 96×96 centered mic button |
| `src/components/family-mode/HandToParentButton.tsx` | Coach drawer header trigger |
| `src/components/voice/VoiceQualityCheck.tsx` | Pre-session mic + 3s playback test |
| `src/app/api/cc/coach/family-mode/message/route.ts` | POST: parent-facing chat (writes `cc_family_mode_turns`) |
| `src/lib/cc/__tests__/canvas-extract.test.ts` | Unit tests for non-Latin regex guard |
| `src/lib/cc/__tests__/family-mode-prompts.test.ts` | Unit tests for prompt builder |

### Modified files
| Path | Change |
|---|---|
| `src/lib/cc/coach-languages.ts` | Expand to 18 entries with `mode: "voice" \| "text-only"` and `isRTL?` |
| `src/app/api/cc/profile/voice/route.ts` | Accept optional `markPickerSeen`, `markVoiceCheckPassed` flags |
| `src/contexts/CoachKairosContext.tsx` | Add `familyMode` state + `toggleFamilyMode` |
| `src/middleware.ts` | Redirect to `/onboarding/language` if `language_picker_seen_at IS NULL` |
| `src/app/layout.tsx` | Set `<html lang>` from CoachKairosContext language |
| `src/app/globals.css` | `@import` Nastaliq + `[lang="ur"]` block |
| `src/components/cc/coach/CoachKairosShell.tsx` | Render `<FamilyModeView>` when active; embed `<HandToParentButton>`; voice toggle gate for Urdu |
| `src/components/cc/essay/BrainstormChat.tsx` | Post-stream extraction; `dir="auto"` on bubbles; voice gate for Urdu; rename "themes" → "directions" in canvas tab; new "Fragments" card |
| `src/components/layout/TopNavLanguagePicker.tsx` | Use shared 18-lang list; `📝` badge for text-only |

---

## Tasks

### Task 1: Schema migration

**Files:**
- Create: `supabase/migrations/20260425_feature_1a_voice_mode.sql`

- [ ] **Step 1: Write migration**

```sql
-- supabase/migrations/20260425_feature_1a_voice_mode.sql
-- Feature 1A: voice mode + family mode + bilingual canvas
-- Idempotent so re-running is safe.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS language_picker_seen_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voice_quality_check_passed_at TIMESTAMPTZ;

ALTER TABLE cc_essays
  ADD COLUMN IF NOT EXISTS canvas_fragments JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS cc_family_mode_turns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'coach')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cc_family_mode_turns_student_idx
  ON cc_family_mode_turns(student_id, created_at DESC);

ALTER TABLE cc_family_mode_turns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students read their own family mode turns" ON cc_family_mode_turns;
CREATE POLICY "students read their own family mode turns"
  ON cc_family_mode_turns FOR SELECT
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students write their own family mode turns" ON cc_family_mode_turns;
CREATE POLICY "students write their own family mode turns"
  ON cc_family_mode_turns FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
```

- [ ] **Step 2: Push migration to Supabase**

Run: `npx supabase db push`
Expected: "Applying migration 20260425_feature_1a_voice_mode.sql..." then "Finished supabase db push."

- [ ] **Step 3: Verify schema**

Run: `npx supabase db inspect db --linked --schema public 2>&1 | grep -E "language_picker_seen_at|canvas_fragments|cc_family_mode_turns"`
Expected: 3 hits — column on `cc_student_profiles`, column on `cc_essays`, table `cc_family_mode_turns`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260425_feature_1a_voice_mode.sql
git commit -m "feat(1a): schema for language picker, voice check, canvas fragments, family mode"
```

---

### Task 2: Expand language config to 18 entries

**Files:**
- Modify: `src/lib/cc/coach-languages.ts`
- Test: `src/lib/cc/__tests__/coach-languages.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/cc/__tests__/coach-languages.test.ts
import { describe, it, expect } from "vitest";
import { COACH_LANGUAGES, getCoachLanguage, isVoiceLanguage } from "../coach-languages";

describe("COACH_LANGUAGES", () => {
  it("includes 18 languages (17 voice + Urdu text-only)", () => {
    expect(COACH_LANGUAGES).toHaveLength(18);
  });

  it("marks Urdu as text-only with isRTL", () => {
    const urdu = COACH_LANGUAGES.find((l) => l.code === "ur");
    expect(urdu?.mode).toBe("text-only");
    expect(urdu?.isRTL).toBe(true);
  });

  it("marks all non-Urdu langs as voice", () => {
    const voiceCount = COACH_LANGUAGES.filter((l) => l.mode === "voice").length;
    expect(voiceCount).toBe(17);
  });

  it("isVoiceLanguage returns true for Hindi, false for Urdu", () => {
    expect(isVoiceLanguage("hi")).toBe(true);
    expect(isVoiceLanguage("ur")).toBe(false);
  });

  it("getCoachLanguage falls back to English for unknown code", () => {
    expect(getCoachLanguage("xx").code).toBe("en");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cc/__tests__/coach-languages.test.ts`
Expected: FAIL — `COACH_LANGUAGES` has 8, test expects 18; `isVoiceLanguage` not exported.

- [ ] **Step 3: Replace `coach-languages.ts` with the expanded list**

```ts
// src/lib/cc/coach-languages.ts
export type LanguageMode = "voice" | "text-only";

export type CoachLanguage = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  mode: LanguageMode;
  isRTL?: boolean;
};

export const COACH_LANGUAGES: CoachLanguage[] = [
  // Deepgram Aura-2 TTS (7 langs)
  { code: "en", name: "English",   nativeName: "English",     flag: "\u{1F1FA}\u{1F1F8}", mode: "voice" },
  { code: "es", name: "Spanish",   nativeName: "Español", flag: "\u{1F1EA}\u{1F1F8}", mode: "voice" },
  { code: "fr", name: "French",    nativeName: "Français", flag: "\u{1F1EB}\u{1F1F7}", mode: "voice" },
  { code: "de", name: "German",    nativeName: "Deutsch",      flag: "\u{1F1E9}\u{1F1EA}", mode: "voice" },
  { code: "it", name: "Italian",   nativeName: "Italiano",     flag: "\u{1F1EE}\u{1F1F9}", mode: "voice" },
  { code: "nl", name: "Dutch",     nativeName: "Nederlands",   flag: "\u{1F1F3}\u{1F1F1}", mode: "voice" },
  { code: "ja", name: "Japanese",  nativeName: "日本語", flag: "\u{1F1EF}\u{1F1F5}", mode: "voice" },
  // Sarvam Bulbul v3 TTS (10 Indic langs)
  { code: "hi", name: "Hindi",     nativeName: "हिन्दी", flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "bn", name: "Bengali",   nativeName: "বাংলা",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు", flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "gu", name: "Gujarati",  nativeName: "ગુજરાતી", flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "kn", name: "Kannada",   nativeName: "ಕನ್ನಡ",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "mr", name: "Marathi",   nativeName: "मराठी",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "pa", name: "Punjabi",   nativeName: "ਪੰਜਾਬੀ", flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "od", name: "Odia",     nativeName: "ଓଡ଼ିଆ",        flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  // Text-only (no TTS provider supports Urdu yet — third-party deferred post-Feature 17)
  { code: "ur", name: "Urdu",     nativeName: "اردو",              flag: "\u{1F1F5}\u{1F1F0}", mode: "text-only", isRTL: true },
];

export const DEFAULT_COACH_LANGUAGE = "en";

export function getCoachLanguage(code: string): CoachLanguage {
  return COACH_LANGUAGES.find((l) => l.code === code) || COACH_LANGUAGES[0];
}

export function isVoiceLanguage(code: string): boolean {
  return getCoachLanguage(code).mode === "voice";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/cc/__tests__/coach-languages.test.ts`
Expected: PASS — 5/5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/coach-languages.ts src/lib/cc/__tests__/coach-languages.test.ts
git commit -m "feat(1a): expand COACH_LANGUAGES to 18 entries with voice/text-only modes"
```

---

### Task 3: Extend `/api/cc/profile/voice` with picker + voice-check flags

**Files:**
- Modify: `src/app/api/cc/profile/voice/route.ts`

- [ ] **Step 1: Replace the route file**

```ts
// src/app/api/cc/profile/voice/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const ALLOWED_LANGS = new Set(COACH_LANGUAGES.map((l) => l.code));

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { data } = await auth.supabase
    .from("cc_student_profiles")
    .select("home_language, language_picker_seen_at, voice_quality_check_passed_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({
    language: data?.home_language || "en",
    languagePickerSeenAt: data?.language_picker_seen_at ?? null,
    voiceQualityCheckPassedAt: data?.voice_quality_check_passed_at ?? null,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    language?: string;
    markPickerSeen?: boolean;
    markVoiceCheckPassed?: boolean;
  };

  const update: Record<string, unknown> = {};
  if (body.language !== undefined) {
    if (!ALLOWED_LANGS.has(body.language)) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }
    update.home_language = body.language;
  }
  if (body.markPickerSeen) {
    update.language_picker_seen_at = new Date().toISOString();
  }
  if (body.markVoiceCheckPassed) {
    update.voice_quality_check_passed_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("cc_student_profiles")
    .update(update)
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: Object.keys(update) });
}
```

- [ ] **Step 2: Manually smoke-test the endpoint**

```bash
# In one terminal
pnpm dev
# In another (substitute your dev session cookie)
curl -X PATCH http://localhost:3000/api/cc/profile/voice \
  -H "Content-Type: application/json" \
  -H "Cookie: <session>" \
  -d '{"language":"hi","markPickerSeen":true}'
```
Expected: `{"ok":true,"updated":["home_language","language_picker_seen_at"]}`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/profile/voice/route.ts
git commit -m "feat(1a): extend /api/cc/profile/voice with markPickerSeen + markVoiceCheckPassed flags"
```

---

### Task 4: Build LanguageGrid component

**Files:**
- Create: `src/components/onboarding/LanguageGrid.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/onboarding/LanguageGrid.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COACH_LANGUAGES, type CoachLanguage } from "@/lib/cc/coach-languages";
import { Mic, FileText, Loader2 } from "lucide-react";

const GREETINGS: Record<string, string> = {
  en: "I'm here to listen to your story",
  es: "Estoy aquí para escuchar tu historia",
  fr: "Je suis là pour écouter ton histoire",
  de: "Ich bin hier, um deine Geschichte zu hören",
  it: "Sono qui per ascoltare la tua storia",
  nl: "Ik ben hier om je verhaal te horen",
  ja: "あなたの物語を聞きたい",
  hi: "मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ",
  bn: "আমি তোমার গল্প শুনতে এসেছি",
  ta: "உம் கதையை கேடக வந்துள்ளேன்",
  te: "મீ ಕಥ విನುವರಿಗ௦ பீரை ವಚை்ரைன்",
  gu: "હું તમારீ વાર்તા સાંભળવા આવீ છું",
  kn: "நாந் நிம்ம க஥ெயந்நு கேக்குவிகெ இல்லி஦்஦ேனே",
  ml: "நிங்களுடெ க஥ கேட்கான் ஞான் இவிடெ உண்டு",
  mr: "मी तुझी गोष्ट ऐकायला येथे आहे",
  pa: "ਤੁਹਾਡੀ ਕਹਾਣੀ ਸੁਣਨ ਲਈ ਇੱਥੇ ਹਾਂ",
  od: "ମୁଁ ତୁମ କଥା ଶୁଣିବାକୁ ଯାଇଦୃଶ",
  ur: "میں تمهاری کہانی سننے کے لیے یہاں ہوں",
};

export default function LanguageGrid({ initialLanguage }: { initialLanguage: string }) {
  const router = useRouter();
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (lang: CoachLanguage) => {
    setPendingCode(lang.code);
    setError(null);
    try {
      const res = await fetch("/api/cc/profile/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang.code, markPickerSeen: true }),
      });
      if (!res.ok) throw new Error("save failed");
      try { localStorage.setItem("coach_kairos_language", lang.code); } catch {}
      router.push("/?coach=open&focus=intake");
    } catch {
      setError("Couldn't save. Tap again to retry.");
      setPendingCode(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05080d] text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-center">
        Welcome to KairosLearn
      </h1>
      <p className="text-white/60 text-sm md:text-base mb-10 text-center max-w-xl">
        What language would you like Coach Kairos to speak with you? You can change this anytime.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-5xl">
        {COACH_LANGUAGES.map((lang) => {
          const isSelected = lang.code === initialLanguage;
          const isPending = pendingCode === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={pendingCode !== null}
              onClick={() => handlePick(lang)}
              dir={lang.isRTL ? "rtl" : "ltr"}
              lang={lang.code}
              aria-pressed={isSelected}
              className={`
                relative aspect-[4/3] rounded-2xl border p-4 flex flex-col items-center justify-between text-center transition
                ${isSelected ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}
                ${pendingCode !== null && !isPending ? "opacity-30" : ""}
              `}
            >
              <span className="text-2xl md:text-3xl font-medium">{lang.nativeName}</span>
              <span className="text-[11px] text-white/55 line-clamp-2">{GREETINGS[lang.code]}</span>
              <span
                className={`text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  lang.mode === "voice" ? "text-[#D4AF37] bg-[#D4AF37]/10" : "text-white/40 bg-white/5"
                }`}
              >
                {lang.mode === "voice" ? <Mic className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                {lang.mode === "voice" ? "Voice" : "Text only"}
              </span>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-rose-400 text-sm mt-6">{error}</p>}
      <p className="text-[11px] text-white/35 mt-10 text-center max-w-md">
        The platform interface stays in English. Coach Kairos will speak your chosen language. Urdu is text-only — voice support coming soon.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/onboarding/LanguageGrid.tsx
git commit -m "feat(1a): LanguageGrid 18-tile picker component"
```

---

### Task 5: Onboarding language route

**Files:**
- Create: `src/app/onboarding/language/page.tsx`

- [ ] **Step 1: Write the route**

```tsx
// src/app/onboarding/language/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import LanguageGrid from "@/components/onboarding/LanguageGrid";

export const dynamic = "force-dynamic";

export default async function OnboardingLanguagePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  let initialLanguage = "en";
  if (user) {
    const { data } = await supabase
      .from("cc_student_profiles")
      .select("home_language")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.home_language) initialLanguage = data.home_language;
  }

  return <LanguageGrid initialLanguage={initialLanguage} />;
}
```

- [ ] **Step 2: Visit `/onboarding/language` in dev**

Run: `pnpm dev` then open `http://localhost:3000/onboarding/language`.
Expected: 18-tile picker renders. Clicking a tile briefly shows a spinner, then redirects to `/?coach=open&focus=intake`.

- [ ] **Step 3: Commit**

```bash
git add src/app/onboarding/language/page.tsx
git commit -m "feat(1a): /onboarding/language route"
```

---

### Task 6: Middleware redirect for unseen picker

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add a profile lookup + redirect after the existing `if (!user)` block**

Insert this block after line 164 (the existing `if (!user)` early-return), before the `// --- Root / landing routing` comment:

```ts
  // --- One-time language picker (Feature 1A) -----------------------------
  // Real users (not anon) who haven't seen the picker get bounced to the picker
  // route once. We skip the API surface and the picker itself, plus a small
  // public-ish allowlist (login, billing webhooks already short-circuited above).
  const isPickerExempt =
    pathname === "/onboarding/language" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/cc/shared") ||
    pathname.startsWith("/auth/");

  if (isRealUser && !isPickerExempt) {
    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("language_picker_seen_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile && profile.language_picker_seen_at == null) {
      return NextResponse.redirect(new URL("/onboarding/language", request.url));
    }
  }
```

- [ ] **Step 2: Manual smoke-test**

In Supabase SQL editor (or via `psql`):
```sql
UPDATE cc_student_profiles
   SET language_picker_seen_at = NULL
 WHERE user_id = '<your test user id>';
```
Reload `/` in the browser.
Expected: redirected to `/onboarding/language`. Pick a language. Reload `/`. Expected: stays on `/`.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(1a): middleware redirects to /onboarding/language until picker seen"
```

---

### Task 7: TopNav language picker — add text-only badge for Urdu

**Files:**
- Modify: `src/components/layout/TopNavLanguagePicker.tsx`
- Modify: `src/components/cc/LanguagePicker.tsx`

- [ ] **Step 1: Extend `LanguageOption` type with optional `mode` and badge rendering**

Replace `src/components/cc/LanguagePicker.tsx` lines 6-11 (the `LanguageOption` type) with:

```ts
export type LanguageOption = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  mode?: "voice" | "text-only";
};
```

In the same file, replace the `<span className="text-[10px] text-white/40">{opt.label}</span>` line (around line 89) with:

```tsx
<span className="text-[10px] text-white/40">{opt.label}</span>
{opt.mode === "text-only" && (
  <span className="text-[9px] uppercase tracking-wide text-white/40 ml-1">Text</span>
)}
```

- [ ] **Step 2: Replace `TopNavLanguagePicker.tsx` to use shared 18-lang list**

```tsx
// src/components/layout/TopNavLanguagePicker.tsx
"use client";

import { useState, useSyncExternalStore } from "react";
import { LanguagePicker, type LanguageOption } from "@/components/cc/LanguagePicker";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const LANG_OPTIONS: LanguageOption[] = COACH_LANGUAGES.map((l) => ({
  code: l.code,
  label: l.name,
  nativeLabel: l.nativeName,
  flag: l.flag,
  mode: l.mode,
}));

const STORAGE_KEY = "coach-language";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener("coach-language-change", handler as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("coach-language-change", handler as EventListener);
  };
}
function getSnapshot(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(STORAGE_KEY) || localStorage.getItem("coach_kairos_language") || "en";
}
function getServerSnapshot(): string { return "en"; }

export default function TopNavLanguagePicker({ className = "" }: { className?: string }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = useState<string | null>(null);
  const value = override ?? stored;

  const handleChange = (code: string) => {
    setOverride(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      localStorage.setItem("coach_kairos_language", code);
    } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("coach-language-change", { detail: code }));
    fetch("/api/cc/profile/voice", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: code }),
    }).catch(() => { /* non-fatal */ });
  };

  return <LanguagePicker options={LANG_OPTIONS} value={value} onChange={handleChange} className={className} />;
}
```

- [ ] **Step 3: Visual smoke-test**

`pnpm dev`, log in, open the language picker in TopNav.
Expected: 18 options listed. The Urdu row shows "Text" badge after the language name.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/TopNavLanguagePicker.tsx src/components/cc/LanguagePicker.tsx
git commit -m "feat(1a): TopNav language picker shows 18 options + text-only badge for Urdu"
```

---

### Task 8: Globals.css — Nastaliq font + RTL block

**Files:**
- Modify: `src/app/globals.css`
- Run: `pnpm add @fontsource/noto-nastaliq-urdu`

- [ ] **Step 1: Install font**

Run: `pnpm add @fontsource/noto-nastaliq-urdu`
Expected: package added to `package.json`.

- [ ] **Step 2: Add `@import` and `[lang="ur"]` block to `src/app/globals.css`**

After the `@import "./tokens.css";` line (line 2), add:

```css
@import "@fontsource/noto-nastaliq-urdu/400.css";

[lang="ur"] {
  direction: rtl;
  text-align: right;
  font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif;
  line-height: 2.0;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css package.json pnpm-lock.yaml
git commit -m "feat(1a): Nastaliq font + [lang=\"ur\"] RTL block"
```

---

### Task 9: Set `<html lang>` from CoachKairosContext

**Files:**
- Modify: `src/contexts/CoachKairosContext.tsx`

- [ ] **Step 1: Add an effect that mirrors `language` to `document.documentElement.lang`**

Insert after the existing `useEffect` for localStorage hydration (after line 68 — the block that ends `if (storedVoice === "true") setVoiceEnabledState(true);`):

```ts
  // Mirror the active coach language to <html lang>. Browsers, screen readers,
  // and the [lang="ur"] RTL CSS rule all key off this attribute.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);
```

- [ ] **Step 2: Smoke-test**

`pnpm dev`, open DevTools → Elements panel, set language to Urdu via the picker.
Expected: `<html lang="ur">` and the page direction flips for any element using `[lang="ur"]`.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/CoachKairosContext.tsx
git commit -m "feat(1a): mirror coach language to <html lang> for RTL CSS + a11y"
```

---

### Task 10: `dir="auto"` on coach-rendered surfaces + voice gate for Urdu in coach drawer

**Files:**
- Modify: `src/components/cc/coach/CoachKairosShell.tsx`
- Modify: `src/components/cc/coach/CoachChat.tsx`

- [ ] **Step 1: Add voice toggle gate in `CoachKairosShell.tsx`**

In the voice toggle button block (around line 136-149), wrap the button so when `language === "ur"` it disables and shows a hint:

Replace:
```tsx
<button
  onClick={() => {
    if (isSpeaking) stopSpeaking();
    setVoiceEnabled(!voiceEnabled);
  }}
  className={...}
  title={voiceEnabled ? "Voice on — click to disable" : "Voice off — click to enable"}
>
  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
</button>
```

With:
```tsx
{language === "ur" ? (
  <button
    type="button"
    disabled
    className="p-1.5 rounded-lg text-white/30 cursor-not-allowed"
    title="Voice for Urdu coming soon — try Hindi for voice"
  >
    <VolumeX className="w-4 h-4" />
  </button>
) : (
  <button
    onClick={() => {
      if (isSpeaking) stopSpeaking();
      setVoiceEnabled(!voiceEnabled);
    }}
    className={`p-1.5 rounded-lg transition-colors ${
      voiceEnabled
        ? "bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/20"
        : "hover:bg-white/5 text-white/40 hover:text-white/60"
    }`}
    title={voiceEnabled ? "Voice on — click to disable" : "Voice off — click to enable"}
  >
    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
  </button>
)}
```

- [ ] **Step 2: Add `dir="auto"` to coach bubbles in `CoachChat.tsx`**

Run: `grep -n "kl-coach-bubble\|p className" src/components/cc/coach/CoachChat.tsx | head -10`

For each `<p>` or `<div>` rendering message content (typically a `<p className="...">{message.content}</p>` or similar), add `dir="auto"` to the element. Add the same to the textarea/input.

Example: change `<p className="text-sm leading-relaxed">{m.content}</p>` to `<p className="text-sm leading-relaxed" dir="auto">{m.content}</p>`.

- [ ] **Step 3: Smoke-test**

`pnpm dev`, switch coach to Urdu, send a message in Urdu (typed). Expected: bubble renders right-to-left in Nastaliq. Coach response (if returned in Urdu) also RTL.

Switch language to English. Expected: voice toggle re-enabled. Switch back to Urdu. Expected: voice toggle is disabled with the "coming soon" tooltip.

- [ ] **Step 4: Commit**

```bash
git add src/components/cc/coach/CoachKairosShell.tsx src/components/cc/coach/CoachChat.tsx
git commit -m "feat(1a): coach drawer voice-toggle gate for Urdu + dir=auto on bubbles"
```

---

### Task 11: Voice-toggle gate + `dir="auto"` in BrainstormChat

**Files:**
- Modify: `src/components/cc/essay/BrainstormChat.tsx`

- [ ] **Step 1: Find the voice toggle button**

Run: `grep -n "voiceOn\|setVoiceOn\|aria-pressed" src/components/cc/essay/BrainstormChat.tsx | head -10`
This locates the brainstorm-page voice toggle (around line 600 and 756 per earlier exploration).

- [ ] **Step 2: Wrap each voice toggle with an Urdu gate**

For each occurrence of the voice toggle, wrap the click/disabled state so `langCode === "ur"` disables it. Pattern:

```tsx
{langCode === "ur" ? (
  <button
    type="button"
    disabled
    className="kl-voice-toggle is-disabled"
    title="Voice for Urdu coming soon — switch to Hindi for voice"
  >
    Voice off
  </button>
) : (
  /* existing voice toggle button unchanged */
)}
```

- [ ] **Step 3: Add `dir="auto"` to the message bubble and composer textarea**

Find the message bubble JSX (search `kl-msg-bubble` in this file) and add `dir="auto"` to the bubble container. Add `dir="auto"` to the `<textarea>` (the input ref'd by `textareaRef`).

- [ ] **Step 4: Smoke-test**

Open a brainstorm in dev, switch language to Urdu via picker. Expected: voice toggle disabled with tooltip. Type Urdu in the composer — text renders RTL in Nastaliq.

- [ ] **Step 5: Commit**

```bash
git add src/components/cc/essay/BrainstormChat.tsx
git commit -m "feat(1a): brainstorm voice-toggle gate for Urdu + dir=auto on bubbles + composer"
```

---

### Task 12: Canvas extraction lib (prompt + non-Latin regex guard)

**Files:**
- Create: `src/lib/cc/canvas-extract.ts`
- Test: `src/lib/cc/__tests__/canvas-extract.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/cc/__tests__/canvas-extract.test.ts
import { describe, it, expect } from "vitest";
import { containsNonLatin, CANVAS_EXTRACT_SYSTEM } from "../canvas-extract";

describe("containsNonLatin", () => {
  it("returns true for Devanagari (Hindi/Marathi)", () => {
    expect(containsNonLatin("मैं कहानी")).toBe(true);
  });
  it("returns true for Gurmukhi (Punjabi)", () => {
    expect(containsNonLatin("ਤੁਹਾਡੀ")).toBe(true);
  });
  it("returns true for Nastaliq (Urdu)", () => {
    expect(containsNonLatin("کہانی")).toBe(true);
  });
  it("returns true for Bengali", () => {
    expect(containsNonLatin("বাংলা")).toBe(true);
  });
  it("returns true for Hiragana", () => {
    expect(containsNonLatin("あなた")).toBe(true);
  });
  it("returns false for plain English with punctuation and digits", () => {
    expect(containsNonLatin("I played the violin in Turkey — and ranked #2.")).toBe(false);
  });
  it("returns false for English with European diacritics (Spanish/French)", () => {
    expect(containsNonLatin("Mi país es España — c'est la vie!")).toBe(false);
  });
});

describe("CANVAS_EXTRACT_SYSTEM", () => {
  it("contains the English-only directive", () => {
    expect(CANVAS_EXTRACT_SYSTEM).toMatch(/ENGLISH ONLY/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cc/__tests__/canvas-extract.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the lib**

```ts
// src/lib/cc/canvas-extract.ts

// Devanagari, Bengali, Gurmukhi, Gujarati, Oriya, Tamil, Telugu, Kannada,
// Malayalam, Arabic/Nastaliq, CJK Hiragana/Katakana — covers every script our
// 17 voice languages can output, plus Urdu (text-only) script.
export const NON_LATIN_RE =
  /[ऀ-ॿঀ-৿਀-੿઀-૿଀-୿஀-௿ఀ-౿ಀ-೿ഀ-ൿ؀-ۿ぀-ヿ]/;

export function containsNonLatin(s: string): boolean {
  return NON_LATIN_RE.test(s);
}

export const CANVAS_EXTRACT_SYSTEM = `
You extract English story material from a brainstorm conversation that may be in any language.

Given the student's last message and the coach's response (which may be in Hindi, Punjabi, Urdu,
Spanish, etc.), output a JSON object with:
  - fragment: 1-2 English sentences capturing concrete lived material the student shared.
              Specific, scene-based, no abstractions. NEVER an interpretation or theme.
  - tags:     0-3 short English theme labels (3 words max each).

[OUTPUT LANGUAGE: ENGLISH ONLY — even if the conversation was in another language.
This output feeds an English essay editor; non-English text breaks the pipeline.]

If the student's message has no extractable material (small talk, meta-question), return:
  { "fragment": "", "tags": [] }

Respond with the JSON object only. No prose, no code fences.
`.trim();

export type CanvasExtractResult = { fragment: string; tags: string[] };

const EMPTY: CanvasExtractResult = { fragment: "", tags: [] };

function parseExtract(raw: string): CanvasExtractResult {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const fragment = typeof parsed.fragment === "string" ? parsed.fragment.trim() : "";
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags.filter((t: unknown): t is string => typeof t === "string").slice(0, 3)
      : [];
    return { fragment, tags };
  } catch {
    return EMPTY;
  }
}

/**
 * Run the Claude extraction call with a single retry if the model emits non-Latin script.
 * `callLLM` is injected so this function can be unit-tested without an API key.
 */
export async function extractCanvasFragment(
  studentMessage: string,
  coachResponse: string,
  callLLM: (system: string, user: string) => Promise<string>,
): Promise<CanvasExtractResult> {
  const userPrompt = `Student's last message:\n${studentMessage}\n\nCoach's response:\n${coachResponse}`;

  const first = parseExtract(await callLLM(CANVAS_EXTRACT_SYSTEM, userPrompt));
  if (!containsNonLatin(first.fragment)) return first;

  const stronger = `${CANVAS_EXTRACT_SYSTEM}\n\nIMPORTANT: PREVIOUS OUTPUT WAS NOT ENGLISH. Respond in English only.`;
  const second = parseExtract(await callLLM(stronger, userPrompt));
  if (!containsNonLatin(second.fragment)) return second;

  return EMPTY; // give up silently
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/cc/__tests__/canvas-extract.test.ts`
Expected: PASS — 8/8.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/canvas-extract.ts src/lib/cc/__tests__/canvas-extract.test.ts
git commit -m "feat(1a): canvas-extract lib with non-Latin regex guard + retry"
```

---

### Task 13: Canvas extraction API route

**Files:**
- Create: `src/app/api/cc/essays/[id]/canvas-extract/route.ts`

- [ ] **Step 1: Write the route**

```ts
// src/app/api/cc/essays/[id]/canvas-extract/route.ts
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { extractCanvasFragment } from "@/lib/cc/canvas-extract";
import { streamLLM, collectStream } from "@/lib/cc/llm-stream";

type Fragment = {
  turnId: string;
  fragment: string;
  tags: string[];
  createdAt: string;
};

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();
  const { data: essay, error } = await db
    .from("cc_essays")
    .select("id, student_id, brainstorm_transcript, canvas_fragments")
    .eq("id", id)
    .single();
  if (error || !essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile || profile.id !== essay.student_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // brainstorm_transcript is stored as TEXT (JSON-stringified) but Supabase may
  // auto-parse it; handle both shapes.
  const raw = essay.brainstorm_transcript as unknown;
  let transcript: { role: string; content: string }[] = [];
  if (Array.isArray(raw)) transcript = raw;
  else if (typeof raw === "string") {
    try { transcript = JSON.parse(raw); } catch { transcript = []; }
  }
  if (transcript.length < 2) {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  const last = transcript[transcript.length - 1];
  const prev = transcript[transcript.length - 2];
  if (last.role !== "assistant" || prev.role !== "user") {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  // Use the existing streamLLM helper, but collect the full string in one shot.
  const callLLM = async (system: string, user: string) => {
    const result = await streamLLM(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { maxTokens: 200, temperature: 0.2 },
    );
    if (!result) return "";
    return collectStream(result.stream);
  };

  let extract;
  try {
    extract = await extractCanvasFragment(prev.content, last.content, callLLM);
  } catch (err) {
    console.warn("[canvas-extract] callLLM failed", err);
    return NextResponse.json({ fragment: "", tags: [] });
  }

  if (!extract.fragment) {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  const turnId = `${id}-${transcript.length - 1}`;
  const newFragment: Fragment = {
    turnId,
    fragment: extract.fragment,
    tags: extract.tags,
    createdAt: new Date().toISOString(),
  };
  const updated: Fragment[] = [...((essay.canvas_fragments ?? []) as Fragment[]), newFragment];

  await db.from("cc_essays").update({ canvas_fragments: updated }).eq("id", id);

  return NextResponse.json(newFragment);
}
```

- [ ] **Step 2: Smoke-test**

Open a brainstorm conversation, send a Hindi message, and after the stream completes manually call:

```bash
curl -X POST http://localhost:3000/api/cc/essays/<essayId>/canvas-extract \
  -H "Content-Type: application/json" -H "Cookie: <session>"
```

Expected: returns `{turnId, fragment: "<English>", tags: [...], createdAt: "..."}`. Verify in Supabase that `cc_essays.canvas_fragments` has a new entry.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/essays/\[id\]/canvas-extract/route.ts
git commit -m "feat(1a): POST /api/cc/essays/[id]/canvas-extract — English fragment extraction"
```

---

### Task 14: Wire BrainstormChat post-stream extraction

**Files:**
- Modify: `src/components/cc/essay/BrainstormChat.tsx`

- [ ] **Step 1: Add fragment state + helper near the existing `themes` state (around line 238)**

```tsx
type CanvasFragment = { turnId: string; fragment: string; tags: string[]; createdAt: string };

// Right next to: const [themes, setThemes] = useState<string[]>([]);
const [fragments, setFragments] = useState<CanvasFragment[]>([]);
```

- [ ] **Step 2: After the stream-complete block in `sendMessage` (after the `while` loop ends, before `} catch {`), add:**

```tsx
      // Bilingual canvas extraction — feature-flagged + silent fallback (R1, R8)
      if (process.env.NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED === "true") {
        try {
          const xRes = await fetch(`/api/cc/essays/${essayId}/canvas-extract`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (xRes.ok) {
            const f = (await xRes.json()) as CanvasFragment;
            if (f.fragment) setFragments((prev) => [...prev, f]);
          }
        } catch (err) {
          console.warn("[canvas-extract] failed silently", err);
        }
      }
```

- [ ] **Step 3: If `initialTranscript` props pass an essay's existing `canvas_fragments`, hydrate them on mount**

Find the place in this component where existing essay data is passed in (look at the parent — `src/app/cc/essays/[id]/page.tsx` or similar). Pass `initialFragments` through and seed state. If wiring is non-trivial, lazy-load via `useEffect`:

```tsx
useEffect(() => {
  fetch(`/api/cc/essays/${essayId}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.canvas_fragments) setFragments(data.canvas_fragments);
    })
    .catch(() => {});
}, [essayId]);
```

(Note: confirm `/api/cc/essays/[id]` returns `canvas_fragments`. If not, extend that GET.)

- [ ] **Step 4: Add `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=false` to `.env.example` and `.env.local`**

```bash
# Append to .env.example
echo "" >> .env.example
echo "# Feature 1A: bilingual brainstorm canvas extraction (off by default)" >> .env.example
echo "NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=false" >> .env.example
```

In `.env.local` set it to `true` for dev testing.

- [ ] **Step 5: Commit**

```bash
git add src/components/cc/essay/BrainstormChat.tsx .env.example
git commit -m "feat(1a): post-stream canvas extraction in BrainstormChat (flag + silent fallback)"
```

---

### Task 15: Story canvas — rename "themes" → "Directions" + new "Fragments" card

**Files:**
- Modify: `src/components/cc/essay/BrainstormChat.tsx`

- [ ] **Step 1: Locate the canvas/right-rail JSX**

Run: `grep -n "rightTab\|canvas\|Themes\|themes" src/components/cc/essay/BrainstormChat.tsx | head -20`
Find the tab-switch UI (`rightTab === "canvas"` block) and the existing themes card.

- [ ] **Step 2: Rename the existing themes card label from "Themes" to "Directions"**

Replace any user-visible label string `Themes` (in the canvas tab only — keep state variables as `themes` to avoid massive churn) with `Directions`. Update the helper text: `Pick one to develop` instead of any "themes" wording.

- [ ] **Step 3: Add the Fragments card above the Directions card**

Inside the canvas-tab block, before the existing themes/directions card, insert:

```tsx
<div className="kl-rail-card">
  <div className="kl-rail-card-header">
    <Sparkles className="w-3.5 h-3.5" />
    <span>Fragments</span>
  </div>
  {fragments.length === 0 ? (
    <p className="text-[12.5px] text-white/45 italic">
      The coach will lift specific moments from your brainstorm and translate them
      to English here — material you can use directly when you start drafting.
    </p>
  ) : (
    <ul className="space-y-3">
      {fragments.map((f) => (
        <li key={f.turnId}>
          <p className="text-[13px] text-white/85 italic" dir="auto">"{f.fragment}"</p>
          {f.tags.length > 0 && (
            <p className="text-[10.5px] text-white/45 mt-1">{f.tags.join(" · ")}</p>
          )}
        </li>
      ))}
    </ul>
  )}
</div>
```

Make sure `Sparkles` is imported from `lucide-react` at the top of the file.

- [ ] **Step 4: Smoke-test**

`pnpm dev` with `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=true`. Open a brainstorm in Hindi, send a substantive message about a personal moment. After the assistant reply renders, switch the right rail to canvas. Expected: a new entry appears in the Fragments card (English text), and "Directions" label is shown above the chips.

- [ ] **Step 5: Commit**

```bash
git add src/components/cc/essay/BrainstormChat.tsx
git commit -m "feat(1a): rename canvas themes->Directions; add Fragments card above"
```

---

### Task 16: Voice quality check component

**Files:**
- Create: `src/components/voice/VoiceQualityCheck.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/voice/VoiceQualityCheck.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw, CheckCircle2 } from "lucide-react";

type Phase = "idle" | "permission-asking" | "permission-denied" | "ready" | "recording" | "review" | "passed";

export default function VoiceQualityCheck({
  language,
  onPassed,
}: {
  language: string;
  onPassed: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
  }, [audioUrl]);

  const grantMic = async () => {
    setPhase("permission-asking");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // release until record press
      setPhase("ready");
    } catch {
      setPhase("permission-denied");
    }
  };

  const startRecording = async () => {
    setPhase("recording");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setPhase("review");
      };
      rec.start();
      stopTimerRef.current = window.setTimeout(() => rec.state === "recording" && rec.stop(), 3000);
    } catch (e) {
      setError(String(e));
      setPhase("ready");
    }
  };

  const confirmPassed = async () => {
    setPhase("passed");
    try {
      await fetch("/api/cc/profile/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markVoiceCheckPassed: true }),
      });
    } catch { /* non-fatal */ }
    onPassed();
  };

  const redo = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setPhase("ready");
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-3">
      <h4 className="text-sm font-semibold text-white mb-3">Before we start</h4>

      <div className="flex items-center gap-2 text-[13px] mb-2">
        {phase === "idle" || phase === "permission-asking" ? (
          <button onClick={grantMic} className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-[12px] hover:bg-[#D4AF37]/20">
            Grant microphone permission
          </button>
        ) : phase === "permission-denied" ? (
          <p className="text-rose-300 text-[12px]">
            <MicOff className="inline w-3.5 h-3.5 mr-1" />
            Click the lock icon in your browser bar &rarr; Microphone &rarr; Allow.
          </p>
        ) : (
          <p className="text-emerald-400 text-[12px]"><CheckCircle2 className="inline w-3.5 h-3.5 mr-1" /> Microphone ready</p>
        )}
      </div>

      {phase === "ready" && (
        <button onClick={startRecording} className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-200 text-[12px] hover:bg-rose-500/30">
          <Mic className="inline w-3.5 h-3.5 mr-1" />
          Record 3-second test
        </button>
      )}
      {phase === "recording" && <p className="text-[12px] text-white/70"><Mic className="inline w-3.5 h-3.5 mr-1 animate-pulse" /> Recording... say anything for 3 seconds</p>}
      {phase === "review" && audioUrl && (
        <div className="space-y-2">
          <audio src={audioUrl} controls className="w-full max-w-xs" />
          <p className="text-[12px] text-white/70">Did that sound clear?</p>
          <div className="flex gap-2">
            <button onClick={confirmPassed} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-[12px] hover:bg-emerald-500/30">Yes, sounds good</button>
            <button onClick={redo} className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[12px] hover:bg-white/15">
              <RotateCcw className="inline w-3.5 h-3.5 mr-1" />Redo
            </button>
          </div>
        </div>
      )}
      {phase === "passed" && <p className="text-emerald-400 text-[12px]"><CheckCircle2 className="inline w-3.5 h-3.5 mr-1" /> All set — voice ready in {language}</p>}
      {error && <p className="text-rose-400 text-[11px] mt-2">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the brainstorm voice flow**

In `src/components/cc/essay/BrainstormChat.tsx`, before the chat surface, add:

```tsx
const [voiceCheckPassed, setVoiceCheckPassed] = useState<boolean | null>(null);

useEffect(() => {
  fetch("/api/cc/profile/voice")
    .then((r) => r.ok ? r.json() : null)
    .then((d) => setVoiceCheckPassed(Boolean(d?.voiceQualityCheckPassedAt)))
    .catch(() => setVoiceCheckPassed(true)); // fail-open — no nag
}, []);
```

In the JSX, just before the voice toggle, render:
```tsx
{voiceOn && voiceCheckPassed === false && langCode !== "ur" && (
  <VoiceQualityCheck language={langCode} onPassed={() => setVoiceCheckPassed(true)} />
)}
```

- [ ] **Step 3: Smoke-test**

Reset the column in Supabase: `UPDATE cc_student_profiles SET voice_quality_check_passed_at = NULL WHERE user_id = '<test>';`. Open a brainstorm, switch to Hindi, click voice on. Expected: VoiceQualityCheck card renders. Click record → wait 3s → playback → "Yes, sounds good" → reload page → voice check no longer appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/voice/VoiceQualityCheck.tsx src/components/cc/essay/BrainstormChat.tsx
git commit -m "feat(1a): voice quality check (mic permission + 3s playback)"
```

---

### Task 17: Family Mode strings + system prompts libs

**Files:**
- Create: `src/lib/cc/family-mode-strings.ts`
- Create: `src/lib/cc/family-mode-prompts.ts`
- Test: `src/lib/cc/__tests__/family-mode-prompts.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/cc/__tests__/family-mode-prompts.test.ts
import { describe, it, expect } from "vitest";
import { familyModeSystemPrompt } from "../family-mode-prompts";
import { FAMILY_MODE_STRINGS, FAMILY_MODE_LANGUAGES } from "../family-mode-strings";

describe("family-mode-strings", () => {
  it("covers all 17 voice languages", () => {
    expect(FAMILY_MODE_LANGUAGES).toHaveLength(17);
  });
  it("each language has all 6 string keys", () => {
    const required = ["tapToSpeak", "listening", "handBack", "thinking", "paused", "goodbye"];
    for (const code of FAMILY_MODE_LANGUAGES) {
      const strings = FAMILY_MODE_STRINGS[code];
      expect(strings, `missing: ${code}`).toBeDefined();
      for (const key of required) {
        expect(typeof strings[key as keyof typeof strings]).toBe("string");
      }
    }
  });
  it("excludes Urdu (no voice support)", () => {
    expect(FAMILY_MODE_LANGUAGES).not.toContain("ur");
  });
});

describe("familyModeSystemPrompt", () => {
  const summary = {
    applicationStage: "Junior, applying next fall",
    schoolList: [{ name: "MIT", band: "reach" }],
    aidContext: "$0 affordability, needs full need",
    essaysSubmittedCount: 1,
    essaysRequiredCount: 5,
  };

  it("includes the language-specific opener for Hindi", () => {
    const prompt = familyModeSystemPrompt("hi", summary);
    expect(prompt).toMatch(/हिन्दी/); // contains "हिन्दी" word
  });
  it("includes English fallback for unsupported language", () => {
    const prompt = familyModeSystemPrompt("xx", summary);
    expect(prompt).toMatch(/respond in English/i);
  });
  it("interpolates summary fields", () => {
    const prompt = familyModeSystemPrompt("en", summary);
    expect(prompt).toContain("MIT (reach)");
    expect(prompt).toContain("1/5 essays");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cc/__tests__/family-mode-prompts.test.ts`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Write `family-mode-strings.ts`**

```ts
// src/lib/cc/family-mode-strings.ts
export const FAMILY_MODE_LANGUAGES = [
  "en", "es", "fr", "de", "it", "nl", "ja",
  "hi", "bn", "ta", "te", "gu", "kn", "ml", "mr", "pa", "od",
] as const;
export type FamilyModeLang = typeof FAMILY_MODE_LANGUAGES[number];

export type FamilyModeStrings = {
  tapToSpeak: string;
  listening: string;
  handBack: string;
  thinking: string;
  paused: string;
  goodbye: string;
};

export const FAMILY_MODE_STRINGS: Record<FamilyModeLang, FamilyModeStrings> = {
  en: { tapToSpeak: "Tap to speak", listening: "Listening…", handBack: "Hand back to student", thinking: "Coach Kairos is thinking…", paused: "Tap mic to continue", goodbye: "Family Mode ended" },
  es: { tapToSpeak: "Toca para hablar", listening: "Escuchando…", handBack: "Devolver al estudiante", thinking: "Coach Kairos está pensando…", paused: "Toca el micrófono para continuar", goodbye: "Modo familiar finalizado" },
  fr: { tapToSpeak: "Touchez pour parler", listening: "Écoute…", handBack: "Rendre à l'étudiant", thinking: "Coach Kairos réfléchit…", paused: "Touchez le micro pour continuer", goodbye: "Mode famille terminé" },
  de: { tapToSpeak: "Zum Sprechen tippen", listening: "Höre zu…", handBack: "Zurück an Schüler", thinking: "Coach Kairos denkt nach…", paused: "Mikrofon antippen zum Fortfahren", goodbye: "Familienmodus beendet" },
  it: { tapToSpeak: "Tocca per parlare", listening: "Sto ascoltando…", handBack: "Restituisci allo studente", thinking: "Coach Kairos sta pensando…", paused: "Tocca il microfono per continuare", goodbye: "Modalità famiglia terminata" },
  nl: { tapToSpeak: "Tik om te spreken", listening: "Ik luister…", handBack: "Terug naar student", thinking: "Coach Kairos denkt na…", paused: "Tik op microfoon om door te gaan", goodbye: "Familiemodus beëindigd" },
  ja: { tapToSpeak: "タップして話す", listening: "聞いています…", handBack: "生徒に戻す", thinking: "コーチが考えています…", paused: "マイクをタップして続けて", goodbye: "ファミリーモード終了" },
  hi: { tapToSpeak: "बोलने के लिए टैप करें", listening: "सुन रहा हूँ…", handBack: "छात्र को वापस दें", thinking: "Coach Kairos सोच रहा है…", paused: "जारी रखने के लिए माइक टैप करें", goodbye: "फैमिली मोड समाप्त" },
  bn: { tapToSpeak: "কথা বলতে ট্যাপ করুন", listening: "শুনছি…", handBack: "ছাত্রকে ফিরিয়ে দিন", thinking: "Coach Kairos ভাবছে…", paused: "চালিয়ে যেতে মাইক ট্যাপ করুন", goodbye: "ফ্যামিলি মোড শেষ" },
  ta: { tapToSpeak: "பேச தட்டுக", listening: "கேட்கிறேன்…", handBack: "மாணவருக்கு திரும்பவும்", thinking: "Coach Kairos யோசிக்கிறார்…", paused: "தொடர மைக்கை தட்டுக", goodbye: "குடும்ப முறை முடிந்தது" },
  te: { tapToSpeak: "మాట్లాడియాలని టాప్ చెయ్యండి", listening: "వినపడుతున్నాను…", handBack: "విద్యార్థికి తిరిగి ఇవ్వండి", thinking: "Coach Kairos ఆలోచిస్తున్నారు…", paused: "కొనసాగించడానికి మైక్ తాకండి", goodbye: "కుటుంబ మోడ్ ముగిసింది" },
  gu: { tapToSpeak: "બોલવા માટે ટેપ કરો", listening: "સાંભળું છું…", handBack: "વિદ்યાર்થીਨે પાછுં આપો", thinking: "Coach Kairos વિચારી રહீயા છે…", paused: "ચાલு રાખுપுં‌ માઇક ટેપ ક૊", goodbye: "ફેમિલீ મોટ સમீપત થય" },
  kn: { tapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ…", handBack: "ವಿದ್ಯಾರ್ಥಿಗೆ ಹಿಂತಿರುಗಿಸು", thinking: "Coach Kairos ಯೋಚಿಸುತ್ತಿದ್ದಾರೆ…", paused: "ಮುಂದುଵರಿಸಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ", goodbye: "ಕುಟುಂಬ ಮೋಡ್ ಮುಗಿದಿದೆ" },
  ml: { tapToSpeak: "സംസാരിക്കാൻ ടാപ് ചെയ്യുക", listening: "കേൾക്കുന്നു…", handBack: "വിദ്യാര്‍ത്ഥിക്ക് തിരികെ നൽകുക", thinking: "Coach Kairos ചിന്തിക്കുന്നു…", paused: "തുടരാൻ മൈക് ടാപ് ചെയ്യുക", goodbye: "കുടുംബ മോഡ് അവസാനിച്ചു" },
  mr: { tapToSpeak: "बोलण्यासाठी टॅप करा", listening: "एकत आहे…", handBack: "विद्यार्थ्याला परत द्या", thinking: "Coach Kairos विचार करत आहे…", paused: "सुरू ठेवण्यासाठी मायक टॅप करा", goodbye: "फॅमिली मोड समाप्त" },
  pa: { tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ", listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ…", handBack: "ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਾਪਸ ਦਿਓ", thinking: "Coach Kairos ਸੋਚ ਰਿਹਾ ਹੈ…", paused: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਮਾਇਕ ਟੈਪ ਕਰੋ", goodbye: "ਫੈਮਿਲੀ ਮੋਡ ਖਤਮ" },
  od: { tapToSpeak: "କଥା କହିବାକୁ ଟାପ୍ କରନ୍ତୁ", listening: "ଶୁଣୁଛି…", handBack: "ଛାତ୍ରଙ୍କୁ ଫେରାଇଦିଅନ୍ତୁ", thinking: "Coach Kairos ଚିନ୍ତା କରୁଛି…", paused: "জারি রখিবাকু মাইকু ট্যাপ্ করুন", goodbye: "ପରିବାର ମୋଡ ସମାପ୍ତ" },
};
```

- [ ] **Step 4: Write `family-mode-prompts.ts`**

```ts
// src/lib/cc/family-mode-prompts.ts
import { FAMILY_MODE_LANGUAGES, type FamilyModeLang } from "./family-mode-strings";

export type StudentSummary = {
  applicationStage: string;
  schoolList: { name: string; band: string }[];
  aidContext: string;
  essaysSubmittedCount: number;
  essaysRequiredCount: number;
};

const LANG_OPENER: Record<FamilyModeLang, string> = {
  en: "You are a helpful college counselor speaking with a parent in English. Always respond in English.",
  es: "Eres un consejero universitario que habla con un padre en español. Responde siempre en español.",
  fr: "Vous êtes un conseiller universitaire qui parle avec un parent en français. Répondez toujours en français.",
  de: "Sie sind ein College-Berater und sprechen mit einem Elternteil auf Deutsch. Antworten Sie immer auf Deutsch.",
  it: "Sei un consigliere universitario che parla con un genitore in italiano. Rispondi sempre in italiano.",
  nl: "Je bent een college-adviseur die met een ouder in het Nederlands praat. Reageer altijd in het Nederlands.",
  ja: "あなたは、保護者と日本語で話すカレッジカウンセラーです。常に日本語で答えてください。",
  hi: "आप हिन्दी में एक माता-पिता से बात कर रहे कॉलेज काउंसलर हैं। हमेशा हिन्दी में जवाब दें।",
  bn: "আপনি বাংলায় এক বাবা-মায়ের সঙ্গে কথা বলছেন এমন একজন কলেজ কাউনসেলর।",
  ta: "நீங்கள் தமிழில் ஒரு பெற்றோருடன் பேஶும் கல்லுரி ஆலோசகர்.",
  te: "మీరు తెలుగులో తల్లిదండ్రులతో మాట్లాడుతున్నారు.",
  gu: "તમே ગુજર௦તோમાં માત௦પિતા સાથે વાત કરત௦ કૈલેજ કૈશેલર છે௦.",
  kn: "ನಿವು ಕನ್ನಡಶ௦ಲ್௦ீ ಪೋಷಕರೋ௧ನ்௦ ಮಾತನಾಡು௦ಶ್௦ ಕೋಲೇಜ௦ ಶ௦ಲಾಹನ௦.",
  ml: "നിങ്ങൾ മലയാളത്തിൽ ഒരു രക്ഷിതാവൃമായി സംസാരിക്കുന്ന കളേග്ග് കൌൺസലർ ആണ്.",
  mr: "तुम्ही मराठीत एका पालकाशी बोलणारे कॉलेज सल्लागार आहात.",
  pa: "ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਇੱਕ ਮਾਪੇ-ਪਿਹਾ ਨਾਲ ਗੱਲ ਕਰ ਰਹੇ ਕਾਲਜ 4 ਸਲਾਹਕਾਰ ਹੋ।",
  od: "ଆପଣ ଓଡିଆରେ ପିତାମାତାଙ୍କୁ କଥା କହୁଥିବାର ଅନ୍ଥେଅନ୍ଥେ କଳେଜ ପରାମର୍ଶଦାତା.",
};

export function familyModeSystemPrompt(language: string, summary: StudentSummary): string {
  const lang = (FAMILY_MODE_LANGUAGES as readonly string[]).includes(language)
    ? (language as FamilyModeLang)
    : null;

  const opener = lang
    ? LANG_OPENER[lang]
    : "You are a helpful college counselor. Always respond in English.";

  const schools = summary.schoolList.map((s) => `${s.name} (${s.band})`).join(", ") || "(none yet)";

  return `${opener}

You are speaking with the parent of a college applicant. Keep technical terms simple. Respect family dynamics. Be warm and encouraging. NEVER share details about the student's essay drafts, brainstorm content, GPA struggles, or test-score struggles — only the high-level facts below.

Student status: ${summary.applicationStage}
School list: ${schools}
Aid context: ${summary.aidContext}
Stage: ${summary.essaysSubmittedCount}/${summary.essaysRequiredCount} essays submitted`;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/cc/__tests__/family-mode-prompts.test.ts`
Expected: PASS — 6/6.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cc/family-mode-strings.ts src/lib/cc/family-mode-prompts.ts src/lib/cc/__tests__/family-mode-prompts.test.ts
git commit -m "feat(1a): family-mode strings (17 langs x 6 = 102) + system prompts"
```

---

### Task 18: Family Mode message endpoint

**Files:**
- Create: `src/app/api/cc/coach/family-mode/message/route.ts`

- [ ] **Step 1: Write the route**

```ts
// src/app/api/cc/coach/family-mode/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { familyModeSystemPrompt, type StudentSummary } from "@/lib/cc/family-mode-prompts";
import { streamLLM, collectStream, type ChatMessage } from "@/lib/cc/llm-stream";
import { isVoiceLanguage } from "@/lib/cc/coach-languages";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { message?: string; language?: string };
  const message = body.message?.trim();
  const language = body.language ?? "en";
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
  if (!isVoiceLanguage(language)) {
    return NextResponse.json({ error: "Family Mode requires a voice-supported language" }, { status: 400 });
  }

  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, grade_level")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Build minimal summary; lean on safe high-level fields only.
  // cc_student_schools holds {school_id, chancing_band}; join cc_schools for name.
  const { data: schools } = await db
    .from("cc_student_schools")
    .select("chancing_band, cc_schools(name)")
    .eq("student_id", profile.id);

  // cc_essays is keyed by student_id (FK to cc_student_profiles.id), not user_id.
  const { data: essays } = await db
    .from("cc_essays")
    .select("phase")
    .eq("student_id", profile.id);

  const submitted = (essays ?? []).filter((e) => e.phase === "submitted").length;
  const total = (essays ?? []).length;

  const stageLabel = profile.grade_level
    ? `Grade ${profile.grade_level}`
    : "Unknown grade";

  const summary: StudentSummary = {
    applicationStage: stageLabel,
    schoolList: (schools ?? []).map((s) => ({
      // Supabase nested-relationship returns either object or array depending on cardinality
      name: ((s as { cc_schools?: { name?: string } | { name?: string }[] }).cc_schools as { name?: string } | undefined)?.name
        ?? "Unknown school",
      band: s.chancing_band ?? "n/a",
    })),
    aidContext: "(see student's affordability profile — discuss only at high level)",
    essaysSubmittedCount: submitted,
    essaysRequiredCount: Math.max(total, submitted),
  };

  // Recent family-mode history (last 8 turns max) for context.
  const { data: history } = await db
    .from("cc_family_mode_turns")
    .select("role, content")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(8);
  const turns = (history ?? []).reverse();

  const messages: ChatMessage[] = [
    { role: "system", content: familyModeSystemPrompt(language, summary) },
    ...turns.map((t) => ({ role: t.role === "coach" ? "assistant" as const : "user" as const, content: t.content })),
    { role: "user", content: message },
  ];

  // Insert parent turn first.
  await db.from("cc_family_mode_turns").insert({
    student_id: profile.id,
    language,
    role: "parent",
    content: message,
  });

  let reply = "";
  try {
    const result = await streamLLM(messages, { maxTokens: 400, temperature: 0.6 });
    if (result) reply = await collectStream(result.stream);
  } catch (err) {
    console.error("[family-mode] LLM error", err);
  }

  if (!reply) reply = "I'm sorry, I had trouble responding. Please try again.";

  await db.from("cc_family_mode_turns").insert({
    student_id: profile.id,
    language,
    role: "coach",
    content: reply,
  });

  return NextResponse.json({ reply });
}
```

- [ ] **Step 2: Smoke-test**

```bash
curl -X POST http://localhost:3000/api/cc/coach/family-mode/message \
  -H "Content-Type: application/json" -H "Cookie: <session>" \
  -d '{"message":"अपने बच्चे के बारे में बताईए","language":"hi"}'
```
Expected: `{"reply": "<Hindi response>"}`. Verify in Supabase: `SELECT * FROM cc_family_mode_turns ORDER BY created_at DESC LIMIT 5;` shows two new rows (parent + coach).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/coach/family-mode/message/route.ts
git commit -m "feat(1a): POST /api/cc/coach/family-mode/message"
```

---

### Task 19: Family Mode UI components

**Files:**
- Create: `src/components/family-mode/FamilyModeMicButton.tsx`
- Create: `src/components/family-mode/FamilyModeView.tsx`
- Create: `src/components/family-mode/HandToParentButton.tsx`

- [ ] **Step 1: `FamilyModeMicButton.tsx`**

```tsx
// src/components/family-mode/FamilyModeMicButton.tsx
"use client";

import { Mic, Loader2 } from "lucide-react";

export default function FamilyModeMicButton({
  state,
  onTap,
}: {
  state: "idle" | "listening" | "thinking";
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={state === "thinking"}
      className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition shadow-2xl ${
        state === "listening"
          ? "bg-rose-500 animate-pulse"
          : state === "thinking"
            ? "bg-white/10"
            : "bg-[#D4AF37] hover:bg-[#C4A030]"
      }`}
      aria-label={state === "listening" ? "Listening" : state === "thinking" ? "Thinking" : "Tap to speak"}
    >
      {state === "thinking"
        ? <Loader2 className="w-9 h-9 text-white/80 animate-spin" />
        : <Mic className="w-9 h-9 text-black" />}
    </button>
  );
}
```

- [ ] **Step 2: `FamilyModeView.tsx`**

```tsx
// src/components/family-mode/FamilyModeView.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import FamilyModeMicButton from "./FamilyModeMicButton";
import { FAMILY_MODE_STRINGS, type FamilyModeLang } from "@/lib/cc/family-mode-strings";
import { getCoachLanguage } from "@/lib/cc/coach-languages";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const RECOGNITION_LOCALE: Record<string, string> = {
  en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT", nl: "nl-NL", ja: "ja-JP",
  hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", gu: "gu-IN", kn: "kn-IN",
  ml: "ml-IN", mr: "mr-IN", pa: "pa-IN", od: "or-IN",
};

type Turn = { role: "parent" | "coach"; content: string };

export default function FamilyModeView({
  language,
  onExit,
}: {
  language: string;
  onExit: () => void;
}) {
  const langInfo = getCoachLanguage(language);
  const strings = FAMILY_MODE_STRINGS[language as FamilyModeLang] ?? FAMILY_MODE_STRINGS.en;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [state, setState] = useState<"idle" | "listening" | "thinking">("idle");
  const [error, setError] = useState<string | null>(null);
  const idleRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Idle timeout — exits after 5 minutes of no input
  useEffect(() => {
    const reset = () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
      idleRef.current = window.setTimeout(onExit, IDLE_TIMEOUT_MS);
    };
    reset();
    return () => { if (idleRef.current) window.clearTimeout(idleRef.current); };
  }, [turns, onExit]);

  const startListening = () => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Voice not supported in this browser. Use Chrome, Edge, or Safari.");
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = RECOGNITION_LOCALE[language] ?? "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setState("listening");
    rec.onresult = async (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (!transcript) { setState("idle"); return; }
      setTurns((prev) => [...prev, { role: "parent", content: transcript }]);
      setState("thinking");
      try {
        const res = await fetch("/api/cc/coach/family-mode/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript, language }),
        });
        if (res.ok) {
          const { reply } = await res.json();
          setTurns((prev) => [...prev, { role: "coach", content: reply }]);
          // Speak via Web Speech (cheap fallback) — full Sarvam/Deepgram TTS is a Day-3 polish
          if ("speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(reply);
            utter.lang = RECOGNITION_LOCALE[language] ?? "en-US";
            window.speechSynthesis.speak(utter);
          }
        }
      } catch (err) {
        console.warn("[family-mode] message failed", err);
      } finally {
        setState("idle");
      }
    };
    rec.onerror = () => { setState("idle"); setError("Couldn't hear you. Try again."); };
    rec.onend = () => { if (state === "listening") setState("idle"); };
    rec.start();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex flex-col" lang={language}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-xs text-white/60">{langInfo.nativeName}</span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-[12px] text-[#D4AF37] hover:text-[#E5C36F]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {strings.handBack}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8 overflow-hidden">
        <div className="w-full max-w-md flex flex-col gap-3 max-h-[40vh] overflow-y-auto">
          {turns.slice(-4).map((t, i) => (
            <div
              key={i}
              dir="auto"
              className={`px-4 py-3 rounded-2xl text-[14px] ${
                t.role === "parent" ? "bg-white/10 self-end" : "bg-[#D4AF37]/15 text-[#FAE5A5] self-start"
              }`}
            >
              {t.content}
            </div>
          ))}
        </div>

        <FamilyModeMicButton state={state} onTap={startListening} />
        <p className="text-[13px] text-white/60">
          {state === "listening" ? strings.listening : state === "thinking" ? strings.thinking : strings.tapToSpeak}
        </p>
        {error && <p className="text-[12px] text-rose-300">{error}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `HandToParentButton.tsx`**

```tsx
// src/components/family-mode/HandToParentButton.tsx
"use client";

import { Users } from "lucide-react";

export default function HandToParentButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Voice not supported for the current language" : "Hand to parent"}
      className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      aria-label="Hand to parent"
    >
      <Users className="w-4 h-4" />
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/family-mode/FamilyModeView.tsx src/components/family-mode/FamilyModeMicButton.tsx src/components/family-mode/HandToParentButton.tsx
git commit -m "feat(1a): Family Mode UI (modal overlay + mic button + hand-to-parent trigger)"
```

---

### Task 20: Wire Family Mode into CoachKairosContext + Shell

**Files:**
- Modify: `src/contexts/CoachKairosContext.tsx`
- Modify: `src/components/cc/coach/CoachKairosShell.tsx`

- [ ] **Step 1: Add `familyMode` state and toggle to the context**

In `CoachKairosContext.tsx`:

Add to the interface (around line 22-38):
```ts
  familyMode: boolean;
  toggleFamilyMode: (on?: boolean) => void;
```

Add the state (around line 53):
```ts
  const [familyMode, setFamilyMode] = useState(false);
```

Add the toggle (alongside `toggle`):
```ts
  const toggleFamilyMode = useCallback((on?: boolean) => {
    setFamilyMode((prev) => (on === undefined ? !prev : on));
  }, []);
```

Add to the `value` object passed to the Provider:
```ts
  familyMode, toggleFamilyMode,
```

- [ ] **Step 2: Render Family Mode in the Shell**

In `CoachKairosShell.tsx`:

```tsx
import HandToParentButton from "@/components/family-mode/HandToParentButton";
import FamilyModeView from "@/components/family-mode/FamilyModeView";
import { isVoiceLanguage } from "@/lib/cc/coach-languages";
```

Pull `familyMode` and `toggleFamilyMode` from `useCoachKairos()` at the top of the component.

Render `<FamilyModeView>` at the very top of the returned JSX (before the floating button block):

```tsx
{familyMode && (
  <FamilyModeView language={language} onExit={() => toggleFamilyMode(false)} />
)}
```

In the drawer header buttons row (around line 89, just before the Languages icon button), add:

```tsx
<HandToParentButton
  onClick={() => toggleFamilyMode(true)}
  disabled={!isVoiceLanguage(language)}
/>
```

- [ ] **Step 3: Smoke-test**

`pnpm dev`. Open the coach drawer (any authenticated page). With language = Hindi, click the Users icon. Expected: full-screen Family Mode overlay appears with the centered mic button. Click the mic, speak Hindi. Coach replies in Hindi (text bubble + Web Speech audio).

Switch language to Urdu in TopNav. Open coach drawer — Hand-to-parent button should be disabled with the "voice not supported" tooltip.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/CoachKairosContext.tsx src/components/cc/coach/CoachKairosShell.tsx
git commit -m "feat(1a): wire Family Mode into context + Shell (HandToParentButton + overlay)"
```

---

### Task 21: End-to-end manual acceptance pass

**Files:** none — verification only.

- [ ] **Step 1: Reset a test profile to clean state**

```sql
UPDATE cc_student_profiles
   SET language_picker_seen_at = NULL,
       voice_quality_check_passed_at = NULL,
       home_language = 'en'
 WHERE user_id = '<your test user id>';

UPDATE cc_essays SET canvas_fragments = '[]'::jsonb
  WHERE user_id = '<your test user id>';
```

- [ ] **Step 2: Walk the acceptance checklist (from the spec, §7)**

Open a fresh browser session, log in as the test user.

```
[ ] Language selection screen appears on first login (and never again after picking)
[ ] Selected language persists across page refreshes and new sessions (DB + localStorage)
[ ] Coach Kairos responds in Hindi when Hindi is selected
[ ] Coach Kairos responds in Punjabi when Punjabi is selected
[ ] Coach Kairos responds in Urdu (text only) when Urdu is selected; voice toggle gated with explanation
[ ] Story canvas Fragments card receives English text while Coach speaks in Hindi/Punjabi during brainstorm (NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=true)
[ ] Urdu text input renders RTL with Nastaliq font; mixed-script content (English school names) renders correctly
[ ] Language picker is visible from every authenticated dashboard page (not just /cc)
[ ] Family Mode shows simplified UI with large mic button and persistent "Hand back" link
[ ] Family Mode auto-exits after 5 minutes of inactivity with localised goodbye toast
[ ] Family Mode turns are NOT visible in the student's normal coach history (separate table)
[ ] Voice quality check shows mic status before first session; never re-shown after passing
[ ] No regression: English brainstorm/outline/draft/revise + existing voice all work identically
[ ] Existing 120 beta users see the language picker once on next login (middleware redirect fires)
[ ] NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=false cleanly disables the extraction with no UI regression
```

For each unchecked row that fails, file a fix-up sub-task and rerun.

- [ ] **Step 3: Run full test suites once green**

```bash
npx tsc --noEmit
pnpm lint
pnpm test:unit
```
Expected: all clean (no new TS errors, no new lint warnings, vitest suites all pass).

- [ ] **Step 4: Final commit (if any sweeps were needed)**

```bash
git add -p   # stage selectively
git commit -m "fix(1a): acceptance-pass cleanups"
```

---

## Implementation order summary

| Day | Tasks | Outcome |
|---|---|---|
| Day 1 AM | 1, 2, 3 | Schema live, language config + endpoint extended |
| Day 1 PM | 4, 5, 6, 7 | Onboarding picker + middleware + TopNav badges |
| Day 2 AM | 8, 9, 10, 11 | Urdu RTL, Nastaliq, dir=auto, voice gate everywhere |
| Day 2 PM | 12, 13, 14, 15 | Bilingual canvas extraction + Fragments card |
| Day 2 EVE | 16 | Voice quality check |
| Day 3 AM | 17, 18, 19, 20 | Family Mode end-to-end |
| Day 3 PM | 21 | Acceptance pass + bug fixes |

---

## Risk callouts the implementer should keep in mind

- **R1** (extraction emits non-Latin) — Task 12's regex + retry handles it; if you see `fragment` empty in production logs, check whether `containsNonLatin` is too aggressive (e.g. should we include diacritics?).
- **R3** (theme parser duplication) — Task 15 keeps the existing `parseThemesBlock` for the Directions card; only the new `canvas_fragments` JSONB drives the Fragments card. Don't merge them.
- **R4** (privacy in Family Mode) — Task 18's summary builder only includes high-level fields; never read `cc_essays.brainstorm_transcript`, `*_draft`, GPA struggles, test struggles.
- **R6** (mixed-script direction) — verify `dir="auto"` is on every coach-rendered text node (Task 10/11). Mixed Urdu + English school names should render correctly.
- **R7** (no automated noise meter) — Task 16 explicitly does NOT measure noise; just records 3s and lets the user judge.
- **R8** (extraction breaks brainstorm) — Task 14's wrapper is wrapped in `try/catch`; flipping `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=false` must cleanly disable the call. Verify this last as part of Task 21.
