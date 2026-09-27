# Daybreak implementation slice 1

Authority: docs/handoff/astra-gate-d3r2-response.md, founder GREENLIGHT. This specific instruction supersedes the older Astra/no-production-code rule for this slice only. Worktree C:/Users/bilal/Downloads/grokking-daybreak, branch design/daybreak, base531e6ace1adf2a7fc941b71e9bd642cc69a345b2. No push, merge, deployment, migration or .env.local access.

## Current state and architecture

The root is a client page whose anonymous redirect goes to /landing, while signed-in effects preserve dashboard/intake behavior. Providers also impose app navigation/scroll chrome. Replace only the anonymous path and add an auth-aware exception in the shell. Keep signed-in effects, middleware, existing marketing shell, pricing and app routes intact. New Daybreak shell and tokens are opt-in; never remap old --kl or global font/color variables.

Atkinson Hyperlegible is the UI/body face; Nunito Sans remains the warmer display face. Named Noto per-script fonts support Hindi, Punjabi and Urdu; RTL is scoped to translated content. Page #FFF7EE, white cards, apricot only for welcome/next-step moments, sage for family support. Controls12px; feature cards22px; dense ruled content12px. Patchwork is a restrained welcome/completion accent.

## Ordered work and acceptance

1. [x] Isolate worktree at the exact requested path/branch; inspect original root and providers. No dirty main-tree changes copied. Archive old DESIGN.md before replacement.
2. [x] DESIGN.md v2, scoped CSS tokens with Tailwind4 mappings, local licensed fonts, illustration/voice/focus/motion rules. Verify contrast formula and source scope.
3. [x] Accessible primitives with Testing Library: label/error associations, native select, buttons/cards/status/callout, keyboard tabs (including RTL), bottom navigation with current page. Focus/touch/logical-property CSS reviewed in browser.
4. [x] Homepage and new marketing shell/footer: local three-answer quick check, five real coach-language codes, first unknown planning question, family guide, honest cost arithmetic, imported prices and configured-only annual option. No persistence or check API request; preserve signed-in behavior with explicit regression tests.
5. [ ] Required full checks, sequential to conserve RAM: npx vitest run src; npx tsc --noEmit -p .; npm run build. Never test:unit. Record baseline/environment failures separately; repair only justified in-scope defects.
6. [x] One gstack browser, localhost only with nonproduction placeholder configuration if needed. Capture /, /pricing and untouched /courses at375x812 and1440x900. Test native forms, keyboard, scripts/RTL, contrast, resources and page weight. Measure available browser performance entries; do not invent Lighthouse scores. Auth behavior checked with isolated tests rather than production login.
7. [x] Fresh independent source/evidence review, repair/reverify, focused explicit-path commits with required trailer, validation report and worktree-local ledgers. Stop at GATE D3-IMPL-1 for Claude review, merge and deploy.

## Constraints, risk and recovery

No .env.local copied/read/printed. Dependencies may be shared through a local node_modules junction; do not install/update through it. Environment variables for local runtime must be obvious test placeholders pointing at localhost only. Old global provider payloads may dominate page weight; measure and distinguish new design assets from existing application overhead. Do not claim authenticated visual acceptance without nonproduction fixtures. Preserve /pricing as a regression surface in this slice, including any documented pre-existing issues. Vercel CLI is unavailable; recommend npm i -g vercel for Claude's later deployment work, not an install or deploy in this slice.

Rollback: discard/revert only focused design/daybreak commits after review; never reset or clean the shared main checkout. Stop only at the review gate or a documented acceptance blocker.

## Delegation

Antigravity attempted first: model/effort mismatch corrected once, then observed429quota exhaustion (144h42m). No repeated retry. Bounded fallback primitives and logic/test packets may use an available lower-cost agent; Astra owns architecture, typography, integration and final evidence. Fresh verifier receives artifacts and acceptance criteria, not the implementation narrative.

Acceptance checkpoint: required checks were executed, but step 5 remains blocked by the inherited aid-explainer type error, standard build dependency-junction limitation and unverified production weight. See d3-impl-1-validation.md. No release approval. Private browser and owned preview servers stopped.
