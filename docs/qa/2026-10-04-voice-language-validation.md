# Coach Kairos voice: 17-language validation (2026-10-04)

Repo read: `grokking-integrate` (not modified). Scripts and raw JSON live in the session scratchpad (`lang-validate/`), not in the repo. No key is stored in this file.

## Headline

1. **Only English works as shipped in group A.** The Deepgram Settings built in `src/app/api/ai/voice-session/route.ts` set no `agent.language` and no listen language, so nova-3 listens as English. Spanish, French, German, Italian, Dutch and Japanese speech is transcribed as nothing or as garbage. Details in section A1.
2. **Group B is broken for 8 of 10 languages by routing.** `src/app/api/language/sarvam/stream/route.ts` accepts only `hi` and `pa` (plus the Google-TTS set). `bn ta te gu kn ml mr od` return `Unsupported language`, yet `coach-languages.ts` lists all of them as `mode: "voice"` and `useVoiceAgent.isOrchestratedLanguage` sends them to this route. Code-read finding, not run against production (instructed not to call production).
3. **With `agent.language` set plus a language line in the prompt, the 7 group-A languages produce on-topic, language-correct replies at about 1.2-1.5 s** (Japanese 2.0-3.4 s). The fix is a few lines of code.
4. **Replies are too long for speech in nearly every language** (35-65 words, 12-27 s of audio). The prompt asks for 1-2 sentences and the model does not comply.

## Method

- **Persona:** the real `buildSystemPrompt()` (24,167 chars) was bundled with esbuild from the repo and run for a fictional student: Maya, grade 12, Texas, first-gen, GPA 3.7, 6 schools (2 reach, 3 match, 1 safety), school countries US and UK, intended major Biology, intake done, no essays yet. `detectMode` returned `general`.
- **Prompt assembly:** same as `voice-prompt/route.ts`: `base + buildLanguageInstruction() + VOICE_TAIL`. The `CoachChat` fallback prompt was not used because the real one is available.
- **User audio:** Deepgram `/v1/speak`, aura-2 voice of that language, linear16 16 kHz, one student line per turn.
  - Turn 1: "I'm in grade 12 and I'm stuck on my personal statement. I don't know what to write about."
  - Turn 2: "My dad says I should write about my grades. Is that a good idea?"
  - Both were authored by me in each language.
- **Group A transport:** `wss://agent.deepgram.com/v1/agent/converse`.
  - Settings as in the app: nova-3, endpointing 300, think = anthropic `claude-haiku-4-5` (Deepgram-hosted), speak = the aura-2 voice from `LANGUAGE_VOICES`.
  - Audio streamed in 20 ms frames at real-time pace, 0.3 s lead-in, 2.5 s trailing silence.
  - Latency = first agent audio byte minus the send time of the last speech frame. It therefore includes the 300 ms endpointing. Languages ran in parallel (7 sessions at once), which may inflate numbers slightly.
- **Variants run:**
  - `asis`: exactly what ships (no `agent.language`; `buildLanguageInstruction` returns "" for non ur/hi/pa).
  - `fixed`: `agent.language=<code>` plus a LANGUAGE line plus VOICE_TAIL saying "spoken <Language>".
  - `fixedhead`: as `fixed`, with the voice and language rules placed before the 24k-char base.
  - `tight`: as `fixedhead`, plus "max 2 sentences, under 30 words, reflect one thing the student said, ask exactly one question".
- **Group B:** the real route's stages, measured separately.
  - Sarvam TTS makes the user audio (bulbul:v3, priya, simran for pa; wav 16 kHz).
  - STT is measured two ways: Sarvam `saaras:v3` (the route uses it only for `pa`) and Deepgram nova-3 prerecorded (the route uses it for `hi`).
  - **LLM step is a PROXY, not production.** The route uses OpenRouter `anthropic/claude-sonnet-4.5` (Kimi fallback) with `max_tokens: 80`. I used the Deepgram-hosted Haiku via `InjectUserMessage` with the real coach prompt, a language line, and the route's "VOICE CONVERSATION RULES". Haiku quality and latency are not Sonnet 4.5's. Script contamination seen below may be Haiku-specific.
  - TTS is `bulbul:v3`, mp3 22050 as in the route, on the proxy reply.
- **Scoring:** 0-2 per criterion, averaged over the 2 turns; half points allowed. I scored the Latin and CJK languages directly. Indic scoring is a read by an LLM, not a native speaker, and is lowest confidence for kn, ml, od, mr, te and ta. **Native-speaker review is required before any marketing claim.**
- **Cost:** about 40 Deepgram agent sessions (~1 min each) plus about 100 small REST calls. Rough estimate $3, at or just over the cap, so I stopped. Deepgram's actual billing was not checked.

## A1. Group A as shipped (`asis`): non-English is not understood

| Lang | What the agent heard (Turn 1) | Result |
|---|---|---|
| en | "I'm in grade twelve, and I'm stuck on my personal statement..." | Works. Latency 1439 / 1339 ms. |
| es | (nothing) | No reply at all. |
| fr | (nothing) | Agent produced an English greeting. |
| de | (nothing) | English greeting, no answer. |
| it | "Sonalurtimana Giliceo" | English greeting. |
| nl | "Exit in my last is Schroia, aniclo Fast Medmein Personnel Ke essay." | Replied in English: "I'm not sure I caught that." |
| ja | (nothing) | No reply at all. |

Cause: the Settings in `ai/voice-session/route.ts` (lines ~304-345) have no `agent.language`, so the agent listens as English.

`voice-session/route.ts` line ~300 replaces the whole `contextPrompt`, including its LANGUAGE INSTRUCTION block, with the client prompt. The client prompt gets a language line only for ur, hi and pa. `VOICE_TAIL` still says "Plain spoken English only." So even if STT worked, the prompt would not request Spanish, French and the rest.

Latencies for the failed languages are not meaningful. They are mostly null; where a number appeared (de 5 ms, nl 21 ms, it 1241 ms) it was a greeting or a reply to garbage.

## A2. Group A with the fix (`fixed`): latency and scores

Latency is ms from end of speech to first agent audio byte, T1 / T2. Spoken length is the audio duration of the reply. Scores: **a** language correct, **b** specific question or concrete next step, **c** uses what the student said, **d** speech-length OK, **e** not mechanical.

| Lang | Latency T1/T2 | Words T1/T2 | Spoken s T1/T2 | a | b | c | d | e |
|---|---|---|---|---|---|---|---|---|
| en | 1227 / 1253 | 39 / 64 | 11.6 / 22.4 | 2 | 1.5 | 2 | 0.5 | 2 |
| es | 2032 / 1787 | 26 / 28 | 10.0 / 14.2 | 2 | 1.5 | 2 | 2 | 2 |
| fr | 1253 / 2369 | 52 / 60 | 19.2 / 20.9 | 2 | 1.5 | 2 | 0.5 | 1.5 |
| de | 1366 / 2014 | 43 / 44 | 14.8 / 17.2 | 2 | 2 | 2 | 1 | 1.5 |
| it | 1159 / 1179 | 35 / 35 | 16.0 / 14.6 | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 |
| nl | 1153 / 1488 | 48 / 34 | 15.2 / 13.9 | 1.5 | 1.5 | 1.5 | 1 | 1.5 |
| ja | 2966 / n/a* | n/a | 26.6 / n/a* | 2 | 2 | 2 | 0 | 2 |

*ja T2 produced no result in `fixed`. The agent was still speaking T1 (27 s) when T2 audio started, which is a barge-in artifact of my harness. In `tight`, ja T2 was 3441 ms and 25 s of audio. In `fixedhead`, ja T1 / T2 were 2222 / 2387 ms.

Median latency over the 13 valid fixed turns was 1366 ms (min 1153, max 2966). `tight` median was 1332 ms (min 765, max 3441). `fixedhead` had only a few valid numbers: en/de/ja. Reply length did not meaningfully improve in `tight`: 32-47 words, 12-15 s, in all Latin languages. The "under 30 words" rule was ignored.

### Reply text with back-translation (fixed, T1 then T2)

- **en.** T1: "That's totally normal — the blank page is the hardest part. Let me ask you this: what's something you've actually [cared] about or gotten genuinely excited about in the last year or two..." T2: "Not really — your GPA is already on your transcript... Since you're first-gen, this essay is especially your moment..."
  - Good: uses first-gen and GPA. T2 has no follow-up question.
- **es.** T1 BT: "I understand, that's the hardest part. Before thinking about topics, tell me: is there something in your life right now that excites or confuses you a lot?" T2 BT: "No, your grades are already in your file; admissions see them in your 3.7 GPA. The personal statement is for them to know [missing word], not your numbers."
  - Good: uses GPA 3.7. T2 text drops a word ("conozcan [a ti]").
- **fr.** T1 BT: "Ah, that's normal, many students wonder where to start. Before you dive in, tell me: is there something in your life that really excites you, or something that marked you recently, not necessarily a big achievement..." T2 BT: "No, not really, your grades are already in your school file. The letter is for universities to understand who you are..."
  - Long (3 sentences, 19-21 s). T2 has no follow-up.
- **de.** T1 BT: "That's completely normal, many students get stuck there. Let me help you find the right topic. What fascinates you most outside school, something where you lose track of time?" T2 BT: "No, I wouldn't recommend that, your grades are already visible on your report. What could you tell instead that your school doesn't already know about you?"
  - Best of the Latin set: warm, specific, asks one question. Still 3 sentences in T1. "Transcript" is an English leak.
- **it.** T1 BT: "Okay, that's normal, many students get stuck here. Tell me: what are you truly passionate about, or what experience changed you in a significant way you never expected?" T2 BT: "No, not a good idea, your grades are already in your transcript, and 'ammissions' knows it. The personal essay is where they hear who you are, not what you've done."
  - English words ("transcript", "ammissions") will be read by an Italian voice. Pronunciation not audio-checked.
- **nl.** T1 BT: "Good that you're tackling this, it's completely normal to get stuck. Let's first find out what interests you: is there something in your life that gives you real energy?" T2 BT: "Not really, your grades are already on your transcript and your GPA on your application, so it feels like repetition. Admissions officers want to hear about YOU, not your grades again."
  - Good. English leaks: "transcript", "admissions officers".
- **ja.** T1 BT: "I get it, everyone struggles at first. Let's flip it: what a university wants to read is not what you did but what you thought and felt through it. You want to study biology, so was there a trigger behind that? A discovery in a lab, wanting to help someone, a nagging question that got solved?"
  - Warm and personalized (uses the major). Two paragraphs, 26 s, far too long for speech. Uses plain-form 君.

### STT quality (agent's heard text, fixed)

All six non-English languages were transcribed essentially correctly. Minor drops: fr T2 lost the final "?", de "meinen" for "meinem", nl dropped the word "essay" in T1, ja dropped words in a couple of turns. This is with clean synthetic audio. It will be worse with real accented speech.

### Other group A observations

- With `agent.language` set on a non-English session, Deepgram emitted `PROMPT_TOO_LONG: The prompt was too long and had to be truncated` (3-4 warnings per session). English with no `agent.language` did not warn. Whatever is cut (likely the tail) is silently lost. In `fixedhead` the rules came first and the warning persisted, so the truncation is real for the 24k-char coach prompt. This also affects the real tail: `VOICE_TAIL` and the ACTIONS block.
- Words occasionally missing from the assistant `ConversationText`, e.g. "that you actually [care] about", "who [you are]". For de, the spoken audio re-transcribed correctly, so this may be a text-only artifact. Not confirmed for other languages.

## B. Group B: 10 Indic languages

### B1. Routing and code findings

- `stream/route.ts` line 15: `SARVAM_LANGUAGES = ['hi','pa']`, `SARVAM_STT_LANGUAGES = ['pa']`. Any other Indic code gets `Unsupported language: <code>` (~line 90). `SARVAM_SPEAKERS` and `SARVAM_TTS_LANG_MAP` also cover only hi and pa.
- The router (`voice-provider-router.ts`) lists 11 Sarvam languages and `SARVAM_LANGUAGE_CODES` exists for all, but the route does not use them.
- The route uses `max_tokens: 80` for the LLM. Indic scripts are token-dense, so 80 tokens plausibly cuts a reply mid-sentence. This is an estimate and was not tested (no safe LLM key).
- The route's STT sends `recording.webm` to Sarvam for pa, and sends webm to Deepgram for hi. I used wav.
- TTS is not streamed. The client waits for the whole mp3, so TTS time = time to first audio.
- UI: `coach-languages.ts` marks all 10 as `voice`.

### B2. Timings (ms, T1 / T2). Utterances ~7 s.

LLM = proxy (Haiku, time to first reply text). TTS = Sarvam bulbul:v3 on that reply (full mp3). Pipeline total = Sarvam STT + LLM proxy + TTS, as an indicative sum only.

| Lang | Sarvam STT | Deepgram STT | LLM proxy | TTS (reply words) | Indicative total |
|---|---|---|---|---|---|
| hi | 795 / 721 | 667 / 325 | 2443 / 2955 | 3646 (64w) / 3821 (89w) | 6.9 / 7.5 s |
| bn | 1533 / 678 | 874 / 810 | 2061 / 2883 | 4189 (32w) / 3851 (54w) | 7.8 / 7.4 s |
| ta | 1604 / 764 | 816 / 888 | 1649 / 2352 | 2352 (13w) / 3127 (24w) | 5.6 / 6.2 s |
| te | 1548 / 1234 | 904 / 868 | 1568 / 2363 | 1931 (9w) / 2886 (18w) | 5.0 / 6.5 s |
| gu | 1518 / 1587 | 897 / 804 | 2601 / 1966 | 3358 (28w) / 2130 (24w) | 7.5 / 5.7 s |
| kn | 1606 / 685 | 703 / 581 | 2975 / 3158 | 2977 (18w) / 2705 (17w) | 7.6 / 6.5 s |
| ml | 1530 / 690 | **400 error** | 2117 / 1642 | 2801 (16w) / 2074 (14w) | 6.4 / 4.4 s |
| mr | 728 / 685 | 850 / 682 | 1373 / 2460 | 2005 (10w) / 3136 (28w) | 4.1 / 6.3 s |
| pa | 1565 / 514 | 1226 / 1278 | 3016 / 4875 | 3243 (28w) / 4715 (50w) | 7.8 / 10.1 s |
| od | 1546 / 1241 | **400 error** | 3735 / 6354 | 4148 (25w) / 3524 (44w) | 9.4 / 11.1 s |

- Deepgram nova-3 does not support ml or od: `Bad Request: No such model/language/tier combination found.` (verbatim, request ids omitted).
- Isolated TTS for a short sentence (first clause, 3 runs, ms):

  | Lang | Words | TTS ms (3 runs) |
  |---|---|---|
  | hi | 5 | 1788, 1405, 797 |
  | bn | 18 | 2477, 2214, 2260 |
  | ta | 4 | 829, 855, 797 |
  | te | 4 | 948, 998, 932 |
  | gu | 15 | 1639, 2918, 1762 |
  | kn | 11 | 1843, 2558, 1743 |
  | ml | 11 | 1674, 1608, 1681 |
  | mr | 5 | 940, 920, 892 |
  | pa | 4 | 787, 769, 752 |
  | od | 7 | 1143, 1286, 1146 |

  TTS latency scales with length: roughly 0.8 s for 4-5 words, 2-2.5 s for ~15-18 words. A 25-word reply would take roughly 2.5-3.5 s.
- Sarvam STT (`saaras:v3`) round-trip accuracy on clean synthetic audio was near perfect for all 10, with small spelling variants. Both engines mis-heard the Marathi "बारावीत" (as "बारावीक"). Sarvam is the only engine that covers ml and od, and it was no slower than Deepgram once warm (0.5-1.6 s for ~7 s of audio).

### B3. Reply quality (PROXY LLM: Haiku, not the production model)

| Lang | a | b | c | d | e | Notes (back-translated) |
|---|---|---|---|---|---|---|
| hi | 2 | 2 | 2 | 0 | 1.5 | T1: "Getting stuck is normal; the first step is understanding what you're curious about... what could you spend hours on, maybe biology?" T2: 5 sentences, 89 words, ends with a question. Uses the major. Far over the 1-sentence rule. |
| bn | 2 | 1.5 | 1.5 | 0.5 | 1.5 | T1: "Find something you are truly excited about; is there a moment or feeling that defines you?" T2: "No, not a good idea; colleges see GPA elsewhere; use this to show your values." Natural, no wrong script. Long T2. |
| ta | 1 | 1 | 1.5 | 1.5 | 0.5 | Reply contains foreign characters: Bengali-script and Devanagari fragments plus CJK "成績" inside Tamil text (T1 "অভিজ்ஞதை", T2 "சாधारணமான", "成績", "அப்ளிকேशन்"). TTS would mispronounce or skip these. |
| te | 2 | 0.5 | 1.5 | 2 | 1 | T1 is short but has no question or next step: "Cool, this is a common issue, many get stuck here." T2: "That's a weak idea, grades are already in the transcript." Short, direct, a bit blunt. |
| gu | 2 | 2 | 1.5 | 2 | 1.5 | T1 asks a good concrete question (project, hobby, community work). T2 short and clear. |
| kn | 2 | 1 | 0.5 | 2 | 0.5 | T1 reads garbled ("...something that excites or changed you... not something smooth, only a real one?"). T2 says the essay should show personality, stilted vocabulary. Low confidence, LLM reader. |
| ml | 2 | 1 | 1 | 2 | 0.5 | T1 off-target: asks whether the student is afraid to think about something or has problems at school. T2 ungrammatical ("college knows your grade..."). Low confidence. |
| mr | 1.5 | 0.5 | 1 | 1 | 0.5 | T1 is semantically nonsense ("writing a personal statement is exciting in the morning") with no question. T2 mixes English "Activities section", "transcript" and invents words. |
| pa | 2 | 2 | 1.5 | 1 | 1 | T1 asks a specific list question. T2 is awkward and formal. |
| od | 1.5 | 2 | 1 | 0.5 | 1 | T1 long multi-option question. T2 contains Korean "구체" inside Odia. |

Script contamination (ta, od, partly mr) is a strong signal that the LLM choice matters for Indic, but I could not test production Sonnet 4.5.

## Verdict

**Good enough to market now (after the code fixes in 1 and 2): en, de, es, nl, fr, it, ja.**
- They produce warm, on-topic, language-correct replies at 1.2-1.5 s (ja 2.0-3.4 s).
- Best: en, de, es.
- Weaker: it and nl, because English words ("transcript", "admissions") leak into Italian and Dutch speech.
- ja is natural but too long and slowest.

**Not marketable as-is:**
- Everything non-English in group A until `agent.language` is set. As shipped, only English works.
- bn, ta, te, gu, kn, ml, mr, od: the route refuses them. Do not advertise them until routing is fixed and a native speaker checks quality.

**hi, pa:** the route accepts them, but the reply must come in under about 8 s and `max_tokens: 80` risks cut-offs. hi and pa are the only two Indic languages worth a first public claim after a native review, and only after Sonnet-4.5 end-to-end timing is measured. The proxy suggests 6-10 s per turn, which feels sluggish.

**Feels mechanical:**
- Replies are long, enumerating ("a hobby, a project, a challenge, a moment") and often end without a question in T2.
- Almost every language answers "No, not really — your grades are already on your transcript." That reads like the same template, translated.
- The base prompt's English phrases ("transcript", "admissions officers", "first-gen") are copied into every language.

## Concrete fixes

1. **STT language (critical, group A):** in `ai/voice-session/route.ts`, set `settings.agent.language` (or `listen.provider.language`) to the session language. One line. Verified here: `agent.language=<code>` fixed STT for all 6 non-English languages.
2. **Prompt language (critical, all non-English):** extend `buildLanguageInstruction` to all 17 codes, not just ur, hi and pa, and make `VOICE_TAIL` say "spoken <language>" instead of "English only". The `/api/cc/coach/voice-prompt` route owns this. The `ai/voice-session` LANGUAGE INSTRUCTION is currently dropped because the client prompt replaces it.
3. **Prompt budget:** the coach prompt (24k chars) triggers `PROMPT_TOO_LONG` truncation on non-English sessions. Build a compact voice-specific prompt: personality, student profile, current step, voice rules. Drop the large catalog, UK, Canada and ACTIONS blocks that voice cannot use. Put the hard voice rules first.
4. **Length:** the model ignores "1-2 short sentences". Add a hard word cap ("max 25 words, one question, no lists") and move it to the end of a short prompt. If still ignored, split TTS at the first sentence or cap response tokens at the Deepgram think settings. A test where rules were first plus "under 30 words" still gave 32-47 words, so prompting alone is not enough; a post-filter or sentence-boundary cut is likely needed.
5. **Language leakage (it, nl, es, de):** instruct "translate terms like transcript, admissions officer, first-gen into <language>; keep only proper nouns in English". Consider a per-language glossary.
6. **Endpointing:** 300 ms is already aggressive and the measured latency (1.2-1.5 s) is mostly Deepgram LLM and TTS. For ja (2-3.4 s) use a faster think model or a shorter prompt; the huge prompt is the likely cost. Consider streaming LLM to TTS sentence by sentence (the Deepgram agent already does this).
7. **Group B routing:** add speakers and language codes for bn ta te gu kn ml mr od to `SARVAM_SPEAKERS` / `SARVAM_TTS_LANG_MAP` / `SARVAM_LANGUAGES` in `stream/route.ts` (bulbul:v3 supports all of them in my tests). Use Sarvam `saaras:v3` STT for all Indic (Deepgram nova-3 rejects ml and od). Until that ships, hide those 8 languages from the voice picker (`coach-languages.ts`) so users do not hit "Unsupported language".
8. **Group B latency:** stream TTS (Sarvam has a streaming endpoint) and cut the reply to one short sentence; a 4-5 word reply is TTS-ready in ~0.8 s, a 25-word reply in ~3 s. Fix the `max_tokens: 80` risk by raising it and capping words instead.
9. **LLM for Indic:** re-run B3 with the production OpenRouter model. The Haiku proxy produced mixed-script output (Bengali, Devanagari, CJK, Korean characters inside Tamil and Odia replies). Add a post-filter that rejects replies containing scripts outside the target language plus Latin, and re-asks.
10. **Native review:** get a native speaker per language to rate the reply scripts in this report before any language is advertised.

## Caveats

- User audio was synthetic and clean. Real accented, noisy speech will do worse on STT.
- Group A used 7 parallel sessions, which may inflate latency a little.
- Group B latency is the sum of separately measured stages; the real route also adds network round trips from the browser.
- Indic scoring, especially kn, ml, od, mr, te and ta, is a low-confidence read by an LLM.
- Estimated spend is about $3, at the cap, so no further runs were made.
