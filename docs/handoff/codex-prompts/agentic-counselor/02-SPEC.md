# 02 — Spec: Kairos, an agentic admissions counselor students want to come back to

Status: decided by Claude (CTO), 2026-10-04, under the founder's delegation ("from your plans … implement a world class AI Agentic Counselor workflow"). Revised the same day with the differentiation research (04-RESEARCH-BRIEF §0–§1). Decisions marked **[D]** are binding for Codex. Items marked **[OPEN]** need the founder; do not ship copy that depends on them.

## 1. The problem, in students' and families' words

Students drop counseling tools because:
- the tool waits for them to ask, and shy students never do;
- answers are generic ("would like it to be more specific");
- the AI "doesn't know you";
- deadlines are wrong ("Dartmouth does not have an ED II");
- chance numbers mislead ("giving me 2% for Cornell… I got in");
- the tool sells their attention to colleges;
- human help costs thousands, replies in 72 hours and turns over staff;
- it only knows US admissions.

What families actually pay $5k–$10k for is **accountability, being known, honest realism, parent reassurance and continuity**, not insider knowledge. The founder adds: "a mechanical chatbot loses them."

## 2. Success criteria (measurable)

1. **First session:** a new student reaches one concrete, saved artifact in under 10 minutes: a school on their list, a story in their story bank, a task on their plan, or a mock-interview score.
2. **Proactive:** every active student gets at least one useful, sourced, agent-started item per week, either a proposal they can confirm or a check-in. Measure confirm rate; the target is above 30%.
3. **Correct:**
   - zero ungrounded dates, amounts or requirements in agent output across the golden set;
   - every fact shown to a student carries a source and a "last checked" date, or says "not yet verified for 2026–27";
   - rule-engine conflicts are caught on 100% of the golden-set list cases.
4. **Integrity:** zero essay prose written for the student. Every essay session appears in the student's exportable integrity log.
5. **Voice feels live:** p50 latency from end of speech to first audio is:
   - ≤ 900 ms in en, es, fr, de, it and nl;
   - ≤ 1.6 s in ja;
   - ≤ 1.5 s in the 10 Indic languages, with a stretch target of ≤ 1.0 s everywhere.

   Spoken replies are ≤ 35 words. These are measured by `scripts/voice-latency-probe.mjs`, not estimated.
6. **Counselors:** a counselor sees, on one screen, which students need them today and why.

## 3. The companion and the team [D]

Decision: **one companion, many specialists** (option A). Kairos is the single character a student bonds with. When real expertise is needed, Kairos brings in a specialist, stays present, and takes the conversation back afterward. To a student this reads like a counseling firm: one lead counselor and a team. It answers the "they don't know you" complaint with memory, and the "accountability" praise with a weekly plan.

### 3.1 Kairos's character

- **Voice:** warm, direct and a little playful. A smart older cousin who has read every admissions rule. Uses the student's name and their own words back to them. Short turns, one question at a time. Honest and realistic without heightening anxiety (IECA VI.B).
- **Never:**
  - guilt-trips;
  - fake urgency;
  - streak shaming;
  - "As an AI…" filler;
  - compliments without substance;
  - lists in voice;
  - personal admission probabilities.
- **Temperament modes [D]:** the student picks a mode, or Kairos suggests one after the first week. Mode changes nudge cadence, message length and how much is shown at once.
  - **Gentle** (shy or anxious): small asks, one task at a time, voice optional, softer check-ins.
  - **Steady** (default).
  - **Full control** (highly organized): the whole dashboard, checklists, conflict reports.
- **Presence, not a chat box:** Kairos lives in a dock on every signed-in page (03-DESIGN §4). It has:
  - an illustrated non-human face;
  - a status line ("Checking your deadlines…", "Wren is with you");
  - states driven by **real events only**:
    - `idle`;
    - `noticed` (an inbox item, with a one-line reason);
    - `working` (a named tool step);
    - `celebrating` (≤ 3 s, real completions only);
    - `handoff` (a specialist is active);
    - `quiet` (quiet hours or paused).
- **The "toy" factor, without manipulation:**
  - **"What Kairos knows about you":** confirmed facts and stories, each editable and deletable.
  - **A journey map with real milestones.** The companion grows a small visual trait per milestone. Completed steps count, logins don't; no streak loss.
  - **Play modes**, each under 2 minutes and each saving something real:
    - **60-second spark** (one story-mining question);
    - **Hot seat** (one interview question by voice, one tip);
    - **Myth or fact** (one sourced admissions myth a day; "Is Harvard test-optional?" is a great one, because many sites still say yes).
  - **"Take me there":** Kairos opens the right screen and highlights the field. Navigation only, never a silent write.

### 3.2 The specialists [D]

| Role | Name | Owns | Enter when | Tools (beyond read tools) | Signature workflow |
|---|---|---|---|---|---|
| Lead counselor and mentor | **Kairos** | plan, motivation, routing, temperament, family digest, escalation | always; the default | journey tools, `propose_task`, `handoff_to`, `navigate_to`, `refer_to_human` | Weekly plan (§5.1) |
| Essay coach | **Wren** | brainstorming, story bank, outlines from the student's words, ≤ 3 anchored critiques | essay pages; "essay", "personal statement", "PIQ", "UCAS", "activities" | `read_essay`, `read_published_feedback`, `get_essay_status`, `save_story`, `propose_task` | Story bank (§5.2) |
| Interviewer | **Sam** | mock interviews (US alumni, Oxford "academic conversation", Canada program), think-aloud practice | interview prep; "interview" | interview-session tools, `propose_task` | Hot seat and full mock (§5.3) |
| Money advisor | **Ana** | net price routing, SAI literacy, aid forms, contributor consent, special circumstances, scholarships, the ED affordability check | money hub; "cost", "aid", "scholarship", "FAFSA", "CSS", "OSAP", "loan" | money tools (S8), evidence tools (S3), `propose_task`, `propose_calendar_hold` | Aid plan (§5.4) |
| School researcher | **Leo** | fit, list balance from **published** admit rates, testing policy, UK/Canada systems, transfer | schools pages; "which schools", "UCAS vs Common App", "transfer" | `list_my_schools`, school search, evidence tools, `propose_add_schools` | Balanced list (§5.5) |
| Applications manager | **Juno** | requirements, deadlines, the cross-list rule engine, recommenders, FERPA waiver, calendar | applications pages; "deadline", "ED", "REA", "recommender" | `check_list_rules` (S3), `list_requirements` (S3), `propose_calendar_hold`, `propose_task` | Requirements checklist (§5.6) |

Rules for every role:
- Each role is a playbook (data, §4.2), and the hard rules in 01-CONTEXT apply.
- A specialist introduces itself once ("Hi, I'm Wren. I help with essays. I won't write it, but I'll help you find it.") and hands back with a one-line summary.
- The student can always say "back to Kairos" or pick a role from the dock.

## 4. Architecture [D]

Build on the existing agent (A1+S1), not beside it.

### 4.1 One loop, many playbooks

```
student message / voice turn
  → Router (deterministic first: page context, explicit role, active role; then the model's `handoff_to`)
  → runAgentWithPolicy(loop.ts) with the ACTIVE ROLE's playbook:
       system prompt  = core rules (shared, ≤ 1,500 chars) + role prompt (≤ 4,000 text / ≤ 1,200 voice)
       tools          = playbook.tools ∩ registered tools
       output checks  = date-check redact hook + evidence-citation check + essay-prose check + credential redaction + role checks
  → result: text + cards (proposals, navigation, handoff, citation chips)
  → persisted: conversation turn (with role id) + activity log + integrity log (Wren turns)
```

### 4.2 Playbook format

`src/lib/cc/roles/playbooks/<role>.ts`, one per role, plus `src/lib/cc/roles/index.ts`:

```ts
export type RoleId = "kairos" | "wren" | "sam" | "ana" | "leo" | "juno";
export type RolePlaybook = {
  id: RoleId;
  name: string;
  title: string;
  enterSignals: string[];
  tools: string[];
  textPrompt: string;        // ≤ 4000 chars
  voicePrompt: string;       // ≤ 1200 chars
  replyCap: { voiceWords: number; textWords: number };   // 35 / 180 default
  voices: Partial<Record<string, string>>;
  intro: string;
  handBack: string;
  evals: string;             // path to src/lib/cc/roles/evals/<role>.json
};
```

Authoring is test-first (the founder asked for a "writing-skills" approach):
1. Write the pressure scenarios: realistic student turns that tempt the role to break a rule, ramble, guess a date, give a probability or write prose.
2. Run them against a minimal prompt and record failures.
3. Write the playbook until they pass.

Sources: the 120-case golden set plus the 40 seeds in 09-27 §4.

### 4.3 Handoffs

- **Tools:** `handoff_to({ role, reason })` for Kairos; `hand_back({ summary })` for specialists.
- **State:** `active_role` on the agent session.
- **Card:** `{ type: "handoff", from, to, reason }`.
- **Voice:** use Deepgram prompt and voice update messages if Codex verifies them against Deepgram's current docs; otherwise reconnect (≤ 1 s).
- **Voice tools:** client-side function calls (`FunctionCallRequest` → our authenticated API → `FunctionCallResponse`). Verify the shape before relying on it.

### 4.4 Memory

- **Conversation history:** persist every turn with its role id and feed the recent turns within budget. This fixes the "S1 turns are stateless" gap.
- **Facts:** `propose_fact_change` creates a proposal. Confirmed facts go to the profile, and each is listed with its source turn on "What Kairos knows".
- **Stories:** `save_story` proposes a story card. Its quote must be a **verbatim substring of a student turn**.

### 4.5 Proactivity

Keep `triggers.ts` and add:
- `weekly_plan`;
- `midweek_checkin`;
- `deadline_window` (14/7/3/1 days, deduplicated with the email cron, **sourced dates only**);
- `story_gap`;
- `rule_conflict`: fired by S3's rule engine on any list change;
- `aid_form_window` (S8, sourced dates only).

All respect quiet hours, pause and temperament mode, in the tone of Part 2 "Nudge tone and cadence".

### 4.6 Evidence cache [D] (S3; differentiator 1)

- **`cc_public_evidence`:** `id`, `entity_key` (e.g. `school:dartmouth`, `system:ucas`, `fafsa`), `claim_key` (e.g. `deadline.ed1`, `ps.format`, `fee.application`), `cycle` (`2026-27`), `value` (jsonb), `quote` (verbatim, ≤ 300 chars), `source_url`, `publisher`, `fetched_at`, `content_hash`, `status` (`published` | `quarantined` | `stale`), `method` (`curated` | `fetched`), `reviewed_by` (nullable).
- **Read tools:**
  - `list_requirements({ entity, cycle })`;
  - `verify_claims({ claims[] })`;
  - `request_refresh({ entity, claim_key })`, which queues; the student sees "I'm checking; I'll tell you when it's verified".
- **Citation rendering:** the model cites evidence IDs only, and the server renders chips (publisher · "checked Oct 4" · link). A model-written URL is stripped by the output check.
- **Freshness:** use the agent spec §8.1 thresholds. An item within 30 days of an action date needs a check within 24 h, otherwise it shows as "last checked X; re-checking".
- **Refresh job:** Exa or Firecrawl search restricted to that entity's allowlisted domains → fetch → hash → extract with a strict schema requiring a verbatim quote → deterministic validation (the quote is present in the page text, the date parses, the cycle matches) → publish or quarantine.
- **Sources that prohibit scraping** (Common App, College Board, UCAS web pages, OUAC) are **curated by a human** (`method: curated`) through an admin page. They're never fetched by a bot.
- **Seed:** load 09-27 §3–§4 facts as curated rows (re-fetching (I) items first), plus `docs/research/2026-10-03-part3-*`.

### 4.7 Cross-list rule engine [D] (S3; differentiator 2)

`src/lib/cc/rules/` holds pure functions over the student's list, plus evidence about each school's plans. It runs on every list or plan change, and its results are rendered as conflicts with an explanation and source. The rules:
- one pending ED;
- REA restrictions per school (Harvard-style: no other private ED/EA/REA);
- an ED affordability warning (no aid estimate yet);
- UCAS ≤ 5 choices and ≤ 4 in medicine, dentistry or vet;
- Oxford and Cambridge in the same cycle (school-leaver);
- one Oxford course;
- OUAC Group A/B classification inputs;
- UC TAG campus eligibility (not Berkeley, UCLA or San Diego);
- UC PIQ count (4 of 8, 350 words each);
- UCAS PS characters (350 minimum per question, 4,000 total);
- deposits at more than one US college after May 1.

The existing `src/lib/applications/ed-strategy.ts` folds into this.

### 4.8 Integrity log [D] (S10; differentiator 3)

Every Wren interaction on an essay records:
- the essay id;
- the kinds of help given (questions asked, critiques, story links);
- confirmation that no prose was produced: the output-check result;
- timestamps.

The student can export a PDF or CSV "Coached, not written" record and share it with a counselor or teacher. It shows the coaching, never the student's private text unless they choose to include it.

### 4.9 Escalation and red lines [D] (S10; differentiator 8)

- **`refer_to_human({ reason })`:** for immigration status, disability accommodations, legal questions, aid appeals beyond a checklist, and distress. It routes to the linked agency counselor (if any) or the right official office. Distress also shows crisis resources (US 988; UK Samaritans 116 123; Canada 9-8-8) through a fixed, reviewed component, never improvised.
- **Credential redaction:** passwords, FSA IDs, Common App, UCAS or OUAC logins and SINs/SSNs pasted into chat are redacted before storage and model input. Kairos explains why it never takes them (the FSA ID is a legal signature).
- **Never:**
  - log into, submit to or automate any portal;
  - contact colleges or recommenders;
  - draft a teacher's letter;
  - translate essay prose.

### 4.10 Family digest [D] (S10; differentiator 7)

- **The student grants it, revocable at any time**, and the grant is rechecked on every read.
- **The parent sees, in their language:** dates, costs, what parents must do (FAFSA contributor consent, CSS) and the weekly plan summary.
- **The parent never sees:** essays, stories or application status without a separate grant (NACAC I.C.1.d).
- **Same facts as the student.** The digest is generated from the same evidence rows.

## 5. Signature workflows

1. **Weekly plan (Kairos):**
   - On Sunday, Kairos proposes three ≤ 30-minute tasks tied to real gaps, sized by temperament mode.
   - On Wednesday there's a check-in if tasks are open.
   - Done tasks advance the journey map.
   - A linked counselor sees the plan and can add tasks.
2. **Story bank (Wren):**
   - A 10-minute voice or text interview with "so what?" follow-ups.
   - Stories are saved in the student's words and mapped to prompts (Common App 7, UC PIQ 8, UCAS Q1–Q3, supplements), with gaps flagged.
   - Outlines are built only from saved stories.
   - Draft feedback is ≤ 3 anchored critiques, each with a question. Never rewrites.
3. **Hot seat and full mock (Sam):**
   - **Hot seat:** one question, one tip.
   - **Full mock:** 15 minutes, styles US alumni / Oxford academic conversation (think aloud) / Canada program. A rubric (content, specificity, structure, delivery) with a quoted moment per score; two practice tasks proposed.
   - No scripted answers and no claims to know real questions.
4. **Aid plan (Ana, S8):**
   - A cost picture from each college's **NPC** (the student runs it; Ana links it and stores the result the student enters). Unknown is never zero.
   - SAI literacy (a negative SAI is not a refund).
   - FAFSA contributor consent.
   - CSS fees and waivers from evidence.
   - Special-circumstances checklist (the student writes the request).
   - The ED affordability check.
   - A scholarship shortlist.
5. **Balanced list (Leo):**
   - The list's balance is computed from **published admit rates with their year** (Scorecard/CDS evidence), plus affordability fit and system mix.
   - **No personal probabilities, no "safety" labels.** Tiers: "most applicants are admitted" (≥ 50%), "about one in X admitted", "fewer than 1 in 10 admitted".
   - "Ask Leo for 2 more" → `propose_add_schools`, each with one sourced reason.
6. **Requirements checklist (Juno):**
   - A per-school checklist from evidence: essays, tests, recommenders, portfolio, interview, supplements outside the main portal (e.g. the Waterloo AIF).
   - Unknown shows "not yet verified" plus a "check" button that triggers `request_refresh`.
   - Conflicts come from the rule engine.
7. **Family digest** (§4.10).
8. **Counselor collaboration:**
   - Linked counselors see the plan, the agent activity, stories (if shared), proposals and the integrity log (if shared).
   - They can assign tasks.
   - The work queue is in S7.

## 6. Surfaces

| Surface | Slice | Must show |
|---|---|---|
| Companion dock | S5 | face plus status, inbox, active role, chat plus voice, role picker, "What Kairos knows", temperament switch |
| Citation chips and "not yet verified" state | S3 (component), used everywhere | publisher · checked date · link; "I can check" button |
| Today | S7 | next step, journey map, sourced deadline countdown, rule-engine conflicts, essay pipeline, inbox |
| Landing `/` | S6 | live product, the team, the eight differentiators, complaints-to-answers, the "rules counselors follow" band, recorded voice demo, pricing |
| `/counselors` | S6 | roster, work queue, essay review, integrity log sharing, agency tools |
| Counselor work queue | S7 | essays awaiting review, stalled students, deadlines, rule conflicts, referrals |
| Money hub | S8 | aid plan, scholarships, forms walkthrough |
| Integrity log, family digest, settings | S10 | export, grants, temperament, nudges, privacy |

## 7. Non-goals

- Writing or rewriting essays, PIQs, personal statements, activity descriptions or recommendation letters.
- Personal admission probabilities, and "safety"/"chance" labels. The existing LLM chance bands are replaced in S9 (§5.5).
- Submitting applications, logging into portals, or contacting colleges, recommenders or aid offices on the student's behalf.
- Lead generation or selling student data. [OPEN: the founder must confirm before the landing page *says* "we never sell".] The product must not build any of it regardless.
- Outcome or testimonial marketing ("our students got into…") and invented stats.
- Anonymous live voice on the landing page (security). Visitors get a recorded demo.

## 8. Security, privacy and compliance

- Every new route: auth, ownership or agency-scope checks, input validation.
- No keys in client payloads; extend `voice-session-secrets.test.ts`.
- Rate limits on paid-model routes per user per day (fair-use numbers in `src/lib/pricing.ts`).
- Student data: stories, facts and the integrity log have export, delete and "don't use this". Counselors see stories and logs only if shared.
- **Age gate (S10):** collect the birth year at signup. Under 13 needs verifiable parental consent before use (COPPA, amended rule; compliance date 22 Apr 2026). Treat voice audio as sensitive and don't retain raw audio beyond the session. Never send a minor's name, finances or essays to search providers.
- FERPA: only relevant for school contracts. Founder legal review is needed before any district deal (04 §7).
- Scraping terms: follow 04-RESEARCH-BRIEF §5 exactly.

## 9. Claims table (copy may state a claim only when its condition is true in production)

| Claim | Condition |
|---|---|
| "Talk with Kairos in N languages" | N comes from `src/lib/voice/verified-voice-languages.ts` (S11) |
| "Replies in under a second" | Probe p50 ≤ 1.0 s for the named languages |
| "Every date comes with its source" / "says 'not verified' instead of guessing" | S3 is on for all students, and the date-check plus citation output checks are active |
| "Catches plan conflicts like two Early Decisions or Oxford plus Cambridge" | The S3 rule engine is live for all students |
| "Kairos checks in every week" | The S4 triggers are on for all students |
| "Scholarship finder" | S8 shipped with ≥ 50 sourced awards across US, UK and Canada |
| "Never writes your essay" / "Coached, not written record" | Always true / S10 integrity log export is live |
| "Built on the rules professional counselors follow" | True; cite IECA and NACAC on the page; no membership or endorsement implied |
| "US, UK and Canada" | True (limited catalogs); never "every university" |
| "Deadline reminders" | True (email, 14/7/3/1) |
| "18 languages" (text coach) | True per the founder; read `COACH_LANGUAGE_COUNT` |
| "We never sell your data / no recruiter money" | [OPEN] founder confirmation; config flag `FOUNDER_CONFIRMED_NO_DATA_SALE` |
| Any admit outcome, testimonial or "X× more likely" | Never |

## 10. Differentiator → slice map

| # | Differentiator (04 §1) | Built in |
|---|---|---|
| 1 | Cited, dated, cycle-scoped facts that abstain | S3, used by S4/S7/S8/S9 |
| 2 | Cross-list rule engine | S3, surfaced in S7/S9 |
| 3 | Integrity by design and the "coached, not written" log | S4 (no-prose checks), S10 (log) |
| 4 | Affordability first | S8 |
| 5 | One journey across US, UK and Canada (2026–27) | S3 (rules and evidence), S4 (playbooks) |
| 6 | Accountability loop matched to temperament | S4 (triggers), S5 (dock), S9 (weekly plan), S10 (mode settings) |
| 7 | Family digest in the parent's language | S10 |
| 8 | Continuity plus human escalation | S4 (memory), S7 (work queue), S10 (`refer_to_human`) |
| + | Kairos knows you, warmly, in your language, by voice | S1, S2, S4, S5 |

## 11. Founder decisions recorded

- 2026-10-03:
  - pricing is $15/month or $99/year everywhere;
  - claim 18 languages (text);
  - add UK schools;
  - Claude builds pages; Astra/Codex implements this pack.
- 2026-10-04:
  - the companion is option A (decided by Claude under delegation);
  - voice must be sub-second where possible, with measured numbers published honestly;
  - Codex implements this pack in slices;
  - personal chance bands are replaced by published admit rates (Claude, from the 09-27 research and IECA III.D.ii).
