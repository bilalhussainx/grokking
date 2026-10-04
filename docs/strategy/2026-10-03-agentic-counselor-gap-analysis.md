# Coach Kairos: how far it is from an agentic admissions counselor

_Staff AI engineering assessment, 2026-10-03. This is a read-only review. Code was read at `C:\Users\bilal\Downloads\grokking-integrate` at HEAD `7c58b6c`, which is live. The working tree has four uncommitted edits by another agent; none is in a Coach file. I also ran one live probe of 4 Coach messages on the QA student. Evidence is in `scratchpad/oct03/agentic-gap/`._

## Bottom line

**Coach Kairos is a context-stuffed chatbot. Its agency level is L1.**

- Before every turn the server reads about 15 tables and pastes the results into a large system prompt.
- It has no tools it can call, and it cannot look anything up.
- It has one hidden write path. When the model's reply text contains an `<<actions>>` block, the server adds those schools. Separately, after every turn, background LLM extractors silently rewrite the student's profile, academics, preferences and activity list.
- None of these writes is shown as a proposal for the student to confirm. That is the opposite of the consent model that D2 and the CTO memo require.
- The parts a proactive agent needs already exist (Vercel cron, deadline emails, "Coach noticed" observations, `cc_tasks`, ICS export, and deterministic engines for ED/REA conflicts, net price, GPA conversion, UK tests and Canada platforms). But none of them is connected to the Coach.

**The design work is done; nothing is built.** The D2 spec is thorough and correct in direction. None of it exists in code yet: no `cc_agent_*`, `cc_public_evidence` or `cc_kb_*` tables, and no tool registry. The plans for slices a1, a2 and b run to 100–180 KB each, and slices a1 and a2 are internal-only harnesses.

**My recommendation:**

- Keep D2's contracts: server-derived scope, preview → confirm → commit, and citations that come only from evidence IDs.
- Ship a thinner student-visible slice first. It should touch no essays: a proposals inbox plus 3 deterministic triggers. That gives visible agency in about 2 weeks, while the semantic no-prose checker (slice b) is built for the essay surfaces.

---

## 1. Today, honestly

### 1.1 What path a message takes

| Piece | Where | Notes |
|---|---|---|
| Live text route | `src/app/api/cc/coach/message/route.ts` | Called by `src/contexts/CoachKairosContext.tsx:297`. Streams SSE. |
| Legacy route (appears unused) | `src/app/api/cc/coach/route.ts` | Has a `gpt-4o-mini` classifier (`:13`) and deducts credits (`:52`). No client caller found by grep. It is dead weight. |
| Voice | `src/app/api/ai/voice-session/route.ts:29-31,342` runs a Deepgram agent with OpenRouter **Haiku 4.5** for the coach. `src/app/api/cc/coach/voice-prompt/route.ts:160` reuses the same `buildSystemPrompt`. | Turns are persisted and extracted afterwards through `coach/voice-turn` (`:123`). |
| Family mode | `src/app/api/cc/coach/family-mode/message/route.ts` | A separate prompt; out of scope here. |
| LLM | `src/lib/cc/openrouter.ts:23`: `anthropic/claude-sonnet-4-6`, `max_tokens` 1024, temperature 0.7 | Silent fallback to Moonshot `kimi-k2-0711-preview` (`:95`) and then Gemini 2.0 Flash (`:118`). These fallbacks are unevaluated, and D2 §9.1 forbids them. |
| Credits | **No credit is deducted** on the live route. The gate is a message count: `assertCapacity(... "coachMessagesPerDay")` (`message/route.ts:79-87`). | Free tier: **200 messages/day** (`src/lib/cc/tier-gate.ts:79`). Pro: 300/day (`src/lib/pricing.ts:10`). Guest: 20. There is no dollar ceiling. |

### 1.2 Inputs and context assembly

Each turn runs about 15 sequential Supabase reads (`message/route.ts:59-329`). Some of them are N+1 loops (`:251-274`, `:293-301`). The reads cover:

- profile;
- academics;
- preferences;
- school bands;
- essay phases and reviews;
- the focus essay with its school mission and acceptance rate;
- supplements by school;
- top-3 activities;
- school-list names;
- whether an interview has happened.

All of this is rendered as text in `buildSystemPrompt` (`src/lib/cc/coach-prompt-builder.ts:257-318`), together with:

- **Mode routing by regex** (`src/lib/cc/coach-mode-detector.ts:22-63`).
  - **Bug, confirmed live:** any student without a GPA is forced into `academic` mode on every turn (`:61`), so the Coach hijacks unrelated questions with "what's your GPA?". In my probe this happened on 3 of the 4 answers.
- **Hard-coded "facts" in the prompt, several of them wrong today.** Each one is checked against the 2026-09-27 research:
  - UCAS fee "£28.50" (`:462`). Research: £34.50 for 2027.
  - Main UCAS date "January 14, 2027" (`:463`). Research: 13 Jan 2027, 18:00 UK.
  - OUAC "101 … 105" (`:442`). Retired; it is now Group A/B. Note that `src/lib/cc/canada/application-platforms.ts:7` was already updated.
  - McGill is listed under OUAC and under uApply in the same line (`:442`).
  - Fixed need-blind lists (`:546-548`).
  - "booking closes 28 Sep 2026" (`:466`), a date that has already passed.
- **Country gating.** The UK and Canada blocks fire only for `country` UK, CA or PK (`:436`, `:456`). A US student asking about UCAS gets nothing grounded.
- **History:** the last 20 turns, across all topics and sessions (`message/route.ts:387-396`).

### 1.3 Tools or actions

**No tool calling.** The model cannot read anything beyond what was pre-stuffed into the prompt.

**One action channel: a fenced `<<actions>>{"add_schools":[…]}` block.**

- The prompt asks for it (`coach-prompt-builder.ts:130-164`) and a lenient parser reads it (`src/lib/cc/coach-actions-block.ts:44-102`).
- The choice of a fenced block over tool-calling is explicit (`:22-25`).
- Whether the student "approved" is judged by the model reading the chat. There is no confirm UI.
- The UI only shows a 4-second "Added N schools" toast (`src/components/cc/coach/CoachChat.tsx:59-81`).

**Silent background writes after every turn** (`src/lib/cc/coach-extract.ts:14-64`). Each is another Sonnet call over the last 50 messages:

- `extractIntake` sets `intake_completed_at` and identity fields (`:66-98`).
- `extractAcademic` writes GPA and test scores (`:100-171`).
- `extractSchoolPreferences` writes affordability (`:173-239`).
- `extractAndSaveSchools` falls back to inferring "approved" schools from the transcript (`:334-374`).
- **`extractActivities` inserts activity descriptions that the LLM composed in "Common App rubric style"** (`:524-644`). That is AI-written application text, saved without the student seeing it.
- Schools the Coach adds get **no deadline seeding** (`:460-465`). Compare `school-list/add/route.ts:47`.

**Quick-action chips** are regex matches on the reply text that produce nav links (`src/components/cc/coach/CoachMessage.tsx:51-58`). They are navigation, not actions.

**Live probe (2026-10-03):** "Remind me next Monday…" got the reply **"Reminders aren't something I can set — that's outside what I can do for you right now."** That is true, even though `cc_tasks` (`supabase/migrations/20260417_coach_kairos_schema.sql:187`) and an ICS export (`src/app/api/cc/applications/ical/route.ts`) both exist.

### 1.4 Memory across sessions

- **Raw history only:** 20 turns go to the model and 50 are shown in the UI (`coach/history/route.ts:24-29`). There is no summary, no fact store, no provenance and no per-student coaching profile.
- **"Memory" is really the silent extraction into profile tables (§1.3).** It is unversioned, last-write-wins, and the student cannot see what was inferred, why, or from which message.
- **Interviews have a memory stack the Coach doesn't use.** `src/lib/agent-memory-store.ts`, `memory.ts`, `fact-extractor.ts` and `knowledge-graph.ts` are imported only by interview routes. `src/lib/embeddings.ts` has no importer.
- Counselor-private `cc_student_memory`, `cc_student_journal` and `cc_student_coach_prompts` exist and must stay separate (D2 §1, §6.1).

### 1.5 Does it act unprompted?

**Not as an agent.**

- The only "proactive" behaviour is client-side. On `/`, with empty history, the client sends a synthetic `"hi"` (`CoachKairosContext.tsx:171-187,221-223`). That spends one message from the cap and one LLM call.
- **There is system-level proactivity outside the Coach,** which is reusable:
  - The `deadline-reminders` cron (`vercel.json`; `src/app/api/cron/deadline-reminders/route.ts:19,100`) emails at T-14/7/3/1 with a dedupe log. **It has no opt-out check.** Its dates come from a **20-school JSON with 2025–26 dates** (`src/data/school-deadlines-2026.json`, e.g. MIT EA `2025-11-01`) that has no source URL or checked date.
  - The `generate-observations` cron is a Sonnet "Coach noticed" one-liner per dashboard module. It has hash-skip caching and only runs for active users (`src/app/api/cron/generate-observations/route.ts:1-60,246`). This is the right cost pattern to copy.

### 1.6 Grounding and citations

- **None.** No evidence table, no source rendering, no "last checked" date.
- **Partial data provenance exists in one place:** `cc_school_supplements.source_url` (`supabase/migrations/20260426_feature_4_supplements.sql:20`).
- **Deadline data has three inconsistent sources, all unsourced:**
  - the JSON (20 schools, last cycle);
  - `cc_schools.regular_deadline`/`early_deadline` text, whose year is guessed by rolling forward (`src/app/api/cc/timeline/generate/route.ts:4-20`);
  - the hard-coded prompt text.
- **Live probe:** the model was honest. It declined to quote UCAS facts, and for MIT EA it said "historically November 1 … can't give you a sourced, confirmed date". The honesty is good, but it means the Coach **cannot answer the most basic counselor question with authority**.

### 1.7 Evaluation

- **No golden set, eval harness or LLM regression of any kind.**
- **Unit tests check strings only:** about 40 prompt-builder tests, 10 parser tests and 8 mode-detector tests (`src/lib/cc/__tests__/coach-*.test.ts`). No e2e test sends a Coach message, apart from the shell spec `tests/e2e/d4-2-shell.spec.ts`.
- **Integrity enforcement is prompt-only.** "Don't write the essay for them" is one line (`coach-prompt-builder.ts:641`). `src/lib/cc/essay-guardrail.ts:14-35` is effectively a no-op: it blocks only replies under 3 words.
- **Live probe:** asked to "write the opening 3 sentences…", the Coach deflected to Essay Studio and didn't write prose. That is one sample, not a gate.

### 1.8 Agency score

**L1 (context-aware).** Not L2: the model can't call a read tool. Not L3: it never proposes an action for the student to confirm. And it **does** perform writes with no confirmation (adding schools, extraction), which an L3+ design must remove, not build on. The L5 plumbing (cron, email, observations) exists but isn't the Coach.

### 1.9 Security note found in passing (Major)

- `POST /api/cc/coach/extract` (`src/app/api/cc/coach/extract/route.ts:4-10`) has **no authentication and takes an arbitrary `student_id`**.
- `/api/cc/coach/` is guest-accessible in middleware (`src/middleware.ts:68-69`).
- So anyone with a session can trigger admin-client extraction (paid Sonnet calls, plus writes into that student's profile and activities) for any student UUID.
- It is not exploited, and the UUIDs are hard to guess. Fix it before any agent work: delete the route or bind it to the session.

---

## 2. Gap table

| Capability the agent needs | Exists today | Missing | Effort |
|---|---|---|---|
| Read tools over deterministic engines | Engines: `applications/ed-strategy.ts` (`checkREAConflict`, `schoolAcceptsPlan`), `cc/net-price.ts`, `cc/gpa-converter.ts`, `canada/grade-conversion.ts`, `canada/application-platforms.ts`, `uk/admissions-tests.ts`, `uk/scholarships.ts`, `applications/deadlines.ts`, `profile-completion.ts`, `dashboard/variants.ts selectVariant`, `daybreak/index.ts` | A typed registry with zod schemas, server `AuthScope`, and a `status/unknown` result contract (D2 §4). Wrappers are thin. | M (registry) + S per tool |
| Write proposals the student confirms | `cc_tasks`, `cc_student_schools`, ICS export, profile edit routes | A `cc_agent_proposals` table, confirm/decline endpoint, payload-hash token, expiry, undo. Remove the `<<actions>>` path and silent extraction writes. | M |
| Planner loop | None (single streamed completion) | A bounded tool loop (≤4 model calls, ≤8 tools, 60 s) with native tool calling and output buffering until validators pass | M |
| Per-student memory | Raw last 20 turns; silent profile writes | `cc_student_facts` (proposed/confirmed, with source message); a rolling summary; `cc_coach_profile` (style, cadence, avoid-list); a student-facing memory view with edit/delete | M–L |
| Proactive trigger engine | Two crons, Resend email, dedupe log, observations hash-skip | Deterministic triggers (verified deadline proximity, stall, missing requirement, plan conflict, evidence changed) → `cc_agent_nudges` → in-app Coach inbox; opt-in email; quiet hours; per-student cadence | M |
| Evidence cache with citations | `cc_school_supplements.source_url` only | `cc_public_evidence` (claim, value, verbatim quote, URL, publisher, fetched_at, hash, cycle, status, valid_until); server-rendered citations; staff curation UI; freshness rules | L |
| `web_lookup` (GLM 5.3 Flash) | None | Allowlisted refresh job: Exa/Firecrawl, fetch, Flash extracts a quote, deterministic validation, then publish or quarantine. **Never** College Board, Common App, UCAS web or OUAC. | M (after the cache) |
| RAG knowledge base (rules + playbook) | `embeddings.ts` exists but is unused; pgvector is available | `cc_kb_documents/chunks`, hybrid FTS + vector search, staff review | L (mostly content) |
| Deterministic workflows (recipes) | Engines (above); timeline generator | A named, versioned workflow registry ("add school + pull requirements", "this week's plan", "what my family pays") | M |
| Cross-list rule engine | `checkREAConflict` only | One-ED, Oxbridge exclusivity, 5 UCAS choices / 4 medicine, OUAC Group A/B, UC TAG campuses | S–M (rules) once Part 3 lands |
| US/UK/Canada coverage | Prompt blocks gated by country (and partly wrong); 12 UK + 12 CA schools in catalog | Per-student system detection from the school list, not home country; evidence rows per system | M |
| Golden-set eval harness | None | Fixtures, deterministic assertions, a judge from a different model family, budget-approved runs, CI gate | M (harness) + L (content) |
| No-prose enforcement | One prompt line; no-op guardrail; extraction composes activity text | Output validator, then D2 §7 semantic checker (slice b); never generate activity prose without confirmation | M–L |
| Model routing + cost control | Sonnet 4.6 for everything, including ~1–3 extraction calls per turn | GLM 5.3 Flash routine → GLM 5.3 planner → Sonnet escalation; prompt caching; per-user daily **dollar** ledger; drop per-turn extraction | S–M |
| Activity log ("what I did and why") | Console logs only | A `cc_agent_events` row per tool call, proposal, commit and nudge, shown to the student | S |
| Counselor in the loop | Agency membership, counselor-private notes | A `prepare_counselor_briefing` digest; counselor visibility of proposals and nudges | M |
| Hygiene | n/a | Fix the `/extract` auth; the mode-detector GPA hijack; wrong UCAS/OUAC facts; deadline seeding on Coach adds; reminder opt-out; delete the legacy `/api/cc/coach` route | S |

---

## 3. Target architecture (minimal and concrete)

```
Coach UI ──POST /api/cc/agent/turn──▶ Gate (session → AuthScope, caps, $ budget)
                                        │
                     JourneyState (deterministic: selectVariant + records + evidence)
                                        │
                     Bounded loop (Flash; ≤4 model calls, ≤8 tools, 60s)
                        │ read tools ─▶ engines + owned records + cc_public_evidence
                        │ write tools ─▶ cc_agent_proposals (pending only)
                                        │
                     Validators: every date/amount/rule in the text must map to a
                     tool-result evidence ID → otherwise rewrite as "unknown"
                                        │
                     Persist turn + cc_agent_events ──▶ stream checked text + cards
Student taps Confirm ─▶ POST /api/cc/agent/proposals/:id/confirm ─▶ domain adapter commit
Cron (daily) ─▶ Trigger engine ─▶ cc_agent_nudges ─▶ Coach inbox (+opt-in email)
Refresh job ─▶ allowlisted fetch ─▶ Flash quote extraction ─▶ validate ─▶ evidence (draft→published)
```

### 3.1 Tool registry

Each tool is a typed module with a zod input/output schema and a server-supplied `AuthScope`. The model never supplies a student ID. Results are `ok | partial | unknown | denied` with `evidenceRefs`.

**Read tools (v1).** These are thin wrappers over code that already exists:

| Tool | Backed by |
|---|---|
| `get_journey_state` | `selectVariant`, `profile-completion`, `cc_tasks`, essay phases; returns ≤3 next actions in deterministic order (D2 §5 buckets) |
| `list_my_schools` | `cc_student_schools` + plan + deadlines **with evidence status**; returns unknown when unverified |
| `check_plan_conflicts` | `ed-strategy.checkREAConflict` + one-ED + (Phase 2) Oxbridge/UCAS caps |
| `estimate_net_price` | `net-price.estimateNetPricesForList` (labelled as an estimate, with its catalog year) |
| `convert_grades` | `gpa-converter`, `canada/grade-conversion` |
| `get_requirements` | `cc_school_supplements` (with `source_url`), `uk/admissions-tests`, `canada/application-platforms` |
| `get_essay_status` | Phase, word count, review priorities; read-only, never draft text to rewrite |
| `lookup_evidence` | `cc_public_evidence` (Phase 2) |
| `search_kb` | (Phase 3) |

**Write tools.** These only create proposals:

- `propose_task` (writes to `cc_tasks`)
- `propose_calendar_hold` (an ICS event now; a Google Calendar connection later, behind its own consent)
- `propose_add_schools`
- `propose_application_plan` (EA/ED/RD selection)
- `propose_fact_change` (allowed profile fields only)

Every write is preview → student confirm → commit:

- The token is bound to user, payload hash and version, with a 10-minute expiry.
- The commit is idempotent.
- Reversible commits offer Undo.

**Never exposed:** arbitrary SQL, arbitrary URLs, email, contacting colleges or recommenders, submitting anything, or any prose-writing tool.

### 3.2 Planner loop

- Use native OpenRouter tool calling on the routine model. GLM 5.3 Flash is listed at about $0.045/M input and $0.14/M output with tools and JSON-schema support (research §6.1). Treat that listing as unproven until the D2 compatibility probe runs.
- Escalate to GLM 5.3 or Sonnet only for:
  - multi-tool plans;
  - conflicting records;
  - essay judgment.
- Escalate at most once.
- Buffer the text until validators pass. For non-essay turns those are deterministic:
  - every date, amount or rule in the text must match a tool result;
  - otherwise it is stripped and replaced with "unknown — I can check".
- Essay-intent turns stay on today's path, or get a fixed coach-don't-write response, until slice b's semantic checker exists.

### 3.3 Per-student memory model

Use three layers. None of them is a vector store yet.

1. **Authoritative records.** These are the existing tables, read through tools on every turn rather than trusted from chat.
2. **`cc_student_facts`.** Each fact has a field, value, state (`proposed/confirmed/disputed/superseded/deleted`), source message ID, timestamp and the original-language span. Extraction becomes `propose_fact_change` cards. GPA, citizenship and finances are **never** written without confirmation.
3. **`cc_coach_profile` plus a rolling summary.**
   - The profile holds style (gentle or direct), check-in cadence, nudge channels, quiet hours, language and topics to avoid.
   - The summary is regenerated by Flash every ~20 turns. It is an index to fact IDs, not a source of claims.

Retrieval per turn: the profile, confirmed facts relevant to the intent, the summary, and the last 8–12 turns.

### 3.4 Proactive trigger engine

Extend the existing `deadline-reminders` cron into a daily trigger pass. It is deterministic SQL and TypeScript; there is no LLM in the decision.

| Trigger | Rule (example) | Data available today? |
|---|---|---|
| Verified deadline proximity | An evidence-backed deadline at T-21/14/7/3 with incomplete components | Plumbing yes; **verified dates no** |
| Plan conflict | `checkREAConflict` or one-ED violation on the list | Yes (US subset) |
| Essay stall | A reviewed essay unchanged for ≥10 days while a deadline-bearing school is on the list | Yes |
| Missing requirement | A school on the list has supplements in `cc_school_supplements` but no started essay within 21 days of its deadline | Partly (deadlines unverified) |
| Inactivity | No login for 14 days during the student's active season | Yes |
| Evidence changed | A deadline the student relies on was revised in `cc_public_evidence` | Phase 2 |

- Output is `cc_agent_nudges`, deduped by (student, trigger, entity, offset).
- The Coach inbox opens with the nudge plus proposals.
- An optional Flash one-liner is hash-cached, like the observations cron.
- Email is **opt-in**, respects quiet hours, and is capped at 1 per day.

### 3.5 Evidence cache with citations

`cc_public_evidence` holds, per entity, program, cycle and field:

- value
- verbatim quote
- canonical URL and publisher
- fetched_at and content hash
- status (`draft/published/quarantined`)
- valid_until

Seeding has three sources:

- **Human-curated rows.** These cover Common App, UCAS, OUAC and College Board facts, entered with a link and a short attributed extract. The research Part 3 output is the natural seed.
- **Open datasets:** College Scorecard and IPEDS (CC-BY or public).
- **Allowlisted refreshes** of `.edu`/`.gov`/university pages through the `web_lookup` job (research §6.2: about $0.011 per refreshed claim).

Citations are rendered by the server from evidence IDs; the model can't mint URLs. Freshness follows D2 §8.1: a 24-hour check inside 30 days of the date, 7 days otherwise. A failed fetch never advances `checked_at`.

### 3.6 Golden-set eval harness

- **Fixtures:** `{question, student_fixture, expected_behavior, must_abstain_if, required_evidence_ids, forbidden_patterns, task_family}`. Start with the 40 seeds in research §4, grow to 120 with Part 4, then 300.
- **Scoring order:**
  1. Deterministic first: the right tools were called; no date or amount without evidence; no forbidden actions; refusal cases refused.
  2. Then an LLM judge from a **different model family** from the generator, for usefulness.
- **When it runs:**
  - on any change to prompts, tools, models or the knowledge base;
  - nightly on the routine model.
- **Budget:** each paid run is estimated and approved first (CTO memo §2). A 40-case run on Flash costs cents; the judge dominates the cost.

### 3.7 Cost control

1. **Cut per-turn extraction (quick win).** Today each turn makes 1 Sonnet stream plus 1–3 Sonnet extraction calls over 50 messages. Replace them with proposal cards emitted by the loop.
2. **Route.** The routine model is Flash: about $0.0004 for an 8k/500 turn, against about $0.03 on Sonnet (D2 §9.1 price snapshot). Sonnet is for escalation only.
3. **Cache.**
   - Put the static system prefix first so provider prompt caching can apply. Verify per provider.
   - Keep the evidence cache shared across students.
   - Hash-skip nudge text.
4. **Cap by dollars as well as messages.** Add a per-user daily provider-spend ledger, e.g. free about $0.05/day and Pro about $0.30/day (founder to set), checked before each call. Keep `coachMessagesPerDay` as is, with a tool-loop turn counting as 1 message.
   - Worst case today, assuming about $0.04–0.08 per turn: a free user at 200 messages/day costs $8–16/day. That is unbounded relative to price.
5. Add a **kill switch per model, capability and language** (D2 §11.3).

---

## 4. What "agentic" looks like to a student

1. **The ED crunch (L5 → L3).**
   - *Scenario:* it's Oct 20 and the student has MIT EA, Georgetown EA and Duke ED on Nov 1. Before they type anything, Coach opens with: "Three applications are due Nov 1 — 12 days. Here's a 3-step plan: (1) finish Duke 'Why Duke' this week, (2) request your counselor's school report by Oct 25, (3) submit MIT first, by Oct 29." It offers to add three calendar holds and three tasks; the student taps Confirm all. Each date shows "Source: duke.edu, checked Oct 19".
   - **Possible on current data? No.** The pieces exist: the cron, `cc_tasks`, ICS, the `application_plan` field. But the deadline data is the 2025–26 JSON, with no source.
   - **Unblocks with:** Part 3 or curated evidence for the pilot students' schools.
2. **Plan conflict caught (L5 → L3).**
   - *Scenario:* the student sets Harvard to REA and Northwestern to EA. Next visit, Coach says: "Harvard's REA doesn't allow EA at another private school. Want me to switch Northwestern to RD?" It shows a citation and **Switch / Keep and remind me later** buttons.
   - **Possible now** for the US REA/ED subset, using `checkREAConflict`. The citation still needs one curated evidence row per REA school.
3. **The stalled essay (L5, no prose).**
   - *Scenario:* the personal statement was reviewed 12 days ago and hasn't changed. Coach writes: "Your review's top note was that ¶2 tells instead of shows. Want a 20-minute slot Thursday to work on it? I'll ask you three questions about that day at the shop." The student confirms a task. Coach never writes a sentence.
   - **Possible on current data:** `cc_essays.updated_at`, `revision_comments` and `cc_tasks` all exist.
4. **Agent-first "add Michigan" (L2 → L3).**
   - *Scenario:* the student types "add Michigan and tell me what I need." Coach shows a proposal card ("Add University of Michigan as Target?"). After Confirm it lists Michigan's supplements, each with its `source_url`, and a net-price estimate labelled as an estimate with its catalog year. It offers tasks for each supplement. The deadline shows as "Not yet verified for this cycle — I'll check" until an evidence row exists.
   - **Mostly possible now:** the catalog, supplements, net-price engine and `cc_tasks` all exist. Only the deadline is missing.
5. **Memory you control (L3).**
   - *Scenario:* a month later Coach says: "Last month you told me your family can spend under $10k a year, so I've kept full-need schools first. Still right?" The student opens **What Kairos remembers**, edits it to "$10–20k" and deletes a story they no longer want used. The change is confirmed, logged, and later answers follow it.
   - **Partly possible:** `affordability_value` is stored. Facts with provenance, the memory page and delete need Phase 2.

---

## 5. Phased path

**Phase 0: hygiene (2–3 days, before any agent work).**

- [ ] Secure or delete `/api/cc/coach/extract`.
- [ ] Fix the GPA hijack (`coach-mode-detector.ts:61`).
- [ ] Remove or correct the hard-coded UCAS fee and date and the OUAC 101/105 text. Facts belong in evidence, not prompt text.
- [ ] Stop `extractActivities` from saving AI-composed descriptions without confirmation.
- [ ] Add an opt-out check to the reminder emails.
- [ ] Label the JSON deadlines "last cycle, unverified" wherever they are shown.
- [ ] Delete the legacy `/api/cc/coach` route.

**Phase 1: the thin slice that delivers visible agency (about 1–2 weeks).**

- **Route and loop:**
  - `/api/cc/agent/turn` behind a feature flag, with a bounded loop and native tool calling.
  - GLM 5.3 Flash as routine, with Sonnet as escalation and baseline. Run the D2 compatibility probe (<$0.05) first.
- **Tools:**
  - Read: `get_journey_state`, `list_my_schools`, `check_plan_conflicts`, `get_requirements`, `get_essay_status`.
  - Write: `propose_task` and `propose_calendar_hold`, with confirm cards.
  - Port `propose_add_schools`, then **turn off** the `<<actions>>` parser for flagged users (one writer only).
- **Triggers:** plan conflict, essay stall, inactivity, all in-app only. Add the deadline trigger **only for evidence rows that staff have hand-curated** for pilot students' schools.
- **Logging:** `cc_agent_events` plus a student-visible activity log.
- **Eval:** a 40-case golden-set harness with deterministic checks only, run on the flag before widening.
- **Scope:**
  - Essay-intent turns stay on the current path, which is no worse than today. Slice b's checker gates moving them.
  - This keeps D2's contracts while reordering its slices. **The founder must approve the reorder over D2's a1 → a2 → b, which is internal-only.**

**Phase 2: grounding and memory (about 3–5 weeks).**

- `cc_public_evidence` with citations and freshness, plus a staff curation screen.
- The `web_lookup` refresh job (allowlisted; Firecrawl or Exa behind an adapter).
- `cc_student_facts` and `cc_coach_profile`, the "What Kairos remembers" page, and the switch from extraction to proposals.
- A per-user dollar ledger and prompt caching.
- Opt-in email nudges.
- Counselor briefings for agency-linked students (the Ad Astra pilot).
- A golden set of 120 cases with a judge from another model family.

**Phase 3: depth (after Phase 2 gates pass).**

- The knowledge base (rules plus counselor playbook) with hybrid retrieval.
- A workflow registry: "what my family pays", "scholarships I qualify for", "interview prep for X".
- The full cross-list rule engine: UCAS caps, Oxbridge, OUAC Group A/B, UC TAG.
- D2 slice b's semantic no-prose checker, then moving Essay Studio and Coach essay turns onto the agent path.
- L4 standing instructions, for example "always hold time 5 days before any deadline I confirm", revocable in settings.
- Multilingual gates.
- A 300-case golden set and a public pass rate.

**Decisions that wait for research Parts 2–5 (pending):**

| Decision | Depends on |
|---|---|
| Nudge tone and cadence defaults; coaching-style profiles (shy vs. organized); content of the playbook layer in the knowledge base | **Part 2** (counselor practice) |
| Which schools and systems get verified deadline coverage in Phase 1/2; UK/Canada rule set; cross-list rules beyond REA/one-ED; whether the deadline trigger ships in Phase 1 with real data | **Part 3** (official 2026–27 rules) |
| Golden-set content beyond the 40 seeds; release-gate thresholds per task family | **Part 4** (120 problems) |
| The `web_lookup` allowlist; which sources may be auto-refreshed vs. curated by hand; Scorecard/IPEDS ingestion; Exa vs. Firecrawl | **Part 5** (data sources and terms) |
| Model choice: GLM Flash vs. alternatives | D2 compatibility probe + Part 4 eval, not research |

---

## 6. Risks and mitigations

| Risk | Where it shows today | Mitigation |
|---|---|---|
| **Hallucinated or stale deadlines** | 2025–26 JSON with no source; wrong UCAS fee and date in the prompt; year guessed in `timeline/generate` | Dates only from `cc_public_evidence` with quote, URL and checked_at. Validators strip any date not tied to an evidence ID. Show "unknown / last cycle" labels, never a countdown on unverified dates. Golden-set abstain cases (#14, #40). |
| **Integrity (AI-written application content)** | Silent AI-composed activity descriptions; prompt-only essay rule; no-op guardrail | Proposals only, with the student confirming every change. No prose tools. Essay turns gated by slice b's checker. An authorship-probe suite in the golden set. A "coached, not written" log the student can export. |
| **Privacy and minors** | Extraction writes inferred citizenship-adjacent and financial fields; reminder email without opt-out; unauthenticated `/extract` | Facts are proposed, then confirmed. Sensitive fields need explicit confirmation. Memory view with delete and purge. Never send a minor's identifiers to search providers (fixed query templates). Age gate (COPPA <13). Opt-in email, quiet hours. Counselor-private data kept out of student prompts (D2 §6.1). Legal review before school contracts. |
| **Cost blowups** | Sonnet for every turn plus 1–3 extraction calls; 200/300 messages a day; no dollar cap | Flash routing, a per-user daily dollar ledger checked before each call, a bounded loop (≤4 model calls), shared evidence cache, hash-skip nudges, a kill switch, daily cost report including failed calls. |
| **Terms-of-use breaches** | None yet (there is no fetching) | A hard allowlist in config, not chosen by the model. College Board, Common App, UCAS web and OUAC are curated by hand or used with permission. Never log into portals or store credentials; redact pasted credentials. Respect robots and rate limits. |
| **Over-promising admission** | The prompt asks the model to label bands "based on the student's stats" (`coach-prompt-builder.ts:150`) | Bands come from published admit rates with year and source, plus "can't predict individuals". No probabilities. Golden-set case #39. |
| **Proactivity that becomes nagging or anxiety** | n/a | Max 1 nudge a day, student-set cadence, snooze, and an "I'm overwhelmed" mode that reduces asks (IECA VI.B). |
| **Two writers for one action** | `<<actions>>` plus extraction plus the future agent | Per-user flag; the agent path disables the legacy parser and extraction (D2 §4, last paragraph). |

---

## 7. UI implications for the Coach surface (Astra, D4.3)

The design must show:

1. **Proposed-action cards.**
   - Each card shows a title, what will change (a diff: "Northwestern: EA → RD"), why, its source chips, and **Confirm / Edit / Decline**.
   - Bulk "Confirm all" appears only for homogeneous low-risk items such as tasks.
   - After commit the card shows "Saved", with **Undo** for 10 minutes.
   - It must never show "Saved" before the commit is durable.
2. **An "What I did and why" activity log.**
   - A chronological feed of tool reads ("Checked your school list"), proposals, commits, declines and nudges, each with its reason code.
   - Reachable from the Coach header and the dashboard.
   - Exportable, which also serves as the integrity record.
3. **Citations.**
   - Inline source chips on every fact: publisher, "checked Oct 19", and a link.
   - An explicit **Unknown / Not yet verified for 2026–27** state, styled as information, not an error.
   - A "Check again" action that requests a refresh.
4. **Memory controls: "What Kairos remembers about you".**
   - Grouped facts: academics, money, preferences, stories, coaching style.
   - Each shows where it came from (a message link and date) and its state (confirmed or suggested).
   - Edit, delete, and "don't use this"; plus "Forget everything" with a confirmation step.
   - Suggested facts appear as cards waiting for confirmation.
5. **Nudge settings.**
   - Channel (in-app, email), cadence (daily, weekly, deadlines only), quiet hours, and coaching style (gentle or direct).
   - Snooze per nudge, and a global "pause nudges for a week".
   - For agency-linked students, a line showing what their counselor can see.
6. **The Coach inbox (the proactive entry).**
   - On open, show agent-initiated messages as a pinned "Kairos noticed" thread with its proposals, kept separate from chat. The student can tell what Kairos started from what they asked.
7. **Running and limits states.**
   - Fixed progress labels ("Checking your deadlines…", "Reading sources…").
   - A visible daily budget when it is near the limit.
   - A fixed integrity message when an essay-writing request is declined, with the "let's do 3 questions instead" alternative.
8. **Phone.**
   - Cards stack full-width.
   - Confirm and Decline are thumb-reachable (≥44 px).
   - Citations collapse to chips that expand.

---

## Evidence and data created

- **Probe results:**
  - `scratchpad/oct03/agentic-gap/coach-probe-results.json`
  - screenshot `dashboard-after-probes.png`
  - script `coach-probe.mjs`
- **Probe answers (verbatim excerpts):**
  - UCAS: "outside what I can reliably quote … what's your unweighted GPA?" (mode `academic`)
  - MIT EA: "historically November 1, but I can't give you a sourced, confirmed date" (mode `academic`)
  - Reminder: "Reminders aren't something I can set" (mode `academic`)
  - Essay request: deflected to Essay Studio, no prose (mode `essay`, 22 s)
- **Data created on the QA student `bilalhussain.v1+qa-wf09271424@gmail.com`:**
  - 4 user and 4 assistant rows in `cc_coach_conversations`.
  - Background extraction ran:
    - `extractAcademic` on 3 turns;
    - school and activity extraction on the essay turn.
  - It reported `extracted: 0` schools. **I did not verify whether any `cc_activities` or `cc_academic_profiles` rows changed.**
- **Messages used:** 4 of 6.
