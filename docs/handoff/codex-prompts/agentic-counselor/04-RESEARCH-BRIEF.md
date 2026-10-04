# 04 — Research brief: what to build and why, with sources

Updated 2026-10-04 with two more sources: `docs/research/2026-09-27-agent-differentiation-research.md` and `docs/research/2026-10-04-chatgpt-research-lower-trust.md`. When a slice needs detail, open the file and section named here. Don't re-run research that's already done. Flag anything you find to be wrong.

## 0. Research trust order (binding)

The research files disagree in places. Resolve conflicts in this order:

1. **Official pages you fetch yourself today**, with the URL and fetch date recorded.
2. `docs/research/2026-09-27-agent-differentiation-research.md`. Its sources are tagged (D) for direct fetch (verbatim) and (I) for an index extract (re-fetch before serving the fact to students).
3. `docs/research/2026-10-03-part2…part5`, the golden set JSON, and `compass_artifact_…md` (Part 1).
4. `docs/research/2026-10-04-chatgpt-research-lower-trust.md`. Use it only for competitor color and counselor-practice ideas. **Do not import its `institutions`, `systems` or `golden_set` JSON as evidence or eval answers.** Known errors in it:

| Its claim | Correct (source) |
|---|---|
| Harvard "ED Nov 1"; "test-optional through 2026–27" | Harvard uses **Restrictive Early Action**, and SAT or ACT is **required** for fall 2027 (09-27 research [S17][S17a]) |
| Stanford RD "Dec 1"; "test-optional"; "need-blind international: Yes" | Unverified and likely wrong. Re-fetch from stanford.edu before any use. |
| FAFSA 2027–28 "opens Dec 2026" | **Already open.** Federal deadline 30 Jun 2028; state and college deadlines are earlier (09-27 [S5]) |
| UCAS dates (from collegeflightpath.com, 2026-entry cycle) | 2027 entry: **15 Oct 2026, 18:00 UK** for Oxford, Cambridge and most medicine; **13 Jan 2027, 18:00 UK** equal-consideration date (09-27 [S20]) |
| Admissions tests "BMAT … TSA … MAT … PAT" | Retired. Oxford uses the **UAT-UK** tests (ESAT, TARA, TMUA); UCAT for medicine (09-27 [S22][S24]); repo test `src/lib/cc/uk/admissions-tests.test.ts` |
| OUAC "Group A/B forms replaced 101/105 (CUF)"; "80% ≈ 4.0 GPA" | Correct that 101/105 are gone: one Undergraduate application with Group A/B (09-27 [S30][S31]). The GPA conversion is unsourced; never use it. |
| Counselor examples that "polish your draft for grammar" or write an activity line for the student | Our rule is stricter: IECA III.A.ii says "shall not write application essays **or any portion** of an essay". Kairos questions and critiques; the student writes every line, activity descriptions included. |

## 1. Competitors: what students praise, what they complain about, where the gaps are

Sources: Part 1 (`compass_artifact_…md`), `2026-09-26-competitors-and-negative-reviews.md`, 09-27 §1 and §7, and the lower-trust 10-04 file (competitor table only).

| Competitor | Model | Praised for | Complaints and risks | Our angle |
|---|---|---|---|---|
| CollegeVine Sage | free; funded by colleges (recruiter network, "connect you to colleges") | free help when there's no counselor; "helped me so much with college research" | wrong deadlines ("Dartmouth does not have an ED II"); wrong chances ("giving me 2% for Cornell… I almost didn't apply, but I got in"); "AI spambots"; recruiter funnel; Trustpilot 1.9 | sourced dates, no probabilities, no lead-gen |
| Kollegio | free, donor-funded; ~100k–300k students | free; brainstorming "while still giving me the freedom… to write my essays entirely on my own"; scholarship finder | "would like it to be more specific" (generic output); US-only | specificity from the student's own data; UK/Canada; scholarships (S8) |
| Kolly | $29/mo, $149/6 mo | essay scoring, mock committee | line edits / rewriting; T20-US calibration; cost | coaching without rewriting; $15/mo |
| KapAdvisor (Kaplan) | free Q&A, $199 premium; **licensed to high schools at $3.5k–5k/yr** (lower-trust source, unverified) | "faster than waiting three days for an email reply" | "AI cannot replicate empathy… They don't know you"; a test-prep funnel | Kairos *knows you* (memory, story bank) and is warm |
| Scoir / Naviance / PowerBuddy | school-licensed | quick stats, College Compare | only via a school; reactive; generic; tracking-settlement history (Naviance) | works without a school; proactive |
| Coach Possible (College Possible + Common App) | program-only AI plus human coach | spots inactive students | limited to program students | proactive for everyone |
| Crimson, InGenius, Command | human firms, $20k–$120k+ | **accountability** ("keeping her on track"), being known, parent reassurance, UK/EU/US guidance, continuity | cost, refund disputes, 72-hour replies, turnover, generic at premium, outcome marketing | firm-like accountability at $15/mo |
| College Coach (Bright Horizons) | **employer-benefit channel** | former admissions/aid officers | US-only; through employers | channel idea for the founder (§7) |
| DreamCollege.ai | "AI essay Writer – powered by Agentic AI" (its meta description) | — | ghostwriting: fraud risk under the Common App policy | our integrity log is the opposite |

**Gaps no competitor fills well** (09-27 §7.1, an absence of evidence across the pages checked). These are our eight differentiators:
1. **Cited, dated, cycle-scoped requirements and deadlines that abstain when unknown**, with a visible "last checked" date.
2. **A cross-list rule engine** run on every list change: ED/REA conflicts, one pending ED, Oxbridge exclusivity, the 4-medicine-choice cap, UCAS 5 choices, OUAC Group A/B, UC TAG campus eligibility.
3. **Integrity by design:** provable no-prose coaching with an exportable "coached, not written" log.
4. **Affordability first:** NPC routing, SAI literacy, contributor consent, special-circumstances workflow, the ED affordability check.
5. **One journey across the US, UK and Canada**, current for 2026–27: the UCAS 3-question statement (350–4,000 characters), OUAC Group A/B, Oxford's UAT-UK.
6. **An accountability loop matched to temperament:** weekly top 3, confirmed tasks, gentle mode for shy students, dashboards for organized ones.
7. **Student-controlled family digest in the parent's language**, with the same facts the student sees.
8. **Continuity plus human escalation:** history survives a counselor change, and cases beyond competence are referred to a human or an official office.

**Do not copy** (09-27 §7.2):
- personal chances and "safety" labels;
- AI essay writing or rewrite-style line edits;
- lead-generation "connect you to colleges" networks;
- outcome and testimonial marketing ("our students got into…");
- upsell-first flows and nagging review prompts.

## 2. What great human counselors do (turn into playbooks)

Sources: `docs/research/2026-10-03-part2-counselor-playbook.md` (primary), 09-27 §2 (what families praise, and the behaviours → agent design table), and the lower-trust 10-04 "What Great Counselors Do" (example dialogues only, subject to §0).

What families pay $5k–$10k for (09-27 §2, verbatim Trustpilot):
- **accountability** ("keeping her on track… a notorious procrastinator");
- **being known before writing** ("took the time to truly understand my interests… before diving into the writing process");
- **not writing for the student** ("never wrote anything for the student");
- **honest realism**, **well-being**, **parent reassurance** ("a system we had no knowledge of"), and **continuity** ("immediately switched the support to a much better fit").

Professional codes that match our product rules, verbatim from 09-27 §2:
- IECA III.A.ii: "shall not write application essays or any portion of an essay… to question, coach, and encourage";
- IECA III.D.ii: "neither guarantee placement nor outcomes";
- IECA VI.B: don't heighten anxiety;
- IECA I.A: refer out beyond competence;
- NACAC 2026 I.C.1.d: don't divulge status or aid without the student's express permission;
- NACAC I.A.1.e: "Promote ethical practices in relation to the use of artificial intelligence".

Map the topics to roles:

| Topic | Role | Use for |
|---|---|---|
| School list (fit, affordability, published admit rates) | Leo | balanced list without probabilities |
| Timeline and accountability | Kairos, Juno | weekly plan, check-ins, rule checks |
| Essay questioning technique | Wren | interview mode, story bank, "so what?" follow-ups, ≤ 3 anchored critiques |
| Activities and honors | Wren | the student's own lines; coach verbs and specifics by question, never by rewriting |
| Recommendations | Juno | tracker, brag-sheet interview, FERPA waiver explainer, thank-you reminder |
| Testing (test-optional and required) | Leo | per-school policy from evidence (Harvard requires; UC doesn't consider) |
| Aid, merit, appeals | Ana | NPC routing, SAI, contributor consent, special circumstances, ED affordability |
| Interviews | Sam | US alumni, Oxford "academic conversation" style, think-aloud practice; no scripts |
| ED/EA/REA/RD ethics | Juno | rule engine plus explanations |
| Waitlist and deferral | Juno, Wren | LOCI coaching (the student writes) |
| Shy, anxious, overwhelmed students | Kairos | temperament modes, small asks, distress routing |
| Parents, including non-English | Kairos | family digest (consented, same facts) |

## 3. Rules and institution facts (2026–27)

Sources:
- 09-27 §3, the job-to-be-done tables by stage for the US, UK and Canada, with cited rules;
- 09-27 §4, 40 golden-set seeds with correct behaviour, bad answers and sources;
- `docs/research/2026-10-03-part3-systems-rules.md` and `docs/research/2026-10-03-part3-us-institutions.md`.

Use them as **seed evidence for S3**. Every fact gets a URL, publisher, checked date, cycle and a quoted span. Anything marked (I) or NV must be re-fetched before it's published to students.

Time-sensitive as of 2026-10-04 (09-27 §0):
- **UCAS 15 Oct 2026, 18:00 UK** for Oxford, Cambridge and most medicine, dentistry and vet courses;
- the UAT-UK booking closed 28 Sep, and the tests run 12–16 Oct;
- UCAT 2026 booking is closed;
- the **2027–28 FAFSA is open**;
- UC filing runs 1 Oct–30 Nov;
- OUAC Group A deadline 15 Jan 2027; UBC 15 Jan 2027 (1 Dec for entrance scholarships).

## 4. Golden set (evals)

Sources:
- `docs/research/2026-10-03-part4-golden-set.md` and `docs/research/2026-10-03-golden-set.json` (120 cases);
- 09-27 §4 (40 seeds, including refusals: FSA ID credentials #4, write-my-essay #32, rewrite-this-paragraph #33, chances-percent #39, unknown future cycle #40).

Do **not** use the lower-trust file's golden set. Score behaviour, not wording. Run deterministic checks on every change; run model-graded checks only on a slice's final run, with a $5 cap.

## 5. Data sources and the evidence cache

Sources: 09-27 §5 (sources with automation flags) and §6 (the live-search design), plus Part 5.

- **Automated is fine:** College Scorecard API (key, under 1,000 requests per hour per IP), IPEDS bulk files, UCAS "Data and analysis" CSVs (CC BY 4.0), CUDO Ontario open data (verify the licence), Statistics Canada.
- **Curate by hand or get permission (scraping is prohibited or restricted):** Common App (terms ban bots, scraping and "service bureau" use), College Board / CSS Profile, UCAS web pages (robots prohibited), OUAC ("unauthorized third-party use… prohibited"), net price calculators (never submit family finances; link out).
- **Low-rate fetch is allowed** for allowlisted government and .edu public pages whose terms permit it.
- **Design (09-27 §6.2, binding for S3):**
  - The agent answers **only from the evidence cache**; it never searches live in a student turn.
  - On a cache miss, a refresh job runs a domain-allowlisted search (Exa or Firecrawl), fetches the official page, hashes it, extracts the claim into a strict JSON schema with a **verbatim quote**, validates deterministically (the quote is in the page text, dates parse, the cycle matches) and then publishes or quarantines.
  - Citations are rendered by the server from evidence IDs, so the model can't mint URLs.
  - About $0.011 per refreshed claim-page.
  - OpenRouter `:online` is for internal tools only, never for student-visible facts.

## 6. Voice: measured facts (2026-10-03/04)

Source: `docs/qa/2026-10-04-voice-language-validation.md`, plus Claude's latency experiments on 2026-10-04.

**Deepgram Voice Agent:**
- Browser auth is `new WebSocket(url, ["bearer", token])` with the token from `POST /v1/auth/grant`. This **requires a Member-role key**, and production now has one.
- Hosted think models accepted on 2026-10-04:
  - anthropic: `claude-haiku-4-5`, `claude-sonnet-4-5`;
  - open_ai: `gpt-4.1`, `gpt-4.1-mini`, `gpt-4o-mini`, `gpt-5`, `gpt-5-mini`;
  - google: `gemini-2.5-flash`.
- Set `agent.language`, or nova-3 hears non-English as silence (fixed for 7 languages).
- A ~24k-char prompt causes `PROMPT_TOO_LONG` truncation.
- Send `KeepAlive` or the session closes with `CLIENT_MESSAGE_TIMEOUT` (about 10 s).
- `AgentStartedSpeaking` carries `total_latency`, `tts_latency` and `ttt_latency`.
- nova-3 rejects `ml` and `od`.

**Latency.** Measured from end of user speech to first agent audio, two-turn conversations:

| Prompt / model / endpointing | en | es | ja |
|---|---|---|---|
| Production ~24k chars, Haiku, 300 ms | 1.42 / 1.42 s | 2.45 / 0.89 s | 2.28 / 3.17 s |
| Short role prompt, Haiku, 300 ms | 1.09 / 1.08 s | 1.28 / 0.63 s | 3.03 / 1.65 s |
| Short role prompt, gpt-4.1-mini, 300 ms | 0.86 / 0.99 s | 0.95 / 0.98 s | 2.27 / 1.37 s |
| Short role prompt, Haiku, 150 ms | 0.89 / 0.95 s | 1.25 / 0.94 s | 2.11 / 1.83 s |

Conclusions:
1. Prompt size is the biggest lever. Short prompts also cut replies from 20–36 s to 7–13 s.
2. gpt-4.1-mini is slightly faster to first audio.
3. Endpointing at 150 ms helps a little but risks cutting students off.
4. ja needs its own tuning.
5. "Start with a 2–4 word reaction" lowers time to first audio.

**Sarvam (Indic):**
- STT 0.5–1.6 s; TTS ~0.8 s for 4–5 words and 2–3.5 s for 15–25 words, non-streaming.
- The route accepts only hi and pa.
- The proxy LLM mixed scripts in Tamil and Odia, so add a script filter.
- Get native review before marketing any Indic language.

**"Not mechanical" checklist:**
- vary reactions;
- translate domain terms into the student's language;
- end with one specific question;
- use the student's own words;
- ≤ 35 words.

## 7. Business notes for the founder (do not build without approval)

- **School and district licensing:** Kaplan reportedly licenses KapAdvisor to high schools at $3.5k–5k/yr (lower-trust source, unverified). The counselor workspace plus the work queue (S7) is the base for a school tier. A FERPA "school official" agreement is needed (09-27 §8).
- **Employer benefit channel:** College Coach is sold as an employer benefit. A family plan through HR benefits fits the $99/yr price.
- **Independent counselors as partners:** independents charge about $140/hr and have limited hours. The agency workspace lets one counselor serve more students, with Kairos doing the accountability between sessions.
- **Positioning line backed by sources:** "Built on the same rules professional counselors follow: never writes your essay, never guarantees outcomes, never shares your status without permission" (IECA, NACAC). **Never imply membership or endorsement.**

## 8. Existing internal designs and audits to reuse

| Doc | Use |
|---|---|
| `docs/strategy/2026-10-03-agentic-counselor-gap-analysis.md` §3–§4 | target architecture (tool registry, planner loop, memory, triggers, evidence cache, evals, cost) |
| `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` | binding agent contracts: preview → confirm → commit, citations from evidence IDs, an unknown state, §8 freshness thresholds |
| `docs/evidence/agent/rulings-a1-s1.md` | binding rulings and deferred items |
| `docs/design/2026-10-03-amendment-c-step-clarity.md` | rules C1–C11 and their acceptance checks |
| `docs/design/2026-10-03-landing-audit.md` | signed-out site audit, SEO and canonical issues |
| `docs/qa/2026-10-03-student-workflows.md`, `…counselor-workflows.md` | ranked UX fixes |
| `docs/handoff/codex-prompts/session-b-d4-3-d4-8-agent-surface-and-marketing.md` | agent UI states (proposal card, inbox, memory, nudges, integrity moment) |
