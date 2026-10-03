# Validation ledger

Evidence lives in `work-diary/evidence/`, captures in `work-diary/screenshots/`, incremental results in `work-diary/events.md`.

| Check | Result | Evidence |
|---|---|---|
| Initial TypeScript | PASS, exit 0 | baseline-typecheck.log |
| Initial complete unit command | FAIL: 4 DB suites cannot resolve Supabase, 2 import timeouts | baseline-unit.log |
| Isolated source unit tests, 2 workers | PASS: 42 files, 392 tests | isolated-unit.log |
| Targeted auth/marketing lint after fixes | PASS: 0 errors, one existing unused argument warning | fixed-targeted-lint.log |
| Production build | PASS, exit 0 | build.log |
| Final TypeScript after build and menu test | PASS, exit 0 | final-typecheck.log |
| Subsequent source tests overlapping build | FAIL: 2 credential import timeouts; 391 tests pass, including menu regression | verified-unit.log |
| Live homepage, pricing, counselor product | Rendered desktop/375px; issues recorded, not a full flow pass | 001/003/004 evidence |
| Marketplace discovery unauthenticated | Redirects to login | 005 evidence |
| New student signup | BLOCKED: backend DNS failure | 002 evidence |
| Existing test counselor login after restart | BLOCKED: auth endpoint missing CORS response during restoration | 006 evidence |

`n- Live recovery verified: auth200, onboarding completed test1 Grade9, manual invitation redemption201, synthetic course POST200 persisted on reload, major quiz POST200 (14.7s). Evidence work-diary captures014–021. Audit incomplete; scores and missing settings route are findings, not passes.
`n- Live test2: school persisted, quiz persisted, summer POST20012.29s persisted after reload, visit POST200850ms persisted. Captures026–040 displayed, console/network saved. Settings404 and glossary500 remain. Test3–10 not run. No redesign/deployment claim.

2026-09-25: Supabase irnxkvjhrzfqboucufdd authenticated auth health HTTP200. Captures049–052 viewed. Test3 recommender save/list discrepancy and mobile essay defects remain audit findings, not fixed.

2026-09-25 test4: real signup/onboarding200, counselor join201581ms, school add2002206ms, application update200472ms persisted in reload list200+DOM. No-op Attach verified by click+source. Screens055–058 displayed. No redesign implemented or deployed; audit in progress.
# 2026-09-25 continuation through091
Transfer test7 captures078–090 displayed, API profile confirms school/32credits/Fall2027 persisted; GPA absent. Coachmessage2004176ms wrongly describes saved transfer details as missing.085 settled courses replaces081 loading captures. Ontario test8 created Grade11 and profile editor saves Canada/Ontario across reload091 (DOM evidence). No product change or new unit test run in this audit segment.
# 2026-09-25 continuation through109
Alltenstudentaccounts created. test8CA/Ontario persists afterlogout/login, savedWaterloo reachesCoach, corrected syntheticplanningdetails recalled withoutanswerpriming. test9freshhistory0 andneutralrecallunknown; test10foreignessay/feedback404,counselorfile403,ownhistory0. test4EssayStudiobrainstormpersists acrossnewlogin, butinitialreturningsessionquerygetsfalsememorydenial;neutralfollowupcorrectlyrecallsallfourdetails. API200eightturns/emptydraft. GeneralCoachdoesnotseebrainstorm107. All001–109screensshown. See checkpoint109 and memory-audit forlimits; no broadmemory/securitycompletionclaim.

## 2026-09-25 checkpoint123
- Source suite393/393,43files,63.50s: work-diary/evidence/gate1-source-unit.log. Build/typecheck previous pass; no subsequent product edits.
- Independent report accuracy PASS including119-123 addendum; full product acceptance unpassed. work-diary/gate1-independent-verification.md.
- Screens001-123 shown; sampled graduate read isolation, draft privacy, API publication, student/head resubmission/approval, new-login feature persistence and second-essay isolation verified with bounded scope.
- No production deployment/migration/real-user messages/paid listing. Exact next gate and fixtures: work-diary/checkpoint-123.md.

## Daybreak validation ledger

2026-09-26. Full evidence and limitations: `work-diary/d3-impl-1-validation.md`.

| Evidence | Result |
|---|---|
| Full src Vitest, one threads worker | 92 files / 626 passed; exit 0 |
| Final affected Vitest including middleware, routing, controls and logic | 5 files / 48 passed; exit 0 |
| `npx tsc --noEmit -p .` | Exit 2, inherited aid-explainer props mismatch |
| Fresh TypeScript with `--incremental false` | Same single inherited error |
| `npm run build` | Exit 1, external dependency junction rejected by Turbopack |
| Scoped ESLint | Exit 0, one native-SVG img advisory |
| gstack actual Next browser | Six required viewport captures plus multilingual, results and share card |
| DOM checks | No homepage horizontal overflow; all interactive targets >=44px; font faces loaded; correct selected-option colors |
| Keyboard/form checks | Skip target, result/error focus, reset, exact cents, currency invalidation and unknown path verified |
| Contrast | Normal text >=4.5:1, functional borders/focus >=3:1 across the documented surfaces |
| Performance | Dev measurements recorded; production budget and Lighthouse acceptance not established |
| Independent review | Separate reviewer examined source, test evidence and final report; no new source blocker identified in its first two passes |
| Cleanup | Owned server/browser stopped; temporary mirror removal blocked by automatic approval review |

The 48 affected tests overlap the 626 full-suite tests except the two new matcher cases. No `test:unit`, production migration, push, deployment or environment-file access was performed. The absent local service-role key causes the existing glossary endpoint's documented 500 response in local preview.

## 2026-09-27 — D3-IMPL-1.1
Source suite 93 files / 632 tests passed (exit 0); focused 38 overlap. TypeScript still fails on inherited aid props only. Targeted lint 0 errors / 3 image advisories. Actual browser font payload 583,164 to 83,564 unique bytes; six layout records pass overflow/touch checks. Five languages rendered; grouped money and single focus announcement path verified by DOM. See work-diary/d3-impl-1-1-validation.md for exact commands, limitations and gate requests. No deploy.

Final artifact review confirmed test totals, font/icon hashes and DOM evidence. Its minor footer whitespace finding was repaired and recaptured. Implementation baea252. Production build attempt stopped without diagnostics/completion: inconclusive, not a pass.

## 2026-09-27 — Checkpoint 1: admissions-only release (production)
Deployed master a612a57. Production smoke (QA student): retired course routes 307 to admissions pages; pricing shows $15/mo and $99/yr; signup copy "200 AI credits"; manifest served; homepage first load 399 KiB; 9 core signed-in pages load with no page errors; net price shows schools with no raw enum values. Found React #418 on /cc/dashboard, fixed in checkpoint 2.

## 2026-09-27 — Checkpoint 2: D4.2 Daybreak shell + Today dashboard (production)
Expected: Astra GATE D4.2 design (Amendments A and B) live for students and counselors; no hydration errors.
Actual: master e6c62aa (tree identical to d27337e: vitest 116 files / 764 tests pass, tsc 0 errors, next build exit 0). Final opus review 0 Critical / 2 Important, one fix wave, scoped re-review 4/4 addressed. Vercel status success. Production smoke, QA student and head counselor at 1440×900 and 375×812: every page 200, frame present, Ask Kairos and AI badges on Today, zero page errors (React #418 gone), zero failing /api calls.
Open: phone horizontal overflow from page content, not the frame — /schools school cards 439px (+80px), /cc/essays essay rows 389px (+30px).
No test:unit, no migrations, no env-file reads.

## 2026-10-03: Oct 3 audit fixes (production, master 66cce03)
Shipped, in order: phone overflow fix (f6270b0); removal of the unauthenticated /api/cc/coach/extract (82c7cb7); /stories retired (a6f09c8); agency self-claim removed (0bba14b); early-plan warnings match catalog names (819be76); UK/Canada schools by their own system (c905fee); marketing truth (w1) plus bug batch (w3) plus independent-review fixes (66cce03).
Evidence:
- Suite: 140 files, 954 tests. tsc clean. next build exit 0.
- Built HTML checks: /faq shows "18 languages" with no raw placeholder; /pricing has og:image and the true trial rule.
- Production smoke (student plus counselor, 1440 and 375): 0 failures, 0 page errors.
- 375px overflow scan of 21 pages: 0.
- Live homepage shows $15 and $99, the UK quiz option, and Start free in the mobile header.
- Read-only production checks: 0 self-claimed agency rows; 0 non-US list rows carrying US deadlines.
Not done:
- The UK/Canada seed --apply (a production write) was blocked by the auto-mode classifier and needs the founder.
- Reminder email opt-out: no preference column exists.

## 2026-10-03: Agent A1 + S1 shipped dark (master 49a433f, then 32eb6a8)
A1 (bounded loop, scoped read tools, provider, SSE) and S1 (journey tools, proposals with signed confirm, turn route, nudges cron, inbox, activity log, Coach wiring, golden scorer) were built through subagent-driven development: 16 tasks, a review per task, and a final opus review per slice, each with one fix wave and a scoped re-review.
Evidence:
- Suite: 164 files, 1,267 tests (7 skipped: local-PG, run separately on a postgres:16 container, 7/7). tsc clean. next build exit 0. Vercel success.
- Prod dark check (unflagged QA student): /api/cc/me agentS1=false; inbox, activity, turn and proposals all 404; cron 403 without the secret; /cc/agent/activity 404; Today shows no inbox. 375px overflow scan: 0.
Also shipped: one shared /api/counselor/me lookup (32eb6a8). Counselor roster went from 19-26 s to 6-7 s; team page from 40-49 s to 11-12 s.
Not done (founder):
- the production migration 20261003_agent_s1.sql;
- AGENT_CONFIRM_SECRET;
- the pricing probe;
- the golden live run;
- the flag-on blockers in docs/evidence/agent/rulings-a1-s1.md.
