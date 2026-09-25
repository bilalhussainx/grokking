# Execution plan

## Objective and scope
Implement the three tracks in codex-new-session-prompt.md through its approval gates, including the latest requested ten-student agency audit. Protect unrelated dirty work, legacy courses, real users, credentials, production schema and billing.

## Acceptance criteria
1. Track 1: reviewed auth fix; recorded typecheck, build and unit-test results; resolved targeted marketing lint errors; evidence-backed public, per-grade and counselor audit with desktop/375px captures.
2. Every audit screen: DOM state, screenshot shown to user, console errors and network failures recorded. Incomplete/blocked flows labeled explicitly.
3. Audit agency boundaries and capabilities: discovery/request, code linking, student visibility, head/member assignments, review queue, files/artifacts, chat and notification controls; separate existing features from proposed ones.
4. Gate 1: audit summary, top ten findings and proposed surface order for founder approval.
5. Only after gates: approved design spec and executable plan; implement one surface/feature; verify; checkpoint; commit explicit paths.
6. Added founder requirement (2026-09-25): audit every feature's saved student context, including Essay Studio brainstorming, and Coach Kairos continuity across later sessions. Prove save/reload/logout-login persistence, feature-to-coach freshness, correction handling, conversation retrieval and cross-student isolation. Distinguish stored history from information actually supplied to the model; do not claim indefinite recall from a short history window.

## Steps and verification
- [x] Inspect baseline and applicable instructions; capture dirty state without secrets.
- [x] Verify/fix clean-build prerequisites. Unit tests before each commit; no broad staging. Commit9e5e0f5; production build and393 isolated tests pass; DB integration fixture suite requires dedicated environment.
- [x] Initial public/ten-persona/head-member audit using gstack browse; sampled coverage and unsupported capabilities explicitly recorded, not full release acceptance.
- [x] Save each result to events.md/evidence; authoritative RESUME now checkpoint123.
- [x] Produce feature-persistence/Coach matrix with live tests, source traces and explicit untested cases; short-session and second-essay isolation checked.
- [x] Produce consolidated audit/top10/order with independent bounded accuracy verification.
- [ ] Receive Gate1 founder decision; release gaps remain tracked.
- [ ] Following Gate 1, create feat/astra-redesign and prepare three homepage hook proposals using DESIGN.md tokens and relevant frontend skills.
- [ ] Implement approved surfaces and features in prompt order; incorporate agency expansion at explicit gates.

## Recovery and final gate
Keep original dirty files intact. Record failing commands, environment limits and first incomplete gate. Do not mark goal complete until approved work and verification are complete. No deployment assumed. Leave an exact Next for Claude Code entry and source/evidence paths.
