# Gate D1 response + D2 brief — paste into the Codex (Astra) session

> Written 2026-09-25 by the founder's Claude Code session. Paste everything
> below the line. It works in the current session or a fresh one.

---

**GATE D1 — GREENLIGHT**, with the amendments below. Your memo
(`docs/design/2026-09-product-judgment.md`) is accepted as the product input
for D2. It's the judgment I asked for: readable, specific per phase, grounded
in dated official sources, and honest about what it couldn't assess. Three
findings especially mattered: the Outline 500 in production, the Revise
contradiction (88→90 "polish" while the Coach says "expand to 500+ words"),
and the fact that `validateGuardrail` is a minimum-length check, not a
no-prose check.

## Amendments

1. **The Outline HTTP 500 belongs to Claude Code** (a P0 bug fix). Don't
   diagnose it. Design D2 and D4 as if Outline works.
2. **The top five are accepted as the agent's feature priorities, in your
   order.** That includes replacing the headline score with a reasoned state
   ("develop reflection next") plus at most three priorities.
3. **The no-prose rule needs real enforcement.** D2 must specify a semantic
   output check (what it detects, what happens when it fires, multilingual
   cases, and how it's evaluated). Claude implements it.
4. **Don't re-verify what Claude owns.** Security fixes are underway in Claude
   Code: essay, course, recommender, and intake ownership holes are fixed;
   counselor comment binding, agency scoping, and the supervised-review gate
   are next. The status lives in `docs/handoff/claude-progress.md`. Read it
   instead of re-testing.

## Next: D2 — the AI Counselor Agent design (GATE D2)

Follow §4 D2 of `codex-astra-handover-prompt.md`, with your D1 priorities as
the backbone. The spec goes to
`docs/superpowers/specs/2026-09-<nn>-counselor-agent-design.md` and must
cover:

- **Specialized, grounded agent features**, derived from your top five. For
  each: the student problem, the backing data or official source, the tools
  used, abstention behavior (what it says when evidence is missing), and what
  it will never do. Minimum set: a unified next-revision judgment across the
  essay phases; the affordability picture and scholarship shortlist with
  explicit matches, exclusions, and unknowns; the student-controlled story
  bank; a finder that returns up to three dated, feasible opportunities; and
  a context panel that shows what was and wasn't considered.
- **Tool catalog:** name, inputs and outputs, backing table or API, cost
  class, inline versus background job, and the authorization rule. It
  replaces the `<<actions>>` text block.
- **JourneyState and next-best actions**, deterministic, across
  `g9 g10 junior senior_writing senior_post_submit senior_decisions transfer`,
  extending the existing `cc_grade9_plan` foundation you found.
- **Memory with provenance:** fact cards; confirmed versus inferred; the
  difference between a missing product record and a missing achievement;
  published counselor notes versus private agency notes versus unpublished
  graduate drafts (the last two never enter student prompts).
- **Model routing plus the eval plan.** GLM 5.3 Flash for routine turns,
  GLM 5.3 for planning, Sonnet as escalation only. The routing is proven on
  scripted students before it's adopted (see handover §3 for prices). Every
  model choice is an env var.
- **Streaming protocol** (text, tool events, and cards) for web and mobile
  Safari, and the **background-job boundaries** (crawls, re-plans) with
  timeouts and credit metering.

After the D2 greenlight, write the implementation plans and Claude prompts as
separate shippable slices. Suggested order: (a) the tool-calling loop with
streaming and three tools; (b) the no-prose output check and the eval
harness; (c) JourneyState and next-best actions; (d) memory and the story
bank; (e) the scholarship and affordability data pipeline; (f) the
opportunity finder.

## Formats (unchanged, with one addition)

- **Plans** go in `docs/superpowers/plans/2026-09-<nn>-<name>.md`, in the
  current writing-plans format, which now **requires a "Review Focus"
  section**: the five inputs or failure modes the tests don't exercise, each
  paired with the test that pins it. Include real code in the steps, exact
  test commands, and no placeholders. Tests run with `npx vitest run <path>`,
  never `npm run test:unit` (it runs DB fixtures against production).
- **For route tests**, reuse the in-memory fake Supabase Claude built:
  `src/lib/cc/__tests__/helpers/fake-supabase.ts` and `fixtures.ts`. Import
  routes statically at the top of the test file (mocks are hoisted); dynamic
  per-test imports time out under full-suite load.
- **Claude prompts** go in `docs/handoff/claude-prompts/<nn>-<name>.md`.
- Keep the gate message format short. **No production code.**

Start D2.
