**ASTRA — DESIGN SESSION B: D3 homepage and D4 surface redesigns.** This is a fresh session. Design session A continues the counselor-agent plans (D2), so don't touch D2 files: `docs/superpowers/specs/2026-09-25-counselor-agent-design.md`, `docs/superpowers/plans/2026-09-25-agent-*`, and `docs/handoff/claude-prompts/0[1-3]-*`.

## Read first (summaries, not raw dumps)

1. `codex-astra-handover-prompt.md` §2 (operating model), §4 D3 and D4, and §5–7 (grounding, hard rules, gate format). That's your contract.
2. `docs/design/2026-09-product-judgment.md` (your D1, greenlit) and `docs/design/2026-09-live-audit.md` (QA-11…59).
3. **Superseded 2026-09-26 by the founder:** `DESIGN.md` and `kairos-tokens.css` (navy/black/gold, Cormorant) are **no longer binding**. D3 is reimagining the visual identity to be warm and welcoming for students of every background; see `docs/handoff/astra-gate-d3-response.md`. D4 follows the design system approved at GATE D3-R2, not `DESIGN.md`. The Essay Studio mobile rules Claude added in `src/app/tokens.css` are layout fixes and remain useful.
4. `docs/handoff/claude-progress.md`: what Claude has already fixed. Don't re-test it, and don't design around a bug that's already fixed.
   - Security: ownership and counselor review.
   - Broken saves: recommenders, transfer GPA, Settings and net-price routes.
   - Invite links survive sign-up; students see their counselor.
   - A create-workspace card for counselors without an agency.
   - Pricing: `src/lib/pricing.ts`. Free is 200 credits once. Pro is $15/month or $99/year, unlimited under fair use (300 coach messages and 120 voice minutes a day), with a 7-day trial.
5. `docs/handoff/stripe-setup-report.md` §4 and §7. The Stripe customer portal already handles plan switching (monthly ↔ yearly), cancel-at-period-end, cards and invoices. Upgrade and billing UI should hand off to it, not rebuild it.
6. `work-diary/agency-agent-design-proposal.md`, the starting point for D4.9 (counselor workspace).

## What to deliver, in order, each behind its own gate

- **D3: Design direction and homepage** (handover §4 D3).
  - Three hook directions, each with an interactive hero that does something real for a student in about 60 seconds without signup, using only data the product has today.
  - Pricing is explained as Free (200 credits) or Pro at $15/month or $99/year.
  - Deliver it as mocks in `docs/design/mocks/homepage/`, built with the real tokens, then stop at **GATE D3**. D3 also sets the platform-wide direction that D4 follows.
- **D4.1 → D4.9** in this order:
  1. signup, login, onboarding and counselor linking;
  2. student dashboard, app shell and mobile navigation;
  3. Coach UI, the face of the D2 agent. Its streaming and cards contract is spec §10 in the agent design. Design to it, but don't change it.
  4. Essay Studio, including review visibility in every phase;
  5. school list, applications, requirements and private files;
  6. activities, profile, courses, testing, majors, visits and summer;
  7. aid and scholarships, interviews, waitlist, family and voice;
  8. the pricing page and upgrade moments (UI only). A Pro user who hits a fair-use limit sees a 429 fair-use message, not an upgrade prompt.
  9. the counselor workspace (the full list in handover §4 D4.9).

For each gate: mock, then gate message, then stop. After the founder's GREENLIGHT, write the spec, the plan and the Claude prompt:
- **Spec:** `docs/superpowers/specs/2026-09-<nn>-<surface>-design.md`.
- **Plan:** `docs/superpowers/plans/2026-09-<nn>-<surface>.md`, in the current writing-plans format. That means a header with the Spec path; Global Constraints; a **Review Focus** section listing the five failure modes the tests don't exercise, each paired with the test that pins it; ≤8 tasks, each with Files, Interfaces and real code; exact `npx vitest run <path>` commands with Expected lines; and explicit-path commits.
- **Claude prompt:** `docs/handoff/claude-prompts/<nn>-<surface>.md`, numbered from **10**. Session A uses 01–09.

## Mobile is not optional

Every mock ships at **375×812 and 1440×900**. Astra's audit found crushed columns, overlapping controls and horizontal overflow at 375px. Claude found and fixed one in Essay Studio, and found another in the marketing footer: `.kl-mkt-foot-links` is 396px wide in a 311px parent. It's logged, and Claude fixes it in item 5. Treat phone width as the primary layout, not a squeeze of desktop.

## Rules

- No production code: nothing under `src/`, `supabase/migrations/` or config. The exception is static mocks under `docs/design/mocks/`.
- Grounded data only (handover §5). No invented statistics, reviews or deadlines. Never promise admission. The AI never writes essay prose.
- **Never run `npm run test:unit`** (it runs DB fixtures against production). If you must run tests, use `npx vitest run src`.
- Don't read or print `.env.local`. `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- Log new issues you notice while designing as QA-60+ in `docs/design/2026-09-live-audit.md`, in readable prose.
- `docs/handoff/codex-progress.md`: add or update only your own D3/D4 rows. Session A owns the D2 rows.
- Gate messages use the handover §7 format. Keep them short.

**Start with D3.**
