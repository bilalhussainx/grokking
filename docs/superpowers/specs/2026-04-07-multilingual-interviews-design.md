# Multilingual Interviews + Company Personas + Question Variation — Design Spec

**Date:** 2026-04-07
**Author:** Brainstormed with Claude (sonnet-class) + 2 background research agents
**Status:** Approved by Bilal — proceeding to implementation
**Targets:** v0 Pro feature parity with the multilingual marketing claim; pre-incubator ready

---

## TL;DR

KairosLearn's landing page promises "17 languages" of AI interview coaching, but interviews currently run in English only and the platform actually supports 9 native voice languages (7 Deepgram + 2 Sarvam Indic). This spec aligns the product with reality, makes interviews available in all 9 languages with code-mixed bilingual style, adds 14 company-specific interviewer personas (Google L4, Meta E4, Amazon SDE II, etc.) grounded in real reports, and prevents repeat questions across sessions via a sliding-window history table.

It explicitly does **not** add: Cartesia/ElevenLabs as a third TTS provider, college admissions interviews, OpenRouter, or user-customizable personas. Those are future work.

---

## Goals

1. **Stop lying on the landing page.** Ship 9 honest native-voice languages, market 9.
2. **Make interviews work in all 9 languages** with realistic code-mixed style (Hinglish, Spanglish, etc.).
3. **Make interviews feel like the real company.** 14 distinct interviewer personas grounded in Glassdoor/Levels.fyi/Blind reports.
4. **Make interviews feel non-repetitive.** No user sees the same question twice within their last 50 (per role × type bucket).
5. **Ship in days, not weeks.** Reuse existing voice infra; no new vendors.

## Non-Goals

- Adding voice support for Mandarin, Arabic, Portuguese, Russian, Korean, Vietnamese, Turkish, Indonesian, etc. — these need a third TTS provider (Cartesia/ElevenLabs) and are deferred to a post-incubator spec
- College admissions interview vertical (separate spec)
- OpenRouter as a second LLM provider (defer)
- User-customizable personas
- Pure target-language mode (only code-mixed for now)
- Sub-personas per team for Apple/Anthropic/OpenAI

---

## Architecture Overview

```
┌──────────────────────────────┐         ┌─────────────────────────┐
│  Setup page (/interviews)    │────────▶│  POST /api/interviews/  │
│  - Role picker               │         │       plan              │
│  - Interview type            │         │  - reads question       │
│  - NEW: Company picker       │         │    history (last 50)    │
│  - NEW: Language picker      │         │  - injects exclusion    │
│  - Calls /interviews/plan    │         │    list into LLM prompt │
└──────────────────────────────┘         │  - returns plan         │
              │                          │    (English structure)  │
              ▼                          └────────────┬────────────┘
┌──────────────────────────────┐                      │
│  Interview room              │                      │
│  /interviews/[sessionId]     │                      │
│  - InterviewVoicePanel       │◀─────────────────────┘
│  - SWITCH from               │
│    useDeepgramAgent →        │
│    useVoiceAgent (router)    │         ┌─────────────────────────┐
│    so it picks Deepgram or   │────────▶│  POST /api/ai/          │
│    Sarvam by language        │         │       voice-session     │
└──────────────────────────────┘         │  - language param       │
              │                          │  - persona block        │
              │ on end                   │  - code-mix block       │
              ▼                          └─────────────────────────┘
┌──────────────────────────────┐         ┌─────────────────────────┐
│  POST /api/interviews/score  │────────▶│  Supabase:              │
│  - existing scoring          │         │  interview_question_    │
│  - NEW: writes asked         │         │       history (NEW)     │
│    questions to history      │         │                         │
└──────────────────────────────┘         └─────────────────────────┘
```

**Three things change, one thing is created, nothing is deleted:**

1. `useVoiceAgent` is now used in interviews (instead of bypassing it with `useDeepgramAgent` direct).
2. `/api/interviews/plan` accepts a `language` and `companyPersonaId`, queries the new history table, builds an exclusion list.
3. `/api/ai/voice-session` is extended (it already accepts `language`) with a code-mixing prompt block and a company-persona prompt block.
4. NEW: `interview_question_history` Supabase table.

---

## Section 1 — Language Support (Path A: 9 Honest Languages)

### Source of Truth

| # | Language | Code | Voice Backend | Voice Model ID | Native Voice | STT |
|---|---|---|---|---|---|---|
| 1 | English | `en` | Deepgram Agent (WS) | `aura-2-thalia-en` | Yes | nova-3 |
| 2 | Spanish | `es` | Deepgram Agent (WS) | `aura-2-diana-es` | Yes | nova-3 |
| 3 | French | `fr` | Deepgram Agent (WS) | `aura-2-agathe-fr` | Yes | nova-3 |
| 4 | German | `de` | Deepgram Agent (WS) | `aura-2-viktoria-de` | Yes | nova-3 |
| 5 | Italian | `it` | Deepgram Agent (WS) | `aura-2-livia-it` | Yes | nova-3 |
| 6 | Dutch | `nl` | Deepgram Agent (WS) | `aura-2-rhea-nl` | Yes | nova-3 |
| 7 | Japanese | `ja` | Deepgram Agent (WS) | `aura-2-izanami-ja` | Yes | nova-3 |
| 8 | Hindi | `hi` | Sarvam orchestrated | `bulbul:v3 priya` | Yes | Sarvam Saaras v3 |
| 9 | Punjabi | `pa` | Sarvam orchestrated | `bulbul:v3 simran` | Yes | Sarvam Saaras v3 |

**Critical principle:** every language in this table delivers a native-accent voice. We will never fall back to an English carrier voice and call it "Hindi support".

### Voice Routing

The routing infrastructure already exists in `src/hooks/useVoiceAgent.ts`. The interview flow currently bypasses it. The fix: swap the import in `InterviewVoicePanel.tsx` from `useDeepgramAgent` to `useVoiceAgent`, then pass the language picked on the setup page through the existing `VoiceAgentConfig` interface.

### Code-Mixing Strategy

For non-English languages, the interviewer's system prompt receives a code-mixing instruction block:

> *"You are conducting this interview in {{Language}}, but mix English freely for technical terms. Speak the way a senior {{Region}} engineer would speak to another {{Region}} engineer in a real interview — natural code-mixing, not pure {{Language}}. Examples: {{2-3 sample sentences}}. Technical vocabulary (React, hashmap, O(n), API, async, etc.) stays in English. The candidate may answer in any mix; understand both."*

Lives in `src/lib/language-personas.ts` as a `getInterviewerCodeMixingPrompt(lang: string): string` function. English returns empty string (no adapter).

### Why Code-Mixed Default

Pure-target-language tech interviews don't exist in real life. The audit explicitly recommended this. It is a 6–10 line system prompt change, not a new feature flag.

### Bug Fix In Scope

`mcp-samsara/src/index.ts:718` maps `zh` (Chinese) to `aura-2-izanami-ja` (a Japanese voice). Removed entirely as part of this work.

---

## Section 2 — Company-Specific Interviewer Personas

### Persona Schema

```typescript
// src/data/interview-personas.ts
export interface CompanyPersona {
  id: string;                      // "google-l4", "meta-e4", etc.
  company: string;                 // "Google"
  level: string;                   // "L4 SWE"
  hardness: number;                // 1-10
  hintGenerosity: 'stingy' | 'moderate' | 'generous';
  pacingPressure: 'slow' | 'medium' | 'aggressive';
  behavioralWeight: number;        // 0.0–1.0
  signatureTopics: string[];
  antiPatterns: string[];
  rubricVocabulary: string[];      // phrases the AI should use
  openingLine: string;
  codeFormat: 'no-execution-doc' | 'coderpad' | 'whiteboard' | 'take-home';
  rubricWeights: { coding: number; design: number; behavioral: number; domain?: number };
}
```

### The 14 Personas (Initial Catalog)

Stored in `src/data/interview-personas.ts`. Sourced from the FAANG research agent (Glassdoor, Levels.fyi, Blind, r/cscareerquestions, interviewing.io).

1. **Google L4 SWE** — hardness 7, stingy hints, slow pacing, behavioral 15%, Google Docs no-execution
2. **Meta E4 SWE** — hardness 7.5, moderate hints, aggressive pacing, behavioral 25%, CoderPad
3. **Amazon SDE II** — hardness 6.5, moderate hints, medium pacing, behavioral 40% (LP-heavy), Chime
4. **Apple ICT3** — hardness 7, variable hints, conversational, deep technical drill (general — team variance not modeled in v0)
5. **Microsoft SDE II** — hardness 6, generous hints, relaxed pacing, behavioral 20%
6. **Netflix Senior** — hardness 8 (judgment), no live coding, behavioral 40%
7. **Stripe L2** — hardness 7.5, generous hints, long sessions, real-API integration emphasis
8. **Anthropic MTS** — hardness 8, thoughtful pacing, mission alignment 20%, take-home format
9. **OpenAI SWE** — hardness 8, fast pacing, shipping-focused, ML literacy weighted
10. **Nvidia SWE** — hardness 7, methodical, C++/CUDA depth, behavioral 15%
11. **Databricks SWE** — hardness 8, tight pacing, distributed-systems-pilled
12. **Airbnb SWE** — hardness 7, iterative refactoring, code quality emphasis, values round
13. **Uber SDE II** — hardness 7, pragmatic, geo/distributed focus
14. **LinkedIn SWE** — hardness 6.5, calm, structured rubric

Plus the existing **Generic Interviewer** persona stays as the default for users who don't pick a company.

### Prompt Builder

`buildCompanyPersonaPrompt(persona: CompanyPersona, language: string): string` lives in `src/lib/interview-personas.ts` and emits a prompt block with sections:

```
## INTERVIEWER IDENTITY
You are a {{company}} {{level}} interviewer running a real interview loop.

## OPENING
Your first words must be exactly: "{{openingLine}}"

## HINT POLICY
{{stingy → "Wait 90 seconds of silence before any hint. Make hints small."}}
{{moderate → "Offer a small nudge after 60 seconds."}}
{{generous → "Offer help freely, even before fully stuck."}}

## PACING
{{aggressive → "If candidate has not started solving by minute 10, push: 'Let's get any working solution down — we can optimize after.'"}}
{{slow → "Let silences breathe. The candidate should drive."}}

## BEHAVIORAL EMPHASIS ({{behavioralWeight*100}}%)
{{N}} of your turns should pivot to behavioral. Use phrases like: {{rubricVocabulary}}.

## ANTI-PATTERNS YOU PUNISH
- {{antiPattern1}}
- {{antiPattern2}}
...

## RUBRIC WEIGHTS
Coding {{coding}}, Design {{design}}, Behavioral {{behavioral}}.
```

This block sits **above** the question plan and the code-mixing block. All three compose: persona + language adapter + question plan.

### Where Persona Selection Lives

The setup page gets a third selector (dropdown) below Role and Interview Type: **Company** (optional, defaults to "Generic"). Most users will keep "Generic" for their first interview.

---

## Section 3 — Question Variation Engine

### Database Schema

```sql
CREATE TABLE interview_question_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  company_persona_id TEXT,
  question_text TEXT NOT NULL,
  question_topic TEXT,
  asked_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_question_history_lookup
  ON interview_question_history (user_id, preset, interview_type, asked_at DESC);

ALTER TABLE interview_question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own history"
  ON interview_question_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users write own history"
  ON interview_question_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Read Path (Plan Generation)

`POST /api/interviews/plan` for authenticated users:

1. Query last 50 for user × preset × interview_type:
   ```sql
   SELECT question_text FROM interview_question_history
   WHERE user_id = $1 AND preset = $2 AND interview_type = $3
   ORDER BY asked_at DESC LIMIT 50
   ```
2. If non-empty, inject exclusion list into the planning LLM prompt:
   > *"The candidate has already been asked the following questions in previous sessions. Do NOT repeat any of these. Generate fresh questions covering different angles of the same topics: 1. ... 2. ..."*
3. Pass a unique `seed` (Date.now() + random) and bump temperature to 0.85.

For guests: skip the query entirely. They get LLM randomness only.

### Write Path (Interview End)

`POST /api/interviews/score` (existing) is extended for authenticated users to batch-insert the asked questions into `interview_question_history`. Skip silently on insert errors — history is best-effort, the score is the user-visible artifact.

### What Counts As "Asked"

Every question in `questionPlan.questions[]`, regardless of whether the AI got to it. Better to over-record than under-record.

### Variability Beyond Exclusion

Three additional levers stack on top of the exclusion list:

1. **Persona randomization** — sub-style rotation per session (Google L4 has 3: algorithms-leaning, design-leaning, communication-leaning)
2. **Seed variation** — every plan gets a unique seed
3. **Topic diversity prompt** — instruct the LLM to deliberately pick topics not covered last time

---

## Section 4 — UI Changes

### `/interviews` Setup Page

Two new selectors added to `InterviewSetup.tsx` between "Interview Type" and "Custom JD":

- **Company style (optional)** — dropdown, defaults to "Generic". 15 entries.
- **Interview language** — dropdown, defaults to "English". 9 entries with native script labels.

Helper text under language picker: *"Non-English languages use natural code-mixing (e.g. Hinglish)"*.

Both new fields stored in interview state and passed through to `/api/interviews/plan` and `/api/ai/voice-session`.

### `/interviews/[sessionId]` Room

Header chips display the active company persona and language read-only. No mid-interview switching.

### Landing Page

- Eyebrow: `"English · Español · Français · Deutsch · Italiano · Nederlands · 日本語 · हिन्दी · ਪੰਜਾਬੀ"`
- Subheadline: change "17 languages" → "9 voice languages"
- Section 01 (multilingual): rewrite to honest 9
- Stats section: "17 languages" → "9 languages"
- All metadata (title/OG/Twitter) updated

---

## Section 5 — Implementation Order

1. **DB migration** — `interview_question_history` table + RLS
2. **Persona catalog** — `src/data/interview-personas.ts` with 14 personas
3. **Prompt builders** — `buildCompanyPersonaPrompt` + `getInterviewerCodeMixingPrompt`
4. **API: `/api/interviews/plan`** — accept `language` + `companyPersonaId`, history exclusion
5. **API: `/api/ai/voice-session`** — wire persona + code-mix blocks for `mode: "interviewer"`
6. **API: `/api/interviews/score`** — write to history table
7. **Hook swap** — `InterviewVoicePanel` switches from `useDeepgramAgent` to `useVoiceAgent`
8. **Setup UI** — add Company + Language dropdowns
9. **Room UI** — show language + persona chips in header
10. **Landing copy** — update 17 → 9, rewrite section 01
11. **MCP bug fix** — strip `zh` from `mcp-samsara/src/index.ts`
12. **Smoke test** — guest hits Hindi technical Google L4 interview, voice works, no repeats on second try (logged in)

---

## Section 6 — Risks

| Risk | Mitigation |
|---|---|
| Sarvam latency for hi/pa is ~2-3s vs Deepgram's <1s | Already accepted in Talk; surface a "Streaming…" indicator |
| LLM ignores exclusion list and repeats anyway | Log repeat rate; if >5% see a repeat, escalate to curated banks |
| Persona + code-mix + exclusion = prompt bloat | Cap exclusion at 50; cap topic descriptions; total budget ~3k tokens |
| Users complain "Hinglish" isn't their style | Ship default; add "Pure target language" toggle in v2 only if asked |
| FAANG personas drift as companies update loops | Versioned in `src/data/`; quarterly review |
| Apple/Anthropic/OpenAI personas are weakest (team variance) | Ship the general version; flag as "v0" in the persona description |

---

## Out Of Scope (Explicit)

- Cartesia/ElevenLabs integration → post-incubator
- College admissions interviews → separate spec
- OpenRouter as 2nd LLM provider → defer
- Pure target language mode → defer
- User-customizable personas → defer
- Sub-personas per team for Apple/Anthropic/OpenAI → defer
- Persona difficulty knobs (calibration newgrad vs senior) → encoded as separate persona rows instead
- Mid-interview language switching → defer

## Future Work This Spec Unblocks

- Curated question banks per company (once we see real repeat data)
- College interviews vertical (same engine, new persona catalog)
- "Practice the exact loop" — chained rounds simulating Google's 4-round day
- Hint analytics — correlate hint generosity with user satisfaction
