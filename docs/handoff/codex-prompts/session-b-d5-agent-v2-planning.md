> **HOLD: don't paste this yet.** The founder is running their own Codex research first (2026-09-27). Claude revises this prompt once that research is back.

**ASTRA: SESSION B, D5 COUNSELOR AGENT v2 PLANNING.** Start this after you've delivered the D4.2 plan and prompt. It outranks D4.3–D4.9.

The founder wants Coach Kairos to be a real admissions counselor agent: one that could stand in for much of an $8,000 counseling package for students in grades 9–12 and transfer students, applying in the US, UK and Canada. You own the planning and the agent UI/UX. Claude builds, runs the evaluations and deploys.

## Read first (summaries, not raw dumps)

1. `docs/strategy/2026-09-27-counselor-agent-v2-cto-memo.md`. This is **binding**: the six v2 additions, the corrected credits note (cloud compute, not Anthropic API spend), and the "will NOT do" table.
2. `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` (your D2, greenlit). v2 **extends** it; don't redesign what's settled there.
3. `docs/superpowers/plans/2026-09-25-agent-slice-a1-*`, `-a2-*`, `-b-*`, `-c-f-outline.md`.
4. `docs/research/2026-09-26-competitors-and-negative-reviews.md` and `docs/research/2026-09-27-agent-differentiation-research.md`. The second is **complete**. Its 40 golden-set seeds (§4) are the first cases. §6 recommends `web_lookup` as a background evidence-cache refresher, not `:online` answers. §5 and §8 list the sites whose terms forbid automated access (College Board, Common App, UCAS web, OUAC); design curated entry for those. OUAC now uses Group A/B, not 101/105.
5. `docs/qa/2026-09-27-audit-resolution-matrix.md` in the `grokking-integrate` worktree: the coach-memory rows QA-30, 45, 53, 56, 58 and 59.

## Deliver, each behind its own gate

**D5.1: v2 spec amendment.** A new spec, `docs/superpowers/specs/2026-09-28-counselor-agent-v2.md`, extending D2 with:

- **`web_lookup` tool.** Schema and allowlist policy, with a provider adapter covering OpenRouter web search, a founder-supplied search MCP or Firecrawl. It must also define:
  - how GLM 5.3 Flash turns a fetched page into cited field claims;
  - inline versus job boundaries;
  - cost per call;
  - behaviour for injection-bearing pages, and for no result versus a stale result.
- **Knowledge base.** Two layers: rules and facts per institution, program and cycle; and a sourced counselor playbook. Specify:
  - the tables (`cc_kb_documents`, `cc_kb_chunks` with pgvector), chunking, and metadata (source URL, publisher, retrieved at, cycle, country, review status);
  - hybrid FTS + vector retrieval with citation carry-through;
  - the staff review and quarantine workflow;
  - coverage order: top 50 US, then UC, UCAS, OUAC and other Canadian systems;
  - how retrieval stays separate from each student's private memory.
- **Per-student counselor profile (`cc_coach_profile`).** Coaching style dimensions (gentle↔direct, cadence, push level, language, sensitivities), who can edit it (the student; a linked counselor can suggest but not overwrite), and how it conditions prompts and next-action policy **without** fine-tuning.
- **Workflow registry.** Named, versioned recipes: `add_schools_and_requirements`, `week_plan`, `family_cost_picture`, `scholarship_shortlist`, `interview_prep_for_school`, `transfer_requirements_check`, `ucas_timeline`, `ouac_program_requirements`, and others you justify.
  - Give each its tools, deterministic checks, preview/confirm points, failure and abstain states, and golden-set coverage.
  - The model selects and fills a workflow. It never improvises multi-step writes.
- **Golden set v2.** At least 300 cases. Specify:
  - the taxonomy (stage × country × task family × refusal/abstain);
  - a case schema that includes the verified correct answer or behaviour, the official source and the forbidden outputs;
  - the review process (human-verified before a case counts);
  - the dev/held-out split;
  - an independent judge from a different model family than the generator (GLM), via OpenRouter with founder-approved spend. The judge's rubric must be calibrated against human labels on a sample.
- **Agent UX contract.** Specify:
  - proposal, evidence, unknown and progress cards (shared with D4.2 amendment A);
  - how the student sees and corrects what Kairos knows (D2 §2.5 context panel);
  - how a linked human counselor sees agent actions;
  - shy-student and organized-student interaction patterns.

Stop at **GATE D5.1** with a short gate message. Mocks are optional; the card components come from D4.2.

**D5.2: executable plans.** After GREENLIGHT, write plans in the writing-plans format: header with Spec path, Global Constraints, Review Focus (5), and 8 tasks or fewer, each with Files, Interfaces, real code, exact `npx vitest run` commands with Expected lines, and explicit-path commits. Plans:

- `web_lookup` and provider adapter;
- the knowledge-base schema, ingestion and retrieval;
- the golden-set harness and first 100 cases (Claude fills the remaining cases from research);
- the workflow registry and the first 3 workflows;
- the counselor profile.

Write Claude prompts `docs/handoff/claude-prompts/2x-*.md`. Sequence them after agent slices a1 → a2 → b; nothing student-facing ships before b's gates.

## Hard rules (unchanged)

- The AI never writes essay prose. Never promise admission. There are no personal admission probabilities.
- No logging into a student's Common App, UCAS or OUAC account. No fabricated counselor track record. No per-student fine-tuning.
- Grounded data only. Every external fact is cited and dated; unknown is a first-class answer.
- Minors' data: no student PII is sent to search providers (D2 §8.1).
- No production code from you. Plans, specs, mocks and prompts only. Never run `npm run test:unit`. Don't read `.env.local`. Use `git add` with explicit paths, and the trailer `Co-Authored-By: claude-flow <ruv@ruv.net>`.
