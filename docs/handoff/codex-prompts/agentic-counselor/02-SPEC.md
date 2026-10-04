# 02 — Spec: Kairos, an agentic admissions counselor students want to come back to

Status: decided by Claude (CTO), 2026-10-04, under the founder's delegation ("from your plans … implement a world class AI Agentic Counselor workflow"). Decisions marked **[D]** are binding for Codex. Items marked **[OPEN]** need the founder; do not ship copy that depends on them.

## 1. The problem, in students' words

Students drop counseling tools for six reasons, all documented in 04-RESEARCH-BRIEF:
- the tool is a chat box that waits for them to ask;
- answers are generic;
- deadlines are wrong;
- it sells their attention to colleges;
- human help costs thousands and replies slowly;
- it only knows US admissions.

The founder adds one more: "a mechanical chatbot loses them." The product has to feel like a counselor who knows you, does real work between conversations and is pleasant to come back to.

## 2. Success criteria (measurable)

1. **First session:** a new student reaches one concrete, saved artifact in under 10 minutes. The artifact is a school on their list, a story in their story bank, a task on their plan, or a mock-interview score.
2. **Proactive:** every active student gets at least one useful, sourced, agent-started item per week. Each item is either a proposal they can confirm or a check-in. Measure confirm rate; the target is above 30%.
3. **Voice feels live:** p50 latency from the end of the student's speech to Kairos's first audio is ≤ 900 ms in en, es, fr, de, it and nl, ≤ 1.6 s in ja, and ≤ 1.5 s in the 10 Indic languages, with a stretch target of ≤ 1.0 s everywhere. Spoken replies are ≤ 35 words. These are measured by `scripts/voice-latency-probe.mjs` (S1), not estimated.
4. **Trust:** zero ungrounded dates or amounts in agent output across the golden set. Zero essay prose written for the student.
5. **Counselors:** a counselor can see, in one screen, which students need them today and why.

## 3. The companion: Kairos [D]

Decision: **one companion, many specialists** (option A). Kairos is the single character a student bonds with. When real expertise is needed, Kairos brings in a specialist, stays present, and takes the conversation back when the specialist is done. To a student this reads like a counseling firm: one lead counselor and a team.

### 3.1 Kairos's character

- **Voice:** warm, direct and a little playful. Talks like a smart older cousin who has read every admissions rule, never like a form. Uses the student's name and their own words back to them. Short turns. One question at a time.
- **Never:**
  - guilt-trips;
  - fake urgency;
  - streak shaming;
  - "As an AI…" filler;
  - compliments without substance;
  - lists in voice.
- **Presence, not a chat box:** Kairos lives in a dock that is present on every signed-in page (03-DESIGN §4). It has a face (an illustrated, non-human character with a small set of expressions), a status line ("Reading your Common App essay…", "Waiting for you", "Wren is with you") and a small set of states driven by **real events only**:
  - `idle`: nothing pending.
  - `noticed`: an inbox item exists. Shown as a dot plus a one-line reason.
  - `working`: a tool call is running. The label names the step.
  - `celebrating`: the student confirmed something or finished a step. Shown for at most 3 s and only for real completions.
  - `handoff`: a specialist is active. The specialist's face joins Kairos's.
  - `quiet`: quiet hours or the student paused nudges.
- **The "toy" factor** (the founder asked for something students *enjoy* using, like a pet), done without manipulation:
  - **Kairos remembers and reflects.** A "what Kairos knows about you" card shows confirmed facts and stories, each editable or deletable. Students like seeing themselves understood.
  - **Progress you can see.** A journey map with real milestones (list built, story bank of 5, first draft, mock interview passed, apps submitted). The companion grows a small visual trait per milestone, for example a badge on its scarf. These come from completed steps, not logins. No streak loss and no punishment.
  - **Play modes:**
    - **"60-second spark"** (Kairos asks one surprising question that mines a story);
    - **"Hot seat"** (Sam asks one interview question, the student answers by voice, and gets one specific tip);
    - **"Myth or fact"** (one admissions myth per day, with a source).
    - Each mode takes under 2 minutes and saves something real: a story, an interview attempt or a glossary term learned.
  - **"Take me there":** Kairos can open the right screen and highlight the field ("Let's add Edinburgh. I've opened your list."). It's a navigation action, never a silent write.

### 3.2 The specialists [D]

Names can be renamed later. Keep them short, gender-ambiguous and easy to say in 17 languages.

| Role | Name | Owns | Enter when | Tools (beyond read tools) | Signature workflow |
|---|---|---|---|---|---|
| Lead counselor and mentor | **Kairos** | the plan, motivation, routing, weekly check-in | always; the default | journey tools, `propose_task`, `handoff_to`, `navigate_to` | Weekly plan (§5.1) |
| Essay coach | **Wren** | brainstorming, story bank, outlines from the student's words, feedback | essay pages; "essay", "personal statement", "supplement", "UCAS" | `read_essay`, `read_published_feedback`, `get_essay_status`, `save_story` (proposal), `propose_task` | Story bank (§5.2) |
| Interviewer | **Sam** | mock interviews (US alumni, UK academic/Oxbridge-style, Canada program), feedback | interview prep; "interview" | interview-session tools, `propose_task` | Hot seat and full mock (§5.3) |
| Money advisor | **Ana** | net price, aid forms, scholarships, appeals | net-price page; "cost", "aid", "scholarship", "FAFSA", "CSS", "loan" | money tools (S7), `propose_task`, `propose_calendar_hold` | Aid plan (§5.4) |
| School researcher | **Leo** | fit, list balance, requirements, UK/Canada systems, transfer | schools pages; "which schools", "UCAS vs Common App", "transfer" | `list_my_schools`, school search, `propose_add_schools` | Balanced list (§5.5) |
| Applications manager | **Juno** | requirements checklist, ED/EA strategy conflicts, recommenders, calendar | applications pages; "deadline", "ED", "recommender" | `check_plan_conflicts`, `propose_calendar_hold`, `propose_task` | Requirements checklist (§5.6) |

Rules for every role:
- Each role is a **playbook**, a data file, not a code fork (§4.2).
- The rules in 01-CONTEXT (no essay prose, sourced facts, proposals only) apply to every role.
- A specialist introduces itself once ("Hi, I'm Wren. I help with essays. I won't write it, but I'll help you find it."). It hands back with a one-line summary that Kairos repeats in its own words.
- The student can always say "back to Kairos" or pick a role from the dock.

## 4. Architecture [D]

Build on the existing agent (A1+S1), not beside it.

### 4.1 One loop, many playbooks

```
student message / voice turn
  → Router (deterministic first: page context, explicit role choice, active role; then the model's `handoff_to` tool)
  → runAgentWithPolicy(loop.ts) with the ACTIVE ROLE's playbook:
       system prompt  = core rules (shared, short) + role prompt (≤ 4,000 chars text / ≤ 1,200 chars voice)
       tools          = playbook.tools ∩ registered tools
       output checks  = date-check redact hook + essay-prose check + role-specific checks
  → result: text + cards (proposals, navigation, handoff events)
  → persisted: conversation turn (with role id) + activity log
```

### 4.2 Playbook format

`src/lib/cc/roles/playbooks/<role>.ts`, one per role, plus `src/lib/cc/roles/index.ts`:

```ts
export type RoleId = "kairos" | "wren" | "sam" | "ana" | "leo" | "juno";
export type RolePlaybook = {
  id: RoleId;
  name: string;              // display name
  title: string;             // "Essay coach"
  enterSignals: string[];    // routing hints (page prefixes, keywords)
  tools: string[];           // tool names this role may call
  textPrompt: string;        // ≤ 4000 chars, role-specific only
  voicePrompt: string;       // ≤ 1200 chars, spoken style, hard cap on words
  replyCap: { voiceWords: number; textWords: number };  // voice 35, text 180 by default
  voices: Partial<Record<string, string>>;  // per-language TTS voice id; falls back to Kairos's
  intro: string;             // first-time self-introduction (templated with the student's name)
  handBack: string;          // template for the summary handed back to Kairos
  evals: string;             // path to this role's eval cases (golden set subset + pressure scenarios)
};
```

Authoring discipline (the founder asked for a "writing-skills" approach): each playbook is written test-first.
1. Write the pressure scenarios: realistic student turns that tempt the role to break a rule, ramble, guess a date or write prose.
2. Run them against a minimal prompt and record failures.
3. Write the playbook until they pass.

Scenarios live in `src/lib/cc/roles/evals/<role>.json` and are drawn from `docs/research/2026-10-03-golden-set.json` plus new cases. They're scored deterministically where possible (word count, language, no dates without evidence, asks exactly one question, no prose) and by a cheap grader model otherwise.

### 4.3 Handoffs

- **Tool:** `handoff_to({ role, reason })` is available to Kairos. `hand_back({ summary })` is available to the specialists.
- **State:** `cc_agent_sessions.active_role` (new column or table, S3 migration).
- **Event card:** `{ type: "handoff", from, to, reason }` renders as a small inline banner in chat and swaps the face in the dock.
- **Voice:** a handoff during a Deepgram call sends `UpdatePrompt` and `UpdateSpeak` over the open socket, so the student hears Wren's voice without reconnecting. Codex must verify the exact message names against Deepgram's current Voice Agent docs before relying on them. If they're unavailable, reconnect with a new session (≤ 1 s).
- **Voice tools:** the Deepgram agent supports client-side function calls (`FunctionCallRequest` → the client calls our API → `FunctionCallResponse`). Use this for `handoff_to`, `navigate_to` and read tools in voice. Verify the API shape before building. Function definitions must not contain secrets; the client calls our authenticated routes.

### 4.4 Memory

- **Conversation history:** persist every agent turn (text and voice transcript) with its role id, and feed the last N turns, within budget, into the next turn. This fixes the "S1 turns are stateless" gap.
- **Facts:**
  - `propose_fact_change({ field, value, evidence })` creates a proposal.
  - Confirmed facts land in the student profile.
  - "What Kairos knows" lists every fact with its source turn, editable and deletable.
- **Stories (Wren):**
  - `save_story` proposes a story card: title, the student's own words (quoted from their transcript, never rewritten), tags, and the prompts it could answer.

### 4.5 Proactivity

Keep `triggers.ts` and add these triggers:
- `weekly_plan` (Sunday, the student's local time);
- `midweek_checkin` (Wednesday, only if the plan has open tasks);
- `deadline_window` (14/7/3/1 days, deduplicated with the existing email cron);
- `story_gap` (an essay prompt with no matching story);
- `aid_form_window` (FAFSA/CSS opening dates **only from sourced data**).

All triggers respect quiet hours and pause settings, and are written in the tone rules of `docs/research/2026-10-03-part2-counselor-playbook.md` ("Nudge tone and cadence").

## 5. Signature workflows (what makes it invaluable)

### 5.1 Weekly plan (Kairos)
On Sunday Kairos proposes three tasks for the week from the journey state, each ≤ 30 minutes and tied to a real gap. The student confirms, edits or swaps them. On Wednesday there's a check-in if tasks are open. On completion there's a short celebration and the journey map advances. A counselor (if linked) sees the plan.

### 5.2 Story bank (Wren)
A 10-minute voice or text interview ("Tell me about a time you changed your mind…") mines stories. Each story is saved in the student's own words. Wren maps stories to prompts (Common App 7, UCAS Q1–Q3, each supplement) and flags gaps. Outlines are built only from saved stories. The draft is written by the student; Wren gives line-level questions, not rewrites.

### 5.3 Hot seat and full mock (Sam)
- **Hot seat:** one question, about 60 s, one tip.
- **Full mock:** a 15-minute interview in the chosen style, with a rubric (content, specificity, structure, delivery), a transcript with highlights, and two practice tasks proposed.
- Reuse the existing interview-prep sessions and personas.

### 5.4 Aid plan (Ana), after S7
- A cost picture per school: the student enters amounts, and unknown is never zero.
- The forms needed (FAFSA, CSS, provincial or UK student finance) with sourced open dates.
- A scholarship shortlist from the curated dataset.
- An appeal checklist (the student writes the letter; Ana coaches).

### 5.5 Balanced list (Leo)
Leo checks the list's reach/match/likely balance (estimates, labeled as such), cost fit and system mix (UCAS 5 choices, OUAC, Common App). He proposes additions with one sourced reason each.

### 5.6 Requirements checklist (Juno)
- A per-school checklist (essays, tests, recommenders, portfolios, interviews) built from data with sources.
- Missing data is shown as "not yet verified".
- Conflicts, such as ED with another binding plan, become proposals with an explanation.

### 5.7 Family bridge
Any card can be sent to a parent, translated into the parent's language (the translate route exists). Family mode stays a separate space.

### 5.8 Counselor collaboration
- Linked counselors see the student's plan, the agent activity log, stories (only if the student shares them) and proposals.
- Counselors can assign a task, which appears in the student's plan as "from your counselor".
- The counselor work queue is in S6.

## 6. Surfaces

| Surface | Slice | Must show |
|---|---|---|
| Companion dock (all signed-in pages) | S4 | face plus status, inbox count, active role, open chat or voice, role picker, "what Kairos knows" |
| Today | S6 | the one next step (from the weekly plan), journey map, deadline countdown, Kairos inbox, the essay pipeline |
| Landing `/` | S5 | live product, companion and team, signature workflows, complaints-to-answers, real voice demo (signed-in voice only; a recorded clip for visitors), pricing |
| `/counselors` | S5 | roster, work queue, essay review, agency tools, pricing note |
| Counselor work queue | S6 | essays awaiting review, stalled students, upcoming deadlines, agent flags, each with one action |
| Money hub | S7 | aid plan, scholarships, forms walkthrough |

## 7. Non-goals

- Writing essays or any personal statement prose.
- Admission probabilities as numbers. Bands are labeled estimates.
- Submitting applications or contacting colleges on the student's behalf.
- Selling student data or recruiter-funded outreach. [OPEN: the founder must confirm before the landing page says so.]
- Anonymous live voice on the landing page. Voice requires sign-in since the Oct 4 security fix; visitors get a recorded demo plus a text taster.

## 8. Security and privacy requirements

- Every new route: auth, ownership or agency-scope checks, and input validation with zod or the existing validators.
- No keys in any client payload. Extend `voice-session-secrets.test.ts` for any new voice payload.
- Rate limits on any route that calls a paid model: per user and per day, with fair-use numbers from `src/lib/pricing.ts`.
- Story bank and facts are the student's data: they get delete, export and "don't use this". Counselors see stories only if the student shares them.
- Minors: no public profiles, and no indexing of any student content.

## 9. Claims table (copy may state a claim only when its condition is true in production)

| Claim | Condition |
|---|---|
| "Talk with Kairos in N languages" | N = languages that pass S9's live check (latency target plus language correctness). Read N from `src/lib/voice/verified-voice-languages.ts`, written by S9. |
| "Replies in under a second" | The S1/S9 probe p50 ≤ 1.0 s for that language set; name the languages. |
| "Kairos checks in every week" | The S3 triggers are on for all students (not only the allowlist). |
| "Scholarship finder" | S7 shipped with ≥ 50 sourced awards across US, UK and Canada. |
| "Never writes your essay" | Always true; keep `/integrity`. |
| "US, UK and Canada" | True (limited catalogs); don't say "every university". |
| "Deadline reminders" | True (email, 14/7/3/1). |
| "18 languages" (text coach) | True per the founder's decision; read `COACH_LANGUAGE_COUNT`. |
| "We never sell your data / no recruiter money" | [OPEN] founder confirmation. |
| "Sourced 2026–27 rules library" | Only after the S3 agent is on for all students with date-check active. |

## 10. Founder decisions recorded

- 2026-10-03:
  - pricing is $15/month or $99/year everywhere;
  - claim 18 languages (text);
  - add UK schools;
  - Claude builds pages; Astra/Codex implements this pack.
- 2026-10-04:
  - the companion is option A (decided by Claude under delegation);
  - voice must be sub-second where possible, with measured numbers published honestly;
  - Codex implements this pack in slices.
