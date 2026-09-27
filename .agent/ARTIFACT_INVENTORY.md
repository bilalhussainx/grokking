# KairosLearn artifact inventory — checkpoint123

| Artifact | Purpose / state |
|---|---|
| docs/design/2026-09-live-audit.md | Consolidated initial audit, top10, proposed order; not release acceptance |
| docs/handoff/codex-progress.md | Gate/task ledger and exact next step |
| work-diary/checkpoint-123.md / RESUME.md | Current browser, fixtures, verification and approval boundary |
| work-diary/memory-audit.md | Every-feature storage/model-context matrix with live/source/gaps |
| work-diary/agency-agent-design-proposal.md | Unimplemented relationship, file, notification and specialist/memory proposal |
| work-diary/gate1-independent-verification.md | Independent bounded accuracy PASS, including119–123 addendum |
| work-diary/agency-source-independent-review.md | Source-only agency/authorization inventory |
| work-diary/memory-source-review.md / memory-feature-source-final.md | Qualified source-only context traces |
| work-diary/audit-matrix.md / events.md | Persona coverage and per-result chronological ledger |
| work-diary/screenshots and evidence |123desktop/mobile capture pairs plus DOM/text/network/console/JSON/test logs retained on disk; capture caveats in checkpoint |
| work-diary/login-existing-persona.ps1 | Gstack-only existing synthetic-account login helper; no printed secrets |
| work-diary/qa-synthetic-resume.pdf / make-resume-fixture.cjs |1095B clearly labeled upload fixture and generator; no real student data |

Do not stage the entire directory: historical/private logs, unrelated files and large screenshots are not automatically part of a commit. All evidence remains in the requested local work-diary for portable continuation.

## Daybreak artifact inventory

| Artifact | Location |
|---|---|
| Design system v2 and archived v1 | `DESIGN.md`, `docs/design/archive/DESIGN-v1-navy-gold.md` |
| Scoped tokens | `src/styles/daybreak-tokens.css` |
| Licensed fonts and source manifest | `public/fonts/`, `work-diary/d3-impl-1-evidence/font-sources.json` |
| Original illustration | `public/illustrations/daybreak/next-step.svg` |
| Accessible primitives/tests | `src/components/ui/daybreak/` |
| Homepage, shell and interaction tests | `src/components/marketing/daybreak/` |
| Pure logic/tests | `src/lib/daybreak/` |
| Root and middleware regressions | `src/app/page.daybreak.test.tsx`, `src/middleware.daybreak.test.ts` |
| Validation report, plan and raw logs | `work-diary/d3-impl-1-validation.md`, `work-diary/d3-impl-1-PLAN.md`, `work-diary/d3-impl-1-*.log` |
| Six viewport captures, extra states, DOM/performance/contrast/assets evidence | `work-diary/d3-impl-1-evidence/` |
| Local-only Next preview helper | `work-diary/daybreak-local-preview.cjs` |

Ignored runtime artifacts are not release artifacts: `.next/`, node_modules junction and the incomplete dependency mirror. There is no deployment or production validation artifact in this slice.

## D3-IMPL-1.1 artifacts
- work-diary/d3-impl-1-1-validation.md and d3-impl-1-1-evidence/: gate report, screenshots, font/network/DOM/icon evidence.
- work-diary/subset-daybreak-fonts.py and build-daybreak-icons.cjs: reproducible asset processing.
- public/icons/: four BRAND-1 installable-app PNGs.
- src/components/marketing/daybreak/DaybreakFooter.tsx: standalone admissions footer for Claude integration.
- work-diary/daybreak-src-vitest.config.mts: source-only verification with no dotenv or production fixtures.
