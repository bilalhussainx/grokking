# S2 — Indic voice: all 10 Sarvam languages routed, streaming, honest (effort: High)

## Why
The UI offers voice in hi, bn, ta, te, gu, kn, ml, mr, pa and od. The server accepts only hi and pa; the other 8 fail with "Unsupported language". Even hi and pa take 4–11 s per turn because nothing streams. South Asian families are a core audience (see the multilingual welcome on the homepage). A broken language is worse than no language.

## Read first
- 04-RESEARCH-BRIEF §6 (the Sarvam facts).
- `docs/qa/2026-10-04-voice-language-validation.md` §B and fixes 7–10.
- The code path: `src/hooks/useVoiceAgent.ts` (the router), `src/hooks/useOrchestratedVoiceAgent.ts`, `src/app/api/language/sarvam/stream/route.ts`, `src/lib/voice-provider-router.ts`, `src/lib/cc/coach-languages.ts`, and `src/components/cc/coach/CoachChat.tsx` (`VOICE_SUPPORTED_LANGUAGES`).
- Sarvam API docs (WebFetch https://docs.sarvam.ai): speech-to-text (REST and **streaming WebSocket**), text-to-speech (REST and **streaming**), language codes, bulbul v3 speakers, saaras/saarika models. Record the exact endpoint and message shapes in your plan before coding.

## Step 1: Make it work, then make it fast

**Phase A: correctness (ship first).**
1. Route all 10 codes through the Sarvam pipeline:
   - STT with Sarvam for all 10 (Deepgram nova-3 rejects ml and od);
   - the LLM, using the S1 compact voice prompt and role playbook, through OpenRouter server-side;
   - TTS with bulbul v3 and a speaker per language. Pick from the Sarvam docs and record the choice in `src/lib/voice/sarvam-voices.ts`.
2. **Script filter:** reject and regenerate once if the reply contains characters from a script other than the target language's (plus Latin for proper nouns). Unit-test this with mixed-script fixtures (Tamil plus Bengali chars, Odia plus CJK). If it still fails, fall back to a one-line apology in the target language from a fixed table and log it.
3. **Coach context:** the Indic path must use the same student card and the same rules as S1. No separate "language tutor" persona.
4. The student must hear something within 1.5 s even if the full reply takes longer. Do this with the first-clause pipeline below, not a filler sound.

**Phase B: latency.**
1. **Streaming STT:** use Sarvam's streaming STT (WebSocket) if available, with VAD or end-of-speech detection; otherwise keep REST with short silence endpointing on the client (300 ms).
2. **Streaming LLM:** stream tokens. As soon as the first clause ends (`।`, `.`, `?`, `!`, `,` after ≥ 4 words, or 12 words), send it to TTS.
3. **Streaming TTS:** use Sarvam's streaming TTS if available. Otherwise synthesize the first clause and the rest separately and play them in sequence.
4. **Transport:** today the route returns NDJSON over HTTP. Keep that if it can carry audio chunks progressively (base64 frames per clause). Use Vercel WebSockets (`experimental_upgradeWebSocket` from `@vercel/functions`) only if HTTP streaming can't meet the target. Write the reason in the ledger.
5. **Keys stay server-side.** The Sarvam and OpenRouter keys never reach the browser. Add a no-secrets test for the stream route's responses.

## Tests first
- The route accepts all 10 codes and rejects unknown codes with 400.
- The speaker map covers all 10.
- The script filter cases (pass and fail).
- First-clause splitting for Devanagari, Tamil and Bengali punctuation.
- Streaming order: the first audio frame is emitted before LLM completion (mock providers with delays).
- The no-secrets test.

## Acceptance (probe from S1, extended to Sarvam, against production)
- All 10 languages return a reply in the right script in 100% of probe turns.
- Time from end of speech to first audio: p50 ≤ 1.5 s, p90 ≤ 2.2 s, with a stretch target of ≤ 1.0 s. Report the real numbers.
- Replies ≤ 35 words.
- **Native review gate:** generate a review sheet `docs/qa/evidence/voice/<date>-indic-review.md` with 3 replies per language plus back-translations. Mark every language as `UNREVIEWED` in `src/lib/voice/verified-voice-languages.ts` (created in S9; create it now if it doesn't exist). The founder arranges native reviewers. Languages stay unclaimed in marketing until they're marked reviewed.

## UI honesty (ship with phase A)
If a language fails the probe, set it to `text-only` voice mode in `coach-languages.ts`, so the UI never offers a broken voice. The text coach still works in that language.

## Prod checks
- The probe table for the 10 languages, committed.
- Playwright: sign in, set the coach language to ta, start voice with fake mic audio (a Tamil wav from Sarvam TTS), and confirm a Tamil transcript and audio arrive.
- The secrets check.
