# Gate D2 response + plan brief: paste into the Codex (Astra) session

> Written 2026-09-25 by the founder's Claude Code session. Paste everything
> below the line into the **same** Codex session.

---

**GATE D2: GREENLIT with amendments.** `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` is approved as the basis for the executable plans. What makes it strong: the server-derived AuthScope, output that is buffered and checked before any student-visible byte, a deterministic JourneyState, "a missing record is unknown, not a negative fact", shipped-only counselor feedback, and model routing treated as an evaluated hypothesis. This greenlight does **not** approve deploys, production migrations, live price changes, paid model runs beyond the compatibility probe in amendment 6, or contacting users.

## Amendments (binding on the plans)

1. **Write only plans a and b in full now.** Plans must contain real code against real interfaces, and slices c–f depend on interfaces that a and b create. For c–f, write a one-page outline each: scope, dependencies, open questions, and the five Review Focus items. Write their full plans after a and b land and Claude reports the actual interfaces.
2. **Simplify admission in slice a without weakening the guarantees.** No signed admission ticket and no `/operations/quote` endpoint in a. Use a client operation key, a unique `(user_id, operation_key)` row, an input hash (changed input returns 409), and reserve → capture | release. Every guarantee in §6.2/§10.3 still holds: no double charge, no re-execution on replay, and an expired replay never regenerates. Signed tickets and payer-bound quotes arrive with paid refresh jobs in e/f, where they're actually needed.
3. **Billing primitives belong to Claude's item 4** (Stripe + credits: Free 200 credits, Pro $15/month or $99/year). Plans consume `reserve(operationKey, maxCredits)`, `capture(operationKey, finalCredits)` and `release(operationKey)` as an interface and don't implement them. Slice a must run end to end behind an internal no-charge flag until Claude ships the primitive. Don't set credit prices; the 1-credit-per-useful-turn proposal goes to item 4 as input.
4. **Evaluate in two tiers.**
   - *Pilot gate* (required before any real student sees generative output): English plus only the languages the founder enables for the pilot. 24 scenario families × enabled languages × 1 paraphrase; at least 150 authorship probes and 50 allowed-coaching controls per enabled language; zero prose releases; false-block rate ≤ 5%. Every other language stays disabled.
   - *General-rollout gate:* the full §9.2 suite (240 conversations, 500+ probes, 100 controls per language family).
   - Budget the pilot gate's provider cost in the plan (rough dollars) so the founder can approve one number.
5. **Real transaction tests need an isolated Postgres, never production.** The in-memory fake can't prove leases, row locks, unique-constraint races or RLS. Plan a must include a task that stands up a local database (Supabase CLI `supabase start` with Docker, or plain Postgres) and applies the new migrations there. If Docker or Postgres isn't available on the founder's machine, the plan's first step says so and stops for a founder decision. It must never fall back to production or to `tests/unit` fixtures.
6. **Model compatibility probe.** Plan a includes one task that makes a single minimal call to each configured role model (routine, planner, check, and the escalation candidate). It records whether the slug exists, whether tool calling and JSON mode work, and the latency. Total cost stays under $0.05. An unknown slug or capability disables that role (fail closed). `z-ai/glm-5.3` and `-flash` are unverified until this passes.
7. **Keep plans small.** No more than 8 tasks per plan. If slice a is bigger, split it into **a1** (provider adapter, tool registry, three read tools, a checked-output gate that can be stubbed, and the SSE stream with UTF-8/fragment parsing) and **a2** (durable turns/events/replay, operations, settlement via the item-4 interface, and cancellation).
8. **What Claude has shipped since D1** (all local, **not deployed**). Don't re-test these, and don't redesign around them without saying so:
   - Invite links survive sign-up; `?next=` is same-origin only.
   - Students see their counselor on the join page and dashboard (`GET /api/cc/my-counselor`).
   - Counselors without an agency get a create-workspace card.
   - Readable essay-type labels and KairosLearn copy.
   - The glossary is public and degrades to empty. Production `cc_glossary` has 0 rows, and seeding it waits on the founder.
   - Essay Studio stacks at phone width: new `.kl-studio-grid`, `.kl-studio-shell` and mobile `.kl-bs-subhead` rules in `tokens.css`. D4's Essay Studio work should build on these rules.
   - `/api/admin/*` fails closed with no hardcoded secrets.

   Evidence: `docs/handoff/claude-progress.md`.

## Deliverables for this step

- `docs/superpowers/plans/2026-09-<nn>-agent-slice-a[1|2]-*.md` and `…-agent-slice-b-*.md`: full executable plans in the current writing-plans format. Each needs a header with the Spec path, Global Constraints, a **Review Focus** section (five failure modes, each paired with the test that pins it; start from spec §11.4), Interfaces blocks, real code, exact `npx vitest run <path>` commands with Expected lines, and explicit-path commits.
- `docs/superpowers/plans/2026-09-<nn>-agent-slices-c-f-outline.md`: the one-page outlines from amendment 1.
- `docs/handoff/claude-prompts/<nn>-agent-slice-<x>.md`: one paste-ready Claude prompt per full plan. It should say to run the plan with superpowers:executing-plans, name the plan and spec paths, and list the stop conditions (production DB, deploys, paid runs beyond the probe, missing Docker).

## Unchanged constraints

- Route tests reuse `src/lib/cc/__tests__/helpers/fake-supabase.ts` and `fixtures.ts`, with static route imports and hoisted mocks.
- Tests run with `npx vitest run <path>`, **never `npm run test:unit`** (it runs DB fixtures against production).
- Every model choice is an env var, and a missing one fails closed.
- The AI never writes essay prose.
- Keep the gate message short. No production code.

When the plans are written, stop at **GATE D2-PLANS** with a short message listing the files. The founder brings it to Claude for review before any execution. D3 (homepage) starts after that.
