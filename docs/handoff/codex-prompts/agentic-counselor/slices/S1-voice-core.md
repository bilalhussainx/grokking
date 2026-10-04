# S1 — Voice core: short role prompts, reply cap, latency probe, 7 Deepgram languages (effort: High)

## Why
Students hear Kairos before they read anything. Today the voice prompt is about 24k characters: Deepgram truncates it, replies run 20–36 s, and first audio arrives in 1.1–3 s. Claude's experiments (04-RESEARCH-BRIEF §6) show that a short prompt alone gets en and es to about 0.9–1.1 s and cuts replies to under 13 s. This slice makes that the product, and builds the probe that every later claim relies on.

## Read first
- 04-RESEARCH-BRIEF §6 (voice facts and the latency table).
- `docs/qa/2026-10-04-voice-language-validation.md` ("Concrete fixes" 1–6).
- The code path: `src/components/cc/coach/CoachChat.tsx` → `src/app/api/cc/coach/voice-prompt/route.ts` → `src/app/api/ai/voice-session/route.ts` → `src/hooks/useDeepgramAgent.ts`. Also `src/lib/voice/deepgram-agent-auth.ts` and `src/app/api/__tests__/voice-session-secrets.test.ts`.

## Scope
1. **A compact voice prompt builder**: `src/lib/voice/voice-prompt.ts`, `buildVoicePrompt({ role, student, step, language })`.
   - Inputs:
     - the role's `voicePrompt`. In S1, create only `src/lib/cc/roles/playbooks/kairos.ts`, exporting a minimal object with `id`, `name` and `voicePrompt` and the `RolePlaybook` type from 02-SPEC §4.2 (fields not needed yet may be stubs). S3 completes it and adds the other roles at the same paths;
     - a **student card** of ≤ 600 chars: name, grade, countries, top 3 schools, current journey step, one recent fact;
     - the language block;
     - the voice rules.
   - Output: ≤ 2,000 chars total, enforced by a test.
   - The voice rules go **last**. They are:
     - start with a 2–4 word reaction;
     - at most 2 short sentences;
     - ≤ 35 words;
     - end with one specific question;
     - no lists, markdown or links;
     - translate admissions terms into the student's language and keep proper nouns.
   - The language block covers all 17 voice codes (`src/lib/cc/coach-languages.ts`). It replaces "Plain spoken English only" for non-English.
2. **The voice-prompt route returns the compact prompt.** The text coach keeps its long prompt. Remove the language-instruction special-casing that only covered ur, hi and pa for voice.
3. **Hard reply cap.** Set `think.provider` options to cap output (find Deepgram's current field for max tokens; verify in the docs). Also enforce it client-side: if a single agent turn exceeds 45 words of transcript, log it to the latency log (below) as `overlong`.
4. **Model choice per language.** Create `src/lib/voice/voice-models.ts`, which maps language → `{ thinkType, thinkModel, endpointingMs }`. Start with Haiku 4.5 and 200 ms everywhere, then let the probe pick, with an override via env `VOICE_MODEL_OVERRIDES` (JSON).
5. **KeepAlive.** `useDeepgramAgent` sends `{"type":"KeepAlive"}` every 5 s while the socket is open, so long replies and a muted mic don't trigger `CLIENT_MESSAGE_TIMEOUT`.
6. **Latency logging (production).** When `AgentStartedSpeaking` arrives, the client posts `{ language, role, total_latency, tts_latency, ttt_latency, words }` to a new `POST /api/voice/latency`. It requires auth, is rate-limited to 1 per turn, and stores the data in a new table `voice_latency_events`.
   - Write the migration `supabase/migrations/<date>_voice_latency_events.sql` with RLS so users insert only their own rows and nobody else can select them; admin reads only.
   - **Do not apply it to production.** Stop and ask the founder when you reach deploy.
   - Until it's applied, the route must fail soft: return 202 and drop the event.
7. **The latency probe** `scripts/voice-latency-probe.mjs` (committed).
   - It reads keys from `.env.local` and never prints them.
   - It synthesizes a student utterance per language with Deepgram TTS (Sarvam TTS for Indic, used in S2), streams it in real time into the agent with the **production settings** (it imports or replicates the exact settings builder), and runs 3 turns × 2 runs.
   - It reports p50 and p90 of end-of-speech → first audio, Deepgram's `ttt` and `tts`, words per reply, language correctness (a script/character check plus one cheap LLM judgment), and `PROMPT_TOO_LONG` warnings.
   - Output: JSON plus a markdown table to `docs/qa/evidence/voice/<date>-probe.md`.
   - Flags: `--langs en,es`, `--model`, `--endpointing`. Spend guard: abort if the estimated cost passes $2 per run.
   - You may start from Claude's scratch harness logic described in 04-RESEARCH-BRIEF §6, but write it cleanly.

## Out of scope
Indic routing (S2), handoffs and specialist voices (S3/S4), UI redesign.

## Tests first (vitest)
- `buildVoicePrompt` returns ≤ 2,000 chars for a maximal student card; it contains the language name for es, ja and hi; it contains no "English only" for non-English; and its last section is the voice rules.
- The voice-session route returns a settings prompt ≤ 2,000 chars for coach mode with a client prompt, and `agent.language` equals the session language for the 7 Deepgram codes. Extend `voice-session-secrets.test.ts` and keep its no-secrets assertions.
- `/api/voice/latency`: 401 for guests; 202 for a valid body; 400 for an invalid body; rate limit enforced.
- `useDeepgramAgent` sends KeepAlive on an interval (fake timers).

## Acceptance (measured with the probe against production after deploy)
- en, es, fr, de, it and nl: p50 ≤ 900 ms, p90 ≤ 1,300 ms. ja: p50 ≤ 1,600 ms.
- Median words per reply ≤ 35. Zero `PROMPT_TOO_LONG` warnings.
- Language correct in 100% of replies.
- If a target is missed, try in this order:
  1. a model per language (gpt-4.1-mini vs Haiku);
  2. endpointing at 200 vs 150 ms;
  3. a shorter student card.

  Then report the best achieved numbers honestly. Don't fudge the measurement.

## Prod checks after deploy
1. The probe against production settings (sign in as the QA student, fetch `/api/cc/coach/voice-prompt` and `/api/ai/voice-session`, use the returned token and settings) for the 7 languages. Commit the table.
2. Manual-equivalent: Playwright opens `/cc` signed in, starts voice with a fake mic (`--use-fake-device-for-media-stream --use-file-for-fake-audio-capture=<wav>`), and confirms a transcript appears and agent audio bytes arrive.
3. The secrets regression: the anonymous POST returns 401, and the signed-in response has no `key` field and no `Bearer`.

## Deliverables
Code, migration file (not applied), probe script, probe results table, ledger entry. Report the latency table in the session report.
