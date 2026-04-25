# Feature 1A — Hindi/Punjabi voice + multilingual coach

> **Source:** `todo-features/HindiPunjabiUrdu-VoiceMode.md` (8 enhancements), re-scoped after gap audit.
> **Phase:** 1 of 4 (Phase 1 / Feature 1 / re-scoped to 1A).
> **Date:** 2026-04-25.
> **Estimate:** ~2.5 days.
> **Status:** Approved 2026-04-25. Spec awaiting user review before plan is written.

---

## 1. Goal

Make KairosLearn's Hindi + Punjabi voice moat airtight, give Urdu speakers a first-class text-mode experience, and ship the Family Mode + bilingual brainstorm dual-output pipeline that no competitor (Kollegio / ESAI / CollegeVine / Crimson) currently has.

The honest marketing line after Feature 1A ships:
> *"Voice in Hindi, Punjabi, and 8 other languages. Text in Urdu, English, and 17 total. Coach Kairos talks to your parent in their language — no English required."*

---

## 2. Re-scoped scope (gap audit result)

### What's already shipped (don't rebuild)
- Voice routing infrastructure: Deepgram Aura TTS (7 langs) + Sarvam Bulbul v3 TTS (11 Indic langs) wired through `useVoiceAgent`, `useDeepgramAgent`, `useOrchestratedVoiceAgent`.
- Language state: `CoachKairosContext` with localStorage + `cc_student_profiles.home_language` + `/api/cc/profile/voice` POST.
- TopNav language picker (`TopNavLanguagePicker.tsx`) — but only renders on `/cc/*` paths today.
- Brainstorm voice greeting in selected language with `isRTL` direction handling for Urdu (visual only).
- Brainstorm voice input via Web Speech API with per-language locales.
- Pakistani GPA → 4.0 text conversion (`gpa-converter.ts`).
- Marketing copy "11pm the night before a deadline" on landing.

### Feature 1A deliverables (this spec)

1. First-login language picker route `/onboarding/language` (18 options).
2. Global language picker on every authenticated page (drop `/cc`-only gate).
3. Bilingual brainstorm dual-output: streaming reply + post-stream English canvas extraction.
4. Family Mode toggle in student session (modal overlay).
5. Urdu text-only support: Nastaliq font, RTL CSS, `dir="auto"` on bubbles, voice-toggle gate.
6. Voice quality check: mic permission + 3-second playback test (no automated noise meter).
7. Latent-bug fix: Urdu + voice currently fails silently through Sarvam orchestrator — gate it.

### Deferred
- **Feature 1B** (after Feature 5): voice GPA explainer (TTS), document translation (brag sheet / aid summary / scholarship Urdu), "working late after 10pm" prompt.
- **Post-Feature 17**: third-party TTS provider (Google Cloud or Azure) for `ur-PK` voice.

### Risks baked into design
- **R1** (extraction language guard + retry) — Section 5.3
- **R3** (rename existing theme parser, two distinct cards) — Sections 5.3 + 5.4
- **R4** (Family Mode timeout + isolated table + persistent return link) — Section 5.2
- **R6** (`dir="auto"` on every coach surface) — Section 5.5
- **R7** (drop noise meter; keep mic check + 3-second test) — Section 5.6
- **R8** (feature flag `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED` with silent fallback) — Section 5.3

### Risks deferred
- **R2** (cost optimisation: extraction every 2nd turn or ≥40 words) — defer until usage data shows pressure.
- **R5** (retroactive backfill for 120 betas) — handled cheaply by middleware redirect, no separate work.

---

## 3. Architecture overview

```
src/app/
├── onboarding/
│   └── language/
│       └── page.tsx              [NEW — full-screen 18-tile picker]
├── api/cc/
│   ├── essays/[id]/
│   │   └── canvas-extract/
│   │       └── route.ts          [NEW — POST: extract English fragment]
│   ├── coach/family-mode/
│   │   └── message/
│   │       └── route.ts          [NEW — POST: parent-facing chat]
│   └── profile/voice/route.ts    [MOD — accept markPickerSeen + markVoiceCheckPassed flags]
└── globals.css                   [MOD — Nastaliq @import, [lang="ur"] block]

src/components/
├── onboarding/
│   └── LanguageGrid.tsx          [NEW — 18-tile picker, reused]
├── family-mode/
│   ├── FamilyModeView.tsx        [NEW — reskinned coach surface]
│   ├── FamilyModeMicButton.tsx   [NEW — 96x96 centered mic]
│   └── HandToParentButton.tsx    [NEW — coach-drawer header trigger]
├── voice/
│   └── VoiceQualityCheck.tsx     [NEW — pre-session card]
├── cc/coach/CoachKairosShell.tsx [MOD — render FamilyModeView when active]
├── cc/essay/BrainstormChat.tsx   [MOD — extract on stream complete; rename "themes" → "directions"; voice gate for Urdu]
└── layout/
    ├── TopNav.tsx                [MOD — drop /cc-only gate on language picker]
    └── TopNavLanguagePicker.tsx  [MOD — add Urdu (text only)]

src/contexts/CoachKairosContext.tsx  [MOD — familyMode state + toggleFamilyMode]
src/middleware.ts                    [MOD — redirect to /onboarding/language if home_language IS NULL]
src/app/layout.tsx                   [MOD — set <html lang> from CoachKairosContext]

src/lib/cc/
├── family-mode-prompts.ts        [NEW — system prompts × 17 voice langs]
├── family-mode-strings.ts        [NEW — 102 hand-curated UI strings (17 langs × 6 strings)]
└── canvas-extract.ts             [NEW — extraction prompt + language-guard regex]

supabase/migrations/
└── 20260425_feature_1a_voice_mode.sql  [NEW]
```

---

## 4. Data model changes

### Migration `supabase/migrations/20260425_feature_1a_voice_mode.sql`

```sql
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

CREATE POLICY "students read their own family mode turns"
  ON cc_family_mode_turns FOR SELECT
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "students write their own family mode turns"
  ON cc_family_mode_turns FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
```

### `cc_essays.canvas_fragments` shape

```ts
type CanvasFragment = {
  turnId: string;          // UUID matching the assistant turn it was extracted from
  fragment: string;        // 1-2 English sentences
  tags: string[];           // 0-3 short theme labels
  createdAt: string;       // ISO timestamp
};
type CanvasFragments = CanvasFragment[];
```

Append-only. Read by the Story canvas tab's "Fragments" card.

### Supported language list (canonical)

```ts
// src/lib/cc/coach-languages.ts (existing) + add Urdu text-only entry

export type LanguageMode = "voice" | "text-only";

export const SUPPORTED_LANGUAGES = [
  // Deepgram TTS
  { code: "en", name: "English",  nativeName: "English",   mode: "voice" },
  { code: "es", name: "Spanish",  nativeName: "Español",   mode: "voice" },
  { code: "fr", name: "French",   nativeName: "Français",  mode: "voice" },
  { code: "de", name: "German",   nativeName: "Deutsch",   mode: "voice" },
  { code: "it", name: "Italian",  nativeName: "Italiano",  mode: "voice" },
  { code: "nl", name: "Dutch",    nativeName: "Nederlands", mode: "voice" },
  { code: "ja", name: "Japanese", nativeName: "日本語",      mode: "voice" },
  // Sarvam Bulbul TTS (Indic)
  { code: "hi", name: "Hindi",    nativeName: "हिन्दी",      mode: "voice" },
  { code: "bn", name: "Bengali",  nativeName: "বাংলা",      mode: "voice" },
  { code: "ta", name: "Tamil",    nativeName: "தமிழ்",      mode: "voice" },
  { code: "te", name: "Telugu",   nativeName: "తెలుగు",     mode: "voice" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી",     mode: "voice" },
  { code: "kn", name: "Kannada",  nativeName: "ಕನ್ನಡ",       mode: "voice" },
  { code: "ml", name: "Malayalam",nativeName: "മലയാളം",     mode: "voice" },
  { code: "mr", name: "Marathi",  nativeName: "मराठी",      mode: "voice" },
  { code: "pa", name: "Punjabi",  nativeName: "ਪੰਜਾਬੀ",      mode: "voice" },
  { code: "od", name: "Odia",     nativeName: "ଓଡ଼ିଆ",       mode: "voice" },
  // Text-only
  { code: "ur", name: "Urdu",     nativeName: "اردو",       mode: "text-only", isRTL: true },
];
```

---

## 5. Per-deliverable design

### 5.1 First-login language picker + global picker

**Route:** `/onboarding/language` (new). Server component returns `<LanguageGrid initialLanguage={profile.home_language ?? "en"} />`. The grid is a 6-column responsive grid (collapses to 3 on mobile, 2 on small mobile) of 18 tiles. Each tile shows:

- Native script name (Cormorant or local font as appropriate)
- One-line greeting in that language: e.g. *"ਤੁਹਾਡੀ ਕਹਾਣੀ ਸੁਣਨ ਲਈ ਇੱਥੇ ਹਾਂ"* / *"मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ"* / *"میں تمہاری کہانی سننے کے لیے یہاں ہوں"*
- A small mode badge: `🎙 Voice` (gold) or `📝 Text only` (white/35%)

Tile click → POST `/api/cc/profile/voice` with `{ language: code, markPickerSeen: true }`. The endpoint is extended to write `home_language` and `language_picker_seen_at = now()` in a single update when `markPickerSeen` is true. On 200, redirect to `/?coach=open&focus=intake` (existing post-onboarding flow). Picker has no skip; the user must select to continue.

**Middleware redirect (R5):**

```ts
// src/middleware.ts — add to existing matcher
if (pathname !== "/onboarding/language" && profile?.language_picker_seen_at == null && session?.user) {
  return NextResponse.redirect(new URL("/onboarding/language", req.url));
}
```

This catches both new users and the 120 existing betas. After they pick once, `language_picker_seen_at` is non-null and they never see the route again.

**Global picker:** `TopNav.tsx:31` currently has `const showAutosave = pathname?.startsWith("/cc") ?? false;` and gates the `<TopNavLanguagePicker />` on the same condition. We split: keep the `showAutosave` indicator gated to `/cc`, but show `<TopNavLanguagePicker />` on **every** authenticated page. The picker dropdown reuses the 18-language list with the `📝 Text only` badge next to Urdu.

### 5.2 Family Mode

**Trigger UI:** `<HandToParentButton />` rendered in `CoachKairosShell.tsx`'s drawer header, right of the Languages icon. Label: *"Hand to parent"* with a `Users` lucide icon. Click → `coach.toggleFamilyMode(true)` in the context.

**Active state UI:** when `familyMode === true`, `CoachKairosShell.tsx` renders `<FamilyModeView />` instead of `<CoachChat />`. The view is a **modal overlay** on top of whatever route the student was on (so handing the phone back doesn't navigate away from their work).

`<FamilyModeView />` layout (centred, full-screen modal):

```
┌──────────────────────────────────────────────────┐
│  ←  ਪੰਜਾਬੀ              Hand back to student →  │  <- top bar, persistent
├──────────────────────────────────────────────────┤
│                                                  │
│           [parent's last bubble in Punjabi]      │
│                                                  │
│           [coach's last bubble in Punjabi]       │
│                                                  │
│                                                  │
│                ╭───────────╮                     │
│                │           │                     │
│                │   🎙      │  <- 96x96 mic       │
│                │           │                     │
│                ╰───────────╯                     │
│                                                  │
│              Tap to speak                        │  <- localised string
│                                                  │
└──────────────────────────────────────────────────┘
```

Background tint shifts one step lighter (`rgba(0,0,0,0.55)`) so a returning student visually clocks Family Mode is active.

**System prompt swap:** new module `src/lib/cc/family-mode-prompts.ts` with one prompt per voice-supported language. Skeleton:

```ts
export function familyModeSystemPrompt(language: string, summary: StudentSummary): string {
  const corePrompt = LANG_CORE_PROMPTS[language]; // e.g. Urdu/Hindi/Punjabi opening
  return `${corePrompt}

Student status: ${summary.applicationStage}
School list: ${summary.schoolList.map(s => `${s.name} (${s.band})`).join(", ")}
Aid status: ${summary.aidContext}
Stage: ${summary.essaysSubmittedCount}/${summary.essaysRequiredCount} essays submitted

ALWAYS respond in ${language}. Keep technical terms simple. Respect family dynamics.`;
}

type StudentSummary = {
  applicationStage: string;        // e.g. "Junior, applying next fall"
  schoolList: { name: string; band: string }[];
  aidContext: string;              // e.g. "$0 affordability, needs full need"
  essaysSubmittedCount: number;
  essaysRequiredCount: number;
};
```

The summary is built from `cc_student_profiles` + `cc_student_schools` + `cc_essays` aggregates. **Excludes:** brainstorm transcripts, essay drafts, GPA/test struggles. Student stays in control — what's not in the summary, parent can't see.

**UI strings:** new file `src/lib/cc/family-mode-strings.ts`:

```ts
export const FAMILY_MODE_STRINGS = {
  en: { tapToSpeak: "Tap to speak", listening: "Listening…", handBack: "Hand back to student", thinking: "Coach Kairos is thinking…", paused: "Tap mic to continue", goodbye: "Family Mode ended" },
  hi: { tapToSpeak: "बोलने के लिए टैप करें", listening: "सुन रहा हूँ…", handBack: "छात्र को वापस दें", thinking: "Coach Kairos सोच रहा है…", paused: "जारी रखने के लिए माइक टैप करें", goodbye: "फैमिली मोड समाप्त" },
  pa: { tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ", listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ…", handBack: "ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਾਪਸ ਦਿਓ", thinking: "Coach Kairos ਸੋਚ ਰਿਹਾ ਹੈ…", paused: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਮਾਈਕ ਟੈਪ ਕਰੋ", goodbye: "ਫੈਮਿਲੀ ਮੋਡ ਖਤਮ" },
  // …17 voice languages × 6 strings = 102 entries, hand-curated
  // (en, es, fr, de, it, nl, ja, hi, bn, ta, te, gu, kn, ml, mr, pa, od)
  // Urdu is intentionally excluded — Family Mode is voice-only and Urdu has no TTS yet.
};
```

**Privacy + isolation (R4):**
- Family Mode turns write to `cc_family_mode_turns` (separate table from `cc_coach_conversations`).
- Idle timeout: 5 minutes of no input → auto-exits with `goodbye` toast.
- Persistent "Hand back to student" link top-right; one tap returns to whatever route they were on.

**Backend:** `POST /api/cc/coach/family-mode/message` reuses the existing voice provider router (Deepgram or Sarvam based on `language`). System prompt swapped to family-mode prompt. Writes both turns (parent + coach) to `cc_family_mode_turns` with `student_id` from the student's session.

**Refactor path to Feature 10:** when Parent Portal lands, the same endpoint is reused; auth swaps from "student session" to "parent magic-link session." UI components (`FamilyModeView`, `FamilyModeMicButton`) are unchanged. Zero rework.

### 5.3 Bilingual brainstorm dual-output

**Architecture:** streaming + post-stream extraction (option C from brainstorm Q3).

```
Student speaks Hindi
  ↓
POST /api/cc/essays/[id]/brainstorm  (existing, untouched)
  ↓ stream tokens
BrainstormChat renders Hindi reply live
  ↓ stream completes
BrainstormChat fires extractCanvasFragment(essayId, lastTurnId)
  ↓
POST /api/cc/essays/[id]/canvas-extract  (new)
  ↓ small Claude call, ~150 tokens out, low temperature
Returns { fragment: "English…", tags: ["…"] }
  ↓
Server appends to cc_essays.canvas_fragments
Server returns to client
  ↓
BrainstormChat updates Story canvas tab → Fragments card
```

**New endpoint** `POST /api/cc/essays/[id]/canvas-extract`:

```ts
// Request
{ turnId: string }     // assistant turn UUID — server reads its content + last user message

// Response
{ fragment: string, tags: string[] }
```

**Server prompt (`canvas-extract.ts`):**

```ts
export const CANVAS_EXTRACT_SYSTEM = `
You extract English story material from a brainstorm conversation that may be in any language.

Given the student's last message and the coach's response (which may be in Hindi, Punjabi,
Spanish, etc.), output a JSON object with:
  - fragment: 1-2 English sentences capturing concrete lived material the student shared.
              Specific, scene-based, no abstractions. NEVER an interpretation or theme.
  - tags:     0-3 short English theme labels (3 words max each).

[OUTPUT LANGUAGE: ENGLISH ONLY — even if the conversation was in another language.
This output feeds an English essay editor; non-English text breaks the pipeline.]

If the student's message has no extractable material (small talk, meta-question), return:
  { "fragment": "", "tags": [] }
`;
```

**R1 mitigation — language guard with retry:**

```ts
const NON_LATIN_RE = /[ऀ-ॿ؀-ۿ਀-੿ঀ-৿଀-୿ఀ-౿぀-ヿ]/;
// Devanagari, Nastaliq, Gurmukhi, Bengali, Odia, Telugu, Hiragana/Katakana

let result = await callClaude(prompt);
if (NON_LATIN_RE.test(result.fragment)) {
  // retry once with stronger language directive
  result = await callClaude(prompt + "\n\nIMPORTANT: PREVIOUS OUTPUT WAS NOT ENGLISH. Respond in English only.");
}
if (NON_LATIN_RE.test(result.fragment)) {
  // give up silently — no UI error
  return { fragment: "", tags: [] };
}
```

**R3 mitigation — rename + two cards:**

`BrainstormChat.tsx` already parses themes from prose with `parseThemesBlock`. Rename what it surfaces in the Story canvas tab from "themes" to **"Directions"** (decision points the coach has surfaced). The new canvas extractor's output appears as **"Fragments"** in a separate card.

```
┌── Story canvas tab ───────────┐
│                               │
│  Directions                   │  <- existing parseThemesBlock output
│  ━━━━━━━━━━━━━━━━━           │
│  [chip] [chip] [chip]         │  <- "Pick one to develop"
│                               │
│  Fragments                    │  <- new canvas extractor output
│  ━━━━━━━━━━━━━━━━━           │
│  "I played the Pakistani      │
│   anthem on violin in Turkey  │  <- read-only English material
│   as quiet defiance."         │     student can re-read what they said
│  · turning point · identity   │     translated for essay use
│                               │
│  "My brother always got the   │
│   ENT scholarship — I had to  │
│   build a different lane."    │
│  · sibling · ambition         │
│                               │
└───────────────────────────────┘
```

**R8 mitigation — feature flag + silent fallback:**

```ts
// src/components/cc/essay/BrainstormChat.tsx — after stream completes
if (process.env.NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED === "true") {
  try {
    const { fragment, tags } = await extractCanvasFragment(essayId, turnId);
    if (fragment) appendToFragments({ turnId, fragment, tags });
  } catch (err) {
    console.warn("[canvas-extract] failed silently", err); // no UI regression
  }
}
```

Initial rollout: flag on for me + the 5 Pakistani beta users you've talked to (env var per environment). After a week of zero issues, flip to true globally.

### 5.4 Story canvas tab — directions + fragments

Existing tab structure preserved. New "Fragments" card mounts above existing "Directions" card:

```tsx
<RailCard label="Fragments" icon={Sparkles}>
  {fragments.length === 0 ? (
    <p className="text-[12.5px] text-white/45 italic">
      The coach will lift specific moments from your brainstorm and translate them
      to English here — material you can use directly when you start drafting.
    </p>
  ) : (
    <ul className="space-y-3">
      {fragments.map((f) => (
        <li key={f.turnId}>
          <p className="text-[13px] text-white/85 italic">"{f.fragment}"</p>
          {f.tags.length > 0 && (
            <p className="text-[10.5px] text-white/45 mt-1">
              {f.tags.join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  )}
</RailCard>
```

Sparkle animation on append: 200ms `opacity 0 → 1` + 4px `y: -4 → 0`.

### 5.5 Urdu text-only — Nastaliq + RTL

**Font install:** `pnpm add @fontsource/noto-nastaliq-urdu` then in `src/app/globals.css`:

```css
@import "@fontsource/noto-nastaliq-urdu/400.css";

[lang="ur"] {
  direction: rtl;
  text-align: right;
  font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif;
  line-height: 2.0;
}
```

**HTML lang attribute:** `src/app/layout.tsx` adds an effect that reads `CoachKairosContext.language` and sets `document.documentElement.lang`:

```tsx
"use client";
useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```

Browsers + screen readers + the CSS rule all key off the lang attribute.

**`dir="auto"` (R6):** every coach-rendered text node gets `dir="auto"`:

- `kl-msg-bubble` (BrainstormChat, AICoach, OutlinePicker, DraftEditor coach panels)
- `kl-coach-bubble` (CoachKairosShell)
- `composer textarea`, `coach input`
- `rail-card` body text where coach output lands

That's a single search-and-replace pass. Mixed-script content like *"MIT کے بارے میں…"* renders correctly: school name LTR inside RTL flow.

**Voice toggle gate (latent bug fix):** in `BrainstormChat.tsx` and `CoachKairosShell.tsx`, when `langCode === "ur"`:

```tsx
<button
  type="button"
  disabled
  className="kl-voice-toggle"
  title="Voice for Urdu coming soon"
>
  <MicOff className="w-3.5 h-3.5" /> Voice off
</button>
<a
  className="text-[11px] text-[var(--kl-gold-app)] underline ml-2"
  onClick={() => setLanguage("hi")}
>
  Try Hindi voice instead →
</a>
```

### 5.6 Voice quality check

`<VoiceQualityCheck />` renders inline above the chat composer the **first** time a user with `voice_quality_check_passed_at IS NULL` clicks the voice toggle.

```
┌─ Before we start ────────────────────────┐
│                                          │
│  ☐ Microphone access                     │
│    [Grant permission] → ✓ granted        │
│                                          │
│  ☐ Quick test — record 3 seconds         │
│    [● Record]  → playback your clip      │
│    "Did that sound clear?"  [Yes / Redo] │
│                                          │
│  Language: हिन्दी (Hindi)                  │
│                                          │
│  [Start with Coach Kairos →]             │
│                                          │
└──────────────────────────────────────────┘
```

**Mic permission:** `navigator.mediaDevices.getUserMedia({audio: true})`. Denied → render an instructional block ("Click the lock icon in your browser bar → Microphone → Allow") and DON'T block the rest of the app — text input still works.

**3-second test:** records via `MediaRecorder`, plays back via blob URL. User taps "Yes" to confirm clarity. **No automated noise meter** (R7 mitigation).

**Persistence:** "Yes" click → POST `/api/cc/profile/voice` with `{ markVoiceCheckPassed: true }`. The endpoint sets `voice_quality_check_passed_at = now()` on the profile when this flag is true. Never shown again unless user clicks "Reset voice check" in settings (out of scope for 1A).

### 5.7 Risks + mitigations summary

| Risk | Mitigation | Where in this spec |
|------|-----------|-------------------|
| R1 — extraction emits non-English | Codepoint regex check + retry once + drop silently | §5.3 |
| R3 — duplicate sources of themes | Rename existing parser output to "directions"; new "fragments" card | §5.3, §5.4 |
| R4 — student forgets parent has phone | 5-min idle timeout + persistent "Hand back" + isolated `cc_family_mode_turns` table | §5.2 |
| R6 — mixed-script direction breaks | `dir="auto"` on every coach-rendered surface | §5.5 |
| R7 — noise meter cross-browser fragility | Drop noise meter; keep mic permission + 3s playback test | §5.6 |
| R8 — extraction breaks brainstorm | `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED` flag + silent fallback | §5.3 |

---

## 6. Out of scope for Feature 1A

- Voice GPA explainer (TTS-piping the existing GPA conversion text). **→ Feature 1B**
- Document translation (brag sheet / aid summary / scholarship Urdu generation). **→ Feature 1B**
- "Working late" 10pm in-app prompt. **→ Feature 1B**
- Third-party TTS provider for Urdu voice (Google Cloud / Azure / ElevenLabs). **→ Post-Feature 17**
- Parent magic-link auth + dedicated `/parent` route. **→ Feature 10 (Parent Portal)**
- Cost optimization of the extraction call (every-2nd-turn or ≥40-words gating). **→ Defer until usage pressure observed**
- Removing the legacy `@theme inline --color-brand-*` block in `globals.css` (separate cleanup).

---

## 7. Acceptance criteria (testing checklist from `IMPLEMENTATION-ORDER.md`)

- [ ] Language selection screen appears on first login and never again after selection
- [ ] Selected language persists across page refreshes and new sessions (DB + localStorage)
- [ ] Coach Kairos responds in Hindi when Hindi is selected
- [ ] Coach Kairos responds in Punjabi when Punjabi is selected
- [ ] Coach Kairos responds in Urdu (text only) when Urdu is selected; voice toggle gated with explanation
- [ ] Story canvas Fragments card receives English text while Coach speaks in Hindi/Punjabi during brainstorm
- [ ] Urdu text input renders RTL with Nastaliq font; mixed-script content (English school names) renders correctly
- [ ] Language picker is visible from every authenticated dashboard page (not just `/cc`)
- [ ] Family Mode shows simplified UI with large mic button and persistent "Hand back" link
- [ ] Family Mode auto-exits after 5 minutes of inactivity with localised goodbye toast
- [ ] Family Mode turns are NOT visible in the student's normal coach history (separate table)
- [ ] Voice quality check shows mic status before first session; never re-shown after passing
- [ ] No regression: English brainstorm/outline/draft/revise + existing voice all work identically
- [ ] Existing 120 beta users see the language picker once on next login (middleware redirect fires)
- [ ] `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=false` cleanly disables the extraction with no UI regression

---

## 8. Open questions resolved

1. **Onboarding sequencing** — `/onboarding/language` runs **before** the coach intake, so coach intake itself happens in the chosen language.
2. **"Hand to parent" location** — coach drawer header (right of the Languages icon).
3. **Family Mode visual reskin** — modal overlay on whatever route the student was on (so handing the phone back doesn't navigate away from their work).

---

## 9. Estimate

~2.5 days, broken approximately:

- Day 1 morning: schema migration + language picker route + middleware + global picker scope widening
- Day 1 afternoon: Urdu Nastaliq + RTL + `dir="auto"` pass + voice-toggle gate
- Day 2 morning: bilingual canvas extraction endpoint + prompt + R1 retry + R8 flag wiring
- Day 2 afternoon: BrainstormChat post-stream extract integration + Fragments rail card + Directions rename
- Day 2 evening: Voice quality check UI + persistence
- Day 3 morning: Family Mode UI (modal overlay + mic button + isolated transcript table) + system prompts × 17 langs + 102 strings
- Day 3 afternoon: end-to-end manual test against the acceptance checklist + bug fixes

---

## 10. After this spec

1. User reviews this spec file and approves.
2. Invoke `superpowers:writing-plans` to produce the task-by-task implementation plan.
3. After plan approval, decide on execution mode (`subagent-driven-development` recommended — fresh subagent per task, two-stage review).
