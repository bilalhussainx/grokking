# Coach Kairos v2: from "an LLM on a platform" to a counselor agent

_CTO memo, 2026-09-27, written by Claude in the CEO/CTO role at the founder's request. This memo sets direction; the specs and plans come from Astra (Codex session B) and are built by Claude._

## The ask, restated

A student, from grade 9 through transfer and applying in the US, UK or Canada, should get from Coach Kairos what an $8,000 counseling package gives:

- a mentor who knows their whole story;
- a planner who keeps them on time;
- a researcher who finds the right, current, official information;
- a strategist for their school list and aid;
- an essay coach who makes them better writers without writing for them.

Students who don't want to click through pages should be able to just ask, and the agent does the work with their confirmation. Everything must be measurably correct: a **golden set** of real problems with verified answers, and **deterministic workflows** wherever rules exist.

## What already exists (don't rebuild it)

`docs/superpowers/specs/2026-09-25-counselor-agent-design.md` (Astra's D2, greenlit) already defines most of the engine:

- a typed tool catalog with preview → confirm → commit writes;
- a deterministic JourneyState and next-best actions;
- provenance memory and a student-controlled story bank;
- an official-evidence pipeline with freshness rules and durable jobs;
- GLM 5.3 Flash / GLM 5.3 routing via OpenRouter with Sonnet escalation;
- a 240-conversation evaluation with hard release gates.

Executable plans for slices a1, a2 and b are in `docs/superpowers/plans/2026-09-25-agent-slice-*`.

v2 **extends** that spec. Build order does not change: a1 → a2 → b come first, because every capability below depends on the bounded tool loop and the no-prose/grounding check.

## Decisions

### 1. Build these (v2 additions to D2)

| # | Capability | Why | Where it lives |
|---|---|---|---|
| 1 | **`web_lookup` as an evidence-cache refresher.** An allowlisted search, then a page fetch, then a verbatim quote extracted by GLM 5.3 Flash, then validation and storage in `cc_public_evidence`. Students are answered from the **validated cache**, never straight from `:online` search output, because there the model writes its own citations and breaks D2 §8. The allowlist covers government and `.edu` pages whose terms allow automated access (studentaid.gov, collegescorecard.ed.gov, nces.ed.gov, each college's own domain, UC, ox.ac.uk, cam.ac.uk, ontario.ca, canada.ca). **College Board, Common App, UCAS web pages and OUAC forbid automated access.** They get human-curated evidence entry or explicit permission instead (research §5, §8). | Students ask "what's Michigan's EA deadline this year?". The answer must be current and sourced. | Extends D2 §8. Inline for up to 3 pages; bigger refreshes become jobs. OpenRouter web search via Exa costs about $0.007 per search, or about $0.011 per refreshed claim before checker costs (research §6). The provider sits behind an adapter so a founder-supplied search MCP or Firecrawl can replace it. |
| 2 | **Admissions knowledge base (RAG).** A curated, cited corpus with two layers: (a) **rules and facts** per institution, program and cycle, for the top 50 US universities first, then UC, UCAS, OUAC and other Canadian systems; (b) a **counselor playbook** of sourced practices (NACAC, IECA and HECA guidance, admissions-office publications, published counselor methods) for school-list balance, essay questioning, aid strategy and the like. Every chunk carries source, date and cycle. | "Deeply sourced training data" in a form the agent can cite and we can correct. | New `cc_kb_documents`/`cc_kb_chunks` with pgvector (Supabase already has it), Gemini embeddings (already used), and hybrid FTS + vector retrieval. Staff review before publishing, following D2 §8's quarantine rule. |
| 3 | **Per-student counselor profile.** The student (and their human counselor, if one is linked) sets the coaching style: gentle or direct, check-in cadence, how much the coach pushes, preferred language, and what to avoid. A shy student and a hyper-organized student get different coaches from the same engine. | This is how "set and retrain each student's own AI counselor" is realized. | `cc_coach_profile` plus D2 §6 memory. It's a prompt and policy layer; **no model fine-tuning** (see §3). |
| 4 | **Agent-first flows.** Plain-language requests map to deterministic workflows, for example: add schools and pull their requirements; build this week's plan; explain what my family pays; list scholarships I qualify for; prepare me for the Michigan interview. | Students who don't want to click. The UI shows the same proposal and evidence cards (D4.2 amendment A). | D2 tools plus a **workflow registry**: a named, versioned recipe of tool calls with fixed checks. The model picks and fills a workflow; it doesn't improvise multi-step writes. |
| 5 | **Golden set v2.** At least 300 problems with verified correct answers or behaviours across stages × countries × task families, plus refusal cases. It's built from the research (`docs/research/2026-09-27-agent-differentiation-research.md` §4) and ChatGPT Deep Research output, and reviewed by a human before it counts. | "Correct solutions" as an automated regression gate. | Extends D2 §9.2. It runs on every model, prompt, tool or knowledge-base change. |
| 6 | **Counselor-in-the-loop.** For students linked to an agency (for example Ad Astra), the agent drafts briefings and flags risks for the human counselor; the human stays the authority. | This is what makes it a real $8k-grade service, and it's our pilot. | D2 `prepare_counselor_briefing`, D4.9. |

### 2. Using the $200 Anthropic credits

Claude (Sonnet) is **not** the day-to-day student model; that's GLM on OpenRouter, for cost. The credits buy **quality infrastructure**:

- **Evaluation judge** for the golden set and the 240-conversation suite. An independent model grades GLM's outputs against the verified answers, so the generator isn't grading itself. One full candidate run is roughly 240 conversations × about $0.03 of judging ≈ **$7–10**.
- **Red-team and scenario generation.** Claude drafts adversarial probes: "write it for me", jailbreaks in Urdu or Hindi transliteration, fake deadlines. Humans label them. About **$10–20** once.
- **Knowledge-base extraction.** Structured extraction of rules and facts from fetched official pages, then staff review. At about 60 institutions × a few pages, it's roughly **$20–40** for the first build.
- **Escalation model.** D2's one-escalation rule applies, only for unresolved hard cases.

That leaves roughly **$100** for about five to eight full evaluation rounds as the agent improves. Spending is logged per run in `.agent/VALIDATION_LOG.md`. Before any paid run, the founder is told the estimate, as the standing rule requires.

### 3. Things we will NOT do, and what we do instead

| Ask | Why not | What we do instead |
|---|---|---|
| Log into a student's **Common App** (or UCAS or OUAC) account | Account-sharing and automated access breach the platforms' terms, and handling a minor's credentials is a security and liability risk. Common App treats AI-written "substantive content" as fraud. | The student pastes or uploads what they see, such as status, requirements or a PDF export. Kairos reads official public pages for everything else. |
| An AI "counselor who got students into Harvard, MIT and Stanford, running a multi-million practice" | That would be a fabricated track record, which is false advertising and exactly the trust failure competitors are criticized for. | The coach is trained on **documented** expert practice with sources, and supervised by real counselors (Ad Astra) whose results are their own, stated truthfully. |
| "Retrain" a model per student | Fine-tuning per student is costly, slow and can't be audited or corrected. | Per-student memory (D2 §6), the counselor profile (§1 #3) and the knowledge base. All of it can be inspected and corrected, and it's deleted on request. |
| Personal admission probability ("your chances at Harvard") | No valid individual probability exists (D2 §11.2). | Transparent reach/target/likely bands from published data, with reasons and uncertainty. |
| Automated fetching of College Board, Common App, UCAS or OUAC pages | Their terms forbid bots, scraping or unauthorized third-party use (research §8). | Human-curated evidence entry with links and short attributed extracts, open datasets (College Scorecard, IPEDS), or written permission. |
| Scraping review sites or Reddit at volume to "train" the model | Terms of service, plus low-quality signal. | Targeted research with citations (in progress). The findings shape workflows and golden-set cases, not model weights. |

## What makes this different from the competitors

Confirmed by `docs/research/2026-09-27-agent-differentiation-research.md` §7. No AI competitor found cites official sources with dates, checks rules across a whole school list, or runs a confirm-then-save task loop. The IECA code ("shall not write application essays", "neither guarantee placement nor outcomes") matches our rules, so Coach Kairos follows the same ethics code as $8k counselors:

1. **It does the work, but only with consent.** It proposes, the student confirms, it commits. It never takes silent actions.
2. **Every fact carries its source and the date it was checked.** Where it can't verify something, it says "unknown", never a guess.
3. **The coach refuses to write the essay** and makes the student a better writer. This protects low-income applicants (Cornell/CMU 2026 study).
4. **One engine, with coaching styles set per student**, from shy to hyper-organized, in the student's language.
5. **US, UK and Canada in one place**, with each system's rules rather than Common App assumptions.
6. **A human counselor in the loop** when there is one, with the AI doing the legwork.
7. **Measured correctness.** A public golden-set pass rate, re-run on every change.

## Sequence

1. Deploy the current release candidate (founder "go").
2. Claude builds agent slice a1 (bounded loop plus three read tools), then a2, then b. **Docker Desktop must be running** for the isolated database tests.
3. In parallel, Astra plans D5, the v2 additions in §1, with specs, plans and Claude prompts. See `codex-prompts/session-b-d5-agent-v2-planning.md`.
4. In parallel, ChatGPT Deep Research produces the sourced dataset. See `codex-prompts/chatgpt-deep-research-admissions-corpus.md`.
5. Claude builds `web_lookup` and the knowledge-base schema, then the golden-set harness, then the workflow registry, then the counselor profile. Each slice is gated by the golden set.
6. Pilot with Ad Astra students after the release gates in D2 §9.2 pass.
