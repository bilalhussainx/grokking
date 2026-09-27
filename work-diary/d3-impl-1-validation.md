# D3-IMPL-1 validation — Daybreak + Table

Date: 2026-09-26. Branch `design/daybreak`; worktree `C:/Users/bilal/Downloads/grokking-daybreak`; base `531e6ace1adf2a7fc941b71e9bd642cc69a345b2`. This report is a local review artifact, not deployment evidence.

Implementation commit: `9800476` (`feat(design): implement Daybreak and Table homepage slice`). The following documentation commit preserves raw validation output, screenshots and the project checkpoint; it does not change production code.

## Acceptance status

Implementation and local visual verification are complete. **GATE D3-IMPL-1 is not green:** the inherited aid-explainer type error prevents TypeScript acceptance, the standard build cannot use the external dependency junction, and the 550KiB production page-weight budget has not been verified. This is a reviewable implementation, not a release approval.

## Scope

- DESIGN.md v2, v1 archive, opt-in Tailwind 4 tokens, licensed local fonts and original illustration.
- Eight accessible primitives with native controls, linked errors, named keyboard tabs and current-page bottom navigation.
- Signed-out homepage and separate Daybreak marketing shell. Three-answer check, optional planning questions, family conversation guide and integer-cent cost check use React state only.
- Prices import PRICING; annual option is gated by yearlyCheckoutConfigured. Five quick-check language codes derive from the existing coach language list.
- Existing signed-in effects remain unchanged; dedicated route tests cover resolved signed-out rendering, onboarded redirect/query preservation, focus=intake and incomplete-onboarding handoff.
- Existing marketing shell, pricing page, app pages and legacy `--kl-*` tokens are unchanged.
- Homepage metadata/share card now use Daybreak copy instead of the unsupported $8,000 comparison. Middleware excludes only the public Daybreak WOFF2 directory and exact root share-image endpoint; protected application paths still match the middleware.

## Validation ledger

| Check | Evidence | Result |
|---|---|---|
| Primitive focused tests | Agent-run `npx vitest run src/components/ui/daybreak --maxWorkers=1` | 8 passed |
| Pure check/cost logic | Agent-run `npx vitest run src/lib/daybreak --maxWorkers=1` | 24 passed |
| Homepage interaction tests | Agent-run `npx vitest run src/components/marketing/daybreak/daybreak-homepage.test.tsx --maxWorkers=1` | 10 passed |
| Root route regression | `src/app/page.daybreak.test.tsx`; full-suite log | Four cases passed during full run |
| Full src suite | `npx vitest run src --maxWorkers=1 --pool=threads --reporter=verbose`; `d3-impl-1-src-tests-threads.log` | **92 files / 626 tests passed**, exit 0. Initial fork run was interrupted after delayed visible output; its saved log includes a 91-file / 622-test passing summary but an ambiguous shutdown. The completed thread run includes the four added route tests |
| Final affected tests | `d3-impl-1-final-focused.log` | **5 files / 48 tests passed**, including two new middleware tests; the other 46 overlap the full run, not additional tests |
| TypeScript | `npx tsc --noEmit -p .`; `d3-impl-1-typecheck.log` | Exit 2: inherited AidExplainerLauncher/FamilyModeView prop mismatch. No Daybreak error reported |
| Standard production build | `d3-impl-1-build.log` | Exit 1: Turbopack rejects the node_modules junction outside its root |
| Targeted ESLint | `d3-impl-1-lint.log` | Exit 0; one advisory about native img. The image is a 961-byte local SVG with explicit width/height; no raster optimization needed |
| Contrast | `d3-impl-1-evidence/contrast.json` and DESIGN.md | All text combinations >=4.5:1; functional borders/focus >=3:1 |
| Independent source review | Separate reviewer inspected implementation, tests and diffs | No confirmed new source defect; requested selected-option color check. Added stronger scoped selected-option rule |

The original Vitest configuration tries to load `.env.local`. There is no such file in this worktree; it reported zero injected variables. No production environment file was read, copied or printed. No production database fixtures were run. All local browser configuration must point to localhost and contain only explicit dummy values.

## Inherited blockers

1. `src/components/cc/net-price/AidExplainerLauncher.tsx:58`: caller passes `preset` and `aidContext`; FamilyModeView accepts only language/onExit. Independent diagnosis found an incomplete feature, not just stale props: neither text nor voice request carries the selected-school figures, and the API accepts only message/language. These production files are unchanged from HEAD. Removing or ignoring the props would conceal the missing behavior. Claude should complete the typed, validated, grounded frontend/API contract with tests in its own feature slice.
2. Local dependencies are an external junction. Turbopack disallows this filesystem arrangement. A local mirror attempt was stopped after a Windows hard-link error on a long path and excessive traversal through the existing pnpm tree. Shared dependencies were not installed, updated or deleted. Run the required standard build in a checkout with local dependencies after repairing the inherited type error.

An earlier typecheck additionally reported a course-page Lesson/LanguageLesson union error. It did not recur in the final normal typecheck; no course source was edited. The separate fresh, non-incremental log records the final diagnostic cross-check.

The fresh `--incremental false` cross-check confirmed only the inherited aid-explainer error. Final independent artifact review matched the saved test, font, layout and performance evidence; its one documentation correction about the first test run's delayed output is incorporated above.

Implementation whitespace checks passed before commit. Evidence staging reports only terminal-generated blank lines at EOF in four raw test/lint logs; those logs retain their original formatting.

Automatic approval review rejected cleanup of the incomplete `.next/dependency-copy` artifact with “blocked by policy.” It remains ignored and uncommitted. No alternate deletion mechanism was attempted.

## Browser evidence

All captures come from the actual local Next application, not standalone mocks. The webpack dev server compiled the homepage but restarted at its low memory ceiling. `daybreak-local-preview.cjs` successfully ran the same app with a common-parent Turbopack filesystem root for the dependency junction and hid the development indicator. It preserves the repo configuration otherwise; `next.config.ts` is unchanged. Both preview modes used only localhost dummy Supabase settings. The helper is a local validation tool, not a production server.

| Surface | Phone 375×812 | Desktop 1440×900 |
|---|---|---|
| Homepage | [Capture](d3-impl-1-evidence/home-375.png), [full page](d3-impl-1-evidence/home-375-full.png) | [Capture](d3-impl-1-evidence/home-1440.png), [full page](d3-impl-1-evidence/home-1440-full.png) |
| Existing pricing | [Capture](d3-impl-1-evidence/pricing-375.png) | [Capture](d3-impl-1-evidence/pricing-1440.png) |
| Untouched course catalog | [Capture](d3-impl-1-evidence/courses-375.png) | [Capture](d3-impl-1-evidence/courses-1440.png) |

The two regression surfaces retain their original dark themes; their page and shell sources are unchanged. This is visual smoke coverage, not a pixel comparison against a deployed baseline. Existing pricing copy about three schools/one essay and its annual FAQ remain outside this slice and need Claude's separate pricing review.

Additional captures: Urdu, Hindi, Punjabi and Spanish mobile views; next-step result; cost result and unknown path; rendered [social share card](d3-impl-1-evidence/social-card.png). The share endpoint returned HTTP 200 with image/png. JSON inspections confirm no horizontal overflow and no sub-44px homepage targets at phone/desktop and Urdu. All six font faces loaded. Selected option ink/sage colors resolve correctly despite legacy option styling. Urdu labels were given extra vertical spacing and regular weight after visual inspection.

Observed interactions:

- Three native selections produce the stage-aware essay action, explicitly leaving authorship to the student. Focus moves to its H3 result. Reset removes the result and focuses `next-stage`.
- Empty cost submission focuses the linked alert. Entering 30000.50 − 10000.25 − 5000.25 produces exactly **USD 15,000.00** and focuses the result heading.
- Changing to CAD clears all three inputs and the result, with an explicit no-conversion notice. The unknown path shows what to collect rather than assuming zero.
- Keyboard Tab reaches the skip link; Enter focuses `daybreak-main`.
- Script choices render at document width 375. Native-speaker editorial review remains outstanding.
- Reduced-motion CSS was source-reviewed; OS-level reduced-motion emulation was not performed.

Local console errors were the existing `/api/cc/glossary` provider request returning 500 because the intentionally absent service-role key is required by that route. No key was supplied and no production data was contacted. The controls themselves produced no observed runtime exception. The private browser and both owned preview servers were stopped; port 4180 has no listener.

## Weight and timing: not a production pass

Six WOFF2 files total **380,192 bytes**; the original SVG is **961 bytes**. `assets.json` records exact sizes and SHA-256 hashes. Fonts support the welcome band and all five quick-check languages.

The inspected development load transferred **6,810,915 resource bytes** (about 6.50MiB), excluding the document. Course-data chunks dominate, including a 927,479-byte encoded general data chunk and 368,647-byte coding-interview chunk. The signed-in legacy root and shared providers still import those datasets. Development tooling and source maps are also present. These numbers are not a production estimate and **do not establish compliance with 550KiB**.

`performance-dev.json`, on a warm, unthrottled local navigation, recorded TTFB 2295ms, FCP/LCP 4060ms and an observed layout-shift sum of 0.00098. This is not a Lighthouse score, the shift sum is not the session-window CLS algorithm, and INP was not measured. The root still waits for client auth hydration before displaying the anonymous homepage, which also warrants production performance review.

Before release, repair the baseline build/type dependency, measure a production build and isolate unrelated catalog/app data from the public homepage if the budget is exceeded. Do not change the budget to make the gate pass.

## Review boundaries

No push, merge, deployment, migration, payment configuration or real-user message. Native-script rendering tests are not native-speaker editorial approval. Authenticated routing tests use mocks, not a production account. Full authenticated visual acceptance remains Claude's staging responsibility.

Vercel CLI is not installed. For Claude's later approved deployment workflow, strongly recommend `npm i -g vercel` so environment management, deploys and logs can use the CLI. Installing or deploying is outside this slice.
