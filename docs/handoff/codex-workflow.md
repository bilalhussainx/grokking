# Codex (Astra) workflow: who does what, which session, which prompt

_Last updated 2026-09-26 by Claude Code. The founder runs this file; Astra doesn't need to read it._

## The split

| Astra (Codex, GPT-6) | Claude Code |
|---|---|
| Design, product judgment, specs, **plans**, Claude prompts | **Builds** every greenlit plan, reviews Astra's gates |
| Browser ops in dashboards (Stripe) | Security, billing code, bug fixes, tests, deploys (with founder approval) |
| | Item 5: competitor research, installable phone app, Ad Astra pilot readiness, testing every student type |

Astra never writes production code, applies migrations or deploys. Claude never designs a surface without an Astra gate.

## Three Codex sessions

| Session | What | Start with | Status |
|---|---|---|---|
| **A: agent design** (existing session) | D2 counselor-agent plans | Paste `docs/handoff/astra-gate-d2-plans-response.md` (whole file) | Waiting on you |
| **B: surfaces** (**new** session) | D3 homepage, then D4.1–D4.9 redesigns | Paste `docs/handoff/codex-prompts/session-b-d3-d4-kickoff.md` (whole file) | Ready; runs in parallel with A |
| **C: browser ops** (the session with Stripe logged in) | Stripe tidy-up | Paste `docs/handoff/codex-prompts/session-c-browser-ops.md` | Optional, small |

Sessions A and B write different files (A: agent specs/plans and prompts `01–09`; B: surface specs/plans and prompts from `10`), so they don't collide.

`docs/handoff/astra-gate-d2-response.md` is **already used**. It produced the D2 plans. Don't paste it again.

## The loop (every gate, every session)

1. Astra stops with a `GATE …` message.
2. **You paste that message to Claude Code.** Claude reviews the files (independent reviewer for plans) and writes the next Astra prompt to `docs/handoff/astra-gate-<id>-response.md`: GREENLIGHT / CHANGES / SKIP plus amendments.
3. You paste that file into **the same session** the gate came from.
4. After a GREENLIGHT, Astra writes spec + plan + Claude prompt (`docs/handoff/claude-prompts/<nn>-*.md`) and stops at `GATE <id>-PLANS`.
5. Claude reviews the plan (step 2 again). Once accepted, **you tell Claude "execute prompt <nn>"**. Claude builds it test-first, gets a fresh review, fixes, and records evidence in `docs/handoff/claude-progress.md`.
6. Deploys and production migrations happen only when you say so.

## Order of events

| # | Who | Step | Needs from you |
|---|---|---|---|
| 1 | Claude | **Credit lock-down**: apply `supabase/migrations/20260925_lock_down_credit_rpcs.sql` to production and verify with the anon key | Your "yes" (asked now) |
| 2 | Session A | D2-PLANS-2 (revised a1, a2, b plans) | Paste the prompt |
| 2 | Session B | GATE D3 (homepage mocks) | Paste the kickoff |
| 3 | Claude | Review D2-PLANS-2 and D3; write the response prompts | Paste the gate messages to Claude |
| 4 | Claude | Execute agent slice a1, then a2 | **Docker Desktop running**; a founder-created `.env.agent-probe` with only the OpenRouter key for the ≤$0.05 model probe |
| 5 | Claude | Item 5: competitor research, phone app (PWA), Ad Astra readiness, every-student-type testing; also the phone footer overflow and activities off-by-one | None |
| 6 | Claude | **Deploy `feat/counselor-marketplace`**, then apply the remaining migrations (200 credits and 7-day trial, trial-expiry view, credit reservations) | Your go; set in Vercel: `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_1UK0IQCvx3JX9BYYy6j6V7K6`, `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY=price_1UK0LfCvx3JX9BYYFHlvEruR`, and (Production) confirm `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_SECRET`, `TEACHER_SECRET_KEY` |
| 7 | Claude | Execute slice b (safety + evaluations) | Approve or deny the **$20 English pilot**; name the fluent reviewer (you) |
| 8 | Session A | Full plans for slices c–f, after Claude reports the a/b interfaces | None |
| ∞ | Session B | D4.1 → D4.9, one gate each; Claude builds each greenlit plan | Greenlights |

## Things only you can do

- Start Docker Desktop (agent slices and the credit SQL test).
- Add `STRIPE_TEST_SECRET_KEY=sk_test_…` to `.env.local` (test checkout).
- Set the Vercel env vars above at deploy time. **Not before**: production code still says $12 until this branch ships.
- Decide: the support email Stripe shows customers (currently traderhussain.com), and the terms page wording.
- The $12 → $15 subscriber migration and notice: **not needed**. Stripe shows 0 subscribers on the $12 prices.
