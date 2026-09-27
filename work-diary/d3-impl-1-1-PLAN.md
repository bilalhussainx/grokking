# D3-IMPL-1.1 review fixes

Authority: main checkout docs/handoff/codex-prompts/session-b-d3-impl-1-1.md, 2026-09-27. Work only in grokking-daybreak, design/daybreak, baseline 3b08451. Admissions only; stop at this gate.

1. Reconcile scope and record browser font baseline.
2. Subset local display/script fonts reproducibly, retain licenses and shaping; prevent duplicate Urdu requests and preload only hero face. Verify all five languages and <=200KiB actual homepage font requests.
3. Adopt approved emblem; generate deterministic app icon sizes/maskable safe zone; build standalone admissions footer. Inspect mobile/desktop.
4. Remove literal pricing/limits; use PRICING. Missing fair-use export goes to Claude; no invented export. Fix cost grouping and single announcement, scoped scrolling and behavioral tests.
5. Run src tests, targeted lint, typecheck/build as appropriate; independent review, screenshots and ledgers; focused explicit-path commits. No push/deploy/environment reads.

Protected files: page.tsx, providers.tsx, middleware.ts, settings/page.tsx, shared TopNav/Footer, sitemap/manifest/robots/llms routes and next.config.ts. Required integration changes go in gate handoff, not those files. Preserve historical mocks as evidence; remove only demonstrably dead production code.

Antigravity routine delegation attempted first: transport closed. Bounded existing worker handles cost logic/tests; root handles design/assets and measures browser. One browser and preview server only; close owned processes at completion. Rollback is reverting this slice's focused commits, never resetting shared work.

Completed individually: baseline measurement; subsets and byte validation; icons/footer; cost/pricing fixes; focused/full source tests; browser captures; independent source and artifact review; minor review repair and fresh footer capture; implementation commit baea252. Typecheck remains inherited-blocked; build attempt is inconclusive. Evidence/checkpoint commit closes the turn at GATE D3-IMPL-1.1. No D4.2 work started.
