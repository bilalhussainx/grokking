# 04 — Research brief: what to build and why, with sources

Everything here is distilled from files in this repo. When a slice needs detail, open the source file and section named here. Don't re-run research that's already done. Flag anything you find to be wrong.

## 1. Competitors and what students complain about

Source: `docs/research/compass_artifact_wf-be7cb4e1-71de-5117-b1c0-a0de2600d77f_text_markdown.md` (TL;DR, comparison table, the complaints JSON, Recommendations). Also `docs/research/2026-09-26-competitors-and-negative-reviews.md`.

| Competitor | What it is | Why students and families leave (quoted or summarized from sources) |
|---|---|---|
| CollegeVine (Sage) | Free AI counselor funded by college recruiting | Wrong deadlines ("Dartmouth does not have an ED II"), "AI spambots", recruiter outreach that feels like marketing; Trustpilot 1.9/5 |
| Kollegio | Free AI counselor; scholarship finder, essay brainstorm | US-only; no proactive outreach documented |
| Kolly | AI essay reviewer, $29/mo | T20-US-essay calibration; no UK/Canada |
| KapAdvisor (Kaplan) | AI counselor, $199 premium | A test-prep funnel; US-only |
| Naviance / Scoir / PowerBuddy | School-licensed | Only via district; reactive |
| Coach Possible (College Possible + Common App) | AI plus human coach | Only for program students; the one product that spots inactive students, and it needs a human |
| Crimson, InGenius, Command | Human firms, $25k to $120k+ | Cost, refund refusals, 72-hour replies, generic advice at premium prices |

**The white space KairosLearn owns:**
1. **Proactive:** reaches out first, especially to shy students.
2. **Cross-system:** US, UK (UCAS), Canada (OUAC) and transfer.
3. **Affordable:** $15/month.
4. **Not selling attention:** pending the founder's confirmation.
5. **Suggestion-only:** the student confirms every change and writes every word.

College Possible's CEO puts the core insight well: "Information is not the problem these days, it's the human connection and the motivation to do the right things at the right time."

**Features competitors have that we lack:**
- a **scholarship finder** (Kollegio, Kolly), which S7 adds;
- a **mock committee / multi-reader review** (Kolly), which is a possible later Wren feature;
- a **parent dashboard** (KapAdvisor); we have family mode and a parent share link.

## 2. What great human counselors do (turn into playbooks)

Source: `docs/research/2026-10-03-part2-counselor-playbook.md`. Map the topics to roles:

| Topic in Part 2 | Role | Use for |
|---|---|---|
| 1 School-list construction | Leo | balanced-list rules, fit questions |
| 2 Timeline and accountability | Kairos, Juno | weekly plan, check-in cadence |
| 3 Essay coaching technique | Wren | interview questions, story mining, feedback style |
| 4 Activities and honors | Wren, Kairos | activities optimizer handoff |
| 5 Recommendation strategy | Juno | recommender asks and brag sheet |
| 6 Testing strategy | Leo | test-optional reasoning |
| 7 Financial aid, merit, appeals | Ana | aid plan, appeal checklist |
| 8 Interview preparation | Sam | mock interview rubric |
| 9 ED/EA/REA/RD ethics | Juno | conflict explanations |
| 10 Waitlist and deferral | Juno, Wren | LOCI coaching |
| 11 Shy, anxious, overwhelmed students | Kairos | tone, pacing, tiny steps |
| 12 Parents, including non-English families | Kairos | family bridge |
| "Nudge tone and cadence" | all | every proactive message |

The section "Cross-cutting principles for the AI" is binding on every playbook.

## 3. Rules and institutions data (2026–27)

Sources: `docs/research/2026-10-03-part3-systems-rules.md` (Common App, UCAS, OUAC, CSS, FAFSA rules) and `docs/research/2026-10-03-part3-us-institutions.md`. Use them as **seed evidence**: every fact the agent states must carry the source URL and a checked date from these files or from data tables built from them. If a fact isn't there, the agent says "not yet verified for 2026–27".

## 4. Golden set (evals)

Sources: `docs/research/2026-10-03-part4-golden-set.md` and `docs/research/2026-10-03-golden-set.json`: 120 cases across grades, countries and task families, with deterministic scoring fields.
- Use them to build each role's eval file (02-SPEC §4.2).
- Keep evals cheap: run the deterministic checks on every change, and the model-graded checks only on the slice's final run, with a $5 cap per slice.
- The runner stub is `scripts/agent-golden-run.ts`.

## 5. Data sources: what may be fetched automatically

Source: `docs/research/2026-10-03-part5-data-sources.md`.
- **Automated refresh is allowed:** College Scorecard API (key, under 1,000 requests per hour per IP), IPEDS bulk CSV, UCAS "Data and analysis" CSVs (CC BY 4.0, attribute), Discover Uni (confirm the licence), Statistics Canada and Ontario OGL (attribute).
- **Curate by hand, never scrape:** Common App, College Board / CSS Profile, UCAS site pages and key dates, OUAC (never `/apply/`), OSAP, per-school CDS, net price calculators, per-school deadline pages, any `.edu` page whose terms haven't been read.
- **Scholarships (S7):** curate by hand from each award's own official page. Store the URL, the date checked, eligibility, amount and deadline exactly as stated. Mark "varies" or "not stated" rather than guessing. No aggregator scraping (Fastweb, Bold.org and similar) unless their terms explicitly allow it, and record the clause.

## 6. Voice: measured facts (2026-10-03/04)

Source: `docs/qa/2026-10-04-voice-language-validation.md`, plus Claude's latency experiments on 2026-10-04 (below).

**Deepgram Voice Agent** (`wss://agent.deepgram.com/v1/agent/converse`):
- Auth from a browser is `new WebSocket(url, ["bearer", token])`, with the token from `POST /v1/auth/grant`. This **requires a Member-role key**; Default-role keys get 403. The production key is Member (verified).
- Deepgram-hosted think models accepted on 2026-10-04:
  - anthropic: `claude-haiku-4-5`, `claude-sonnet-4-5`. (`claude-sonnet-4-20250514`, `claude-3-5-haiku-latest` and dated 4.5 IDs were rejected.)
  - open_ai: `gpt-4.1`, `gpt-4.1-mini`, `gpt-4o-mini`, `gpt-5`, `gpt-5-mini`.
  - google: `gemini-2.5-flash` (`gemini-2.5-pro` was rejected).
- `agent.language` must be set, or nova-3 transcribes non-English as silence (fixed in 6b1d025 for the 7 languages).
- A prompt of about 24k chars triggers a `PROMPT_TOO_LONG` warning and silent truncation.
- The socket closes with `CLIENT_MESSAGE_TIMEOUT` if no audio or KeepAlive is sent for about 10 s. The client must send `{"type":"KeepAlive"}` while the agent speaks long replies or the mic is muted.
- `AgentStartedSpeaking` carries `total_latency`, `tts_latency` and `ttt_latency`. Log them.
- nova-3 rejects `ml` and `od` (400). Indic STT must use Sarvam.

**Latency experiments.** Measured from end of user speech to first agent audio, Claude Haiku 4.5 hosted, real 2-turn conversations, two runs per cell:

| Prompt / endpointing | en | es | ja |
|---|---|---|---|
| Production prompt (~24k chars), 300 ms | 1.42 / 1.42 s | 2.45 / 0.89 s | 2.28 / 3.17 s |
| Short role prompt (~600 chars), 300 ms | 1.09 / 1.08 s | 1.28 / 0.63 s | 3.03 / 1.65 s |
| Short role prompt, gpt-4.1-mini, 300 ms | 0.86 / 0.99 s | 0.95 / 0.98 s | 2.27 / 1.37 s |
| Short role prompt, Haiku, 150 ms | 0.89 / 0.95 s | 1.25 / 0.94 s | 2.11 / 1.83 s |

Conclusions:
1. Prompt size is the biggest lever. Short prompts also cut spoken replies from 20–36 s to 7–13 s.
2. `gpt-4.1-mini` is slightly faster than Haiku for first audio. Choose per language by measurement, and keep quality checks.
3. Endpointing at 150 ms helps a little but risks cutting students off. Test 200 ms, and consider Deepgram's newer end-of-turn models if available.
4. ja needs its own tuning: a model choice and a shorter first clause.
5. Instructing the model to "start with a 2–4 word reaction" lowers time to first audio, because TTS starts on the first clause.

**Sarvam** (Indic):
- STT takes 0.5–1.6 s.
- TTS (bulbul v3) takes about 0.8 s for 4–5 words and 2–3.5 s for 15–25 words, non-streaming.
- The current route only accepts hi and pa.
- A proxy LLM produced mixed-script output in Tamil and Odia. Add a script filter, and get native review before advertising.
- To approach 1 s: use streaming STT (Sarvam streaming WebSocket), stream LLM tokens, send the **first clause** to streaming TTS, and keep replies short. Verify Sarvam's streaming endpoints in their docs; don't assume.

**Voice "not mechanical" checklist** (from the validation report):
- Avoid the same template answer in every language. Vary the reactions.
- Translate domain terms ("transcript", "admissions officer", "first-gen") into the target language.
- Always end with one specific question.
- Use the student's own words.
- Keep it to ≤ 35 words.

## 7. Existing internal designs and audits to reuse

| Doc | Use |
|---|---|
| `docs/strategy/2026-10-03-agentic-counselor-gap-analysis.md` §3–§4 | the target architecture (tool registry, planner loop, memory, triggers, evidence cache, evals, cost) and what "agentic" looks like to a student |
| `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` | the binding agent contracts (preview → confirm → commit, citations from evidence IDs, an unknown state) |
| `docs/evidence/agent/rulings-a1-s1.md` | rulings that bind further agent work, and deferred items |
| `docs/design/2026-10-03-amendment-c-step-clarity.md` | rules C1–C11 and their acceptance checks for every screen |
| `docs/design/2026-10-03-landing-audit.md` | the signed-out site audit, hero rewrites, SEO and canonical issues |
| `docs/qa/2026-10-03-student-workflows.md` | the top 10 student-experience fixes, ranked |
| `docs/qa/2026-10-03-counselor-workflows.md` | counselor workflow gaps |
| `docs/handoff/codex-prompts/session-b-d4-3-d4-8-agent-surface-and-marketing.md` | the earlier Astra brief for agent UI states (proposal card states, inbox, memory, nudge settings, integrity moment) |
