# GATE D3-IMPL-1.1 — review fixes

2026-09-27. Isolated `grokking-daybreak` worktree, `design/daybreak`, baseline `3b08451`. Authority: main checkout `docs/handoff/codex-prompts/session-b-d3-impl-1-1.md`. Local review evidence only; no push, merge, deployment or production validation. Stop here; D4.2 is not started.

Implementation commit: `baea252` (`fix(design): address Daybreak review and adopt admissions branding`). The following evidence commit saves this handoff and raw artifacts without further production changes. Status: review fixes ready for Claude; release acceptance remains open.

## Delivered

- Scoped Daybreak header and reusable `DaybreakFooter` adopt the approved BRAND-1 emblem. Footer contains exactly the Platform, Resources and Legal destinations requested. Its `.daybreak` wrapper does not activate the homepage-only HTML selector.
- Display/script faces are subset from committed licensed originals with OpenType shaping retained. Small regular-weight welcome faces load initially; translated check faces load on selection. All use swap. Old full Daybreak Urdu binary is removed; complete legacy @fontsource Urdu remains available for arbitrary app messages. No complete duplicate Urdu face is requested by this homepage.
- Only Nunito is preloaded. `layout.tsx` changes only four `preload: false` options for existing legacy fonts; definitions/stacks remain. No protected §1 file changed.
- All displayed prices/trial terms import PRICING; annual price remains gated. Free price is spelled “Free.” Numerical fair-use literals are removed pending the missing shared export. Trial says seven days, then the configured monthly/annual price.
- Grouped money such as `45,000.50` parses in integer cents; malformed groups remain invalid. Cost result/error/unknown feedback uses focus, with no simultaneous live announcement. Result heading describes amount and equation.
- Obsolete monogram and superseded footer CSS are removed. Historical R1/R2 design artifacts remain evidence; they are not production dependencies. Homepage tests use visible behavior, accessible names/descriptions, values and focus rather than CSS classes/test IDs.

## Font budget on `/`

| Measure | Before | After |
|---|---:|---:|
| Unique encoded font bytes requested | 583,164 (569.5 KiB) | 83,564 (81.6 KiB) |
| Resource transfer bytes including overhead | 586,764 | 85,664 |
| Encoded resource-entry sum | 583,164 | 101,488 |

**85.7% fewer unique font bytes; initial homepage is below 200 KiB.** The after capture starts a new private browser process. It has two Nunito resource entries (preload and CSS; the latter served from cache), so the encoded-entry sum double-counts that body. Both raw totals and the unique-URL total are recorded, not silently conflated. Initial measurement is English with the permanent three-script welcome band; selecting translated copy fetches another script subset. Sequentially trying every language accumulates extra bytes and is not a first-load measurement.

The before capture precedes font/legacy preload changes but includes the newly added same-file Nunito preload during HMR (zero body bytes for that extra request). Claude's earlier 574 KiB measurement is a separate run. Reproduce provenance, byte counts and SHA-256 using `subset-daybreak-fonts.py` and `font-subsets.json`. Every retained codepoint is verified after generation. Future translated-copy changes require regenerating these homepage-specific subsets.

This is actual local development network evidence, not production Lighthouse or acceptance of the earlier 550KiB total-page budget. Browser console includes the existing glossary 500 with absent local service-role credentials, and a Nunito preload-use warning despite the face being loaded; client-auth-delayed rendering/dev loading still warrants production performance review. No real credentials were supplied.

## BRAND-1 installable-app assets

| File | Dimensions | Purpose |
|---|---:|---|
| `public/icons/kairos-192.png` | 192×192 | PWA any; header/footer emblem |
| `public/icons/kairos-512.png` | 512×512 | PWA any |
| `public/icons/kairos-maskable-512.png` | 512×512 | PWA maskable |
| `public/icons/apple-touch-icon.png` | 180×180 | Apple touch icon |

Manifest **theme_color `#FFF7EE`**, **background_color `#FFF7EE`**. PNG canvases are opaque white to preserve the approved artwork. Maskable source is centered at 288×288; its entire square fits within the central 80%-diameter circle. `build-daybreak-icons.cjs` deterministically resizes the approved emblem without redrawing; `icons.json` records bytes/hashes. The approved wordmark was inspected; header/footer retain the full KairosLearn product name beside the emblem.

## Claude integration requests

1. **Pricing export needed:** add a browser-safe named `PRO_FAIR_USE` export to `src/lib/pricing.ts`, containing `coachMessagesPerDay` and `voiceMinutesPerDay`, synchronized with the enforced server limits. Then replace the generic homepage daily-fair-use sentence with imported values. This slice does not invent an export or duplicate the server numbers.
2. **Shared Footer.tsx:** swap in `DaybreakFooter` from `src/components/marketing/daybreak/DaybreakFooter.tsx` during refocus integration. Do not wrap it in a second footer landmark or render it twice on the Daybreak homepage, whose shell already includes it.
3. **Manifest:** wire the four files above with sizes/type `image/png`, `purpose: any` for ordinary PWA icons and `purpose: maskable` for the maskable file; use the two colors above. Wire the apple-touch file through metadata as appropriate. Manifest and shared Footer remain untouched here.
4. No requested design change in protected page/providers/middleware/settings/TopNav/sitemap/robots/llms/next.config. Retain the existing public Daybreak WOFF2 exception when Claude changes middleware. Review the four root font preload flags alongside Claude's separate layout edits.

## Verification

- Full source suite: **93 files / 632 tests passed**, exit 0. `node node_modules/vitest/vitest.mjs run src --config work-diary/daybreak-src-vitest.config.mts`. The literal `npx vitest run src` attempt failed because the shared dependency junction lacks `.bin/vitest.cmd`; direct package CLI uses the installed Vitest. Dedicated config never imports dotenv and excludes production fixtures. Output buffered until completion (260.18s), not a hang.
- Worker focused tests: 2 files / 38 passed, overlapping the full suite; do not add counts.
- Fresh TypeScript: exit 2, only inherited `AidExplainerLauncher.tsx:58` unsupported `preset`/aidContext props. No new Daybreak diagnostic; do not hide the incomplete aid feature.
- Production build: **inconclusive**. Direct installed Next CLI was stopped after several minutes without diagnostics or completion. No pass or specific compiler failure is inferred from that run; the earlier slice separately established this junction's Turbopack root restriction. Claude should verify the standard build with local dependencies after the inherited type repair.
- Targeted ESLint: exit 0, three advisory native-img warnings. Local emblem is 31,240 bytes reused in header/footer with explicit dimensions; illustration remains a tiny local SVG.
- `git diff --check`: clean for source changes. Protected-file diff: empty.
- Actual browser: 375×812 and 1440×900; all five quick-check languages render; no horizontal overflow and no sub-44px interactive targets in saved inspections. Every emblem loads. Grouped entries 45,000.50 − 23,000.40 − 1,000.05 return **USD 21,000.05**, focus `cost-result-title`, no live ancestor. `45,00` focuses the non-live error and marks its field invalid.
- Independent source reviewer found no confirmed new defect and identified the fair-use export handoff above. Final artifact review matched test totals, font/icon hashes, byte reduction and DOM claims; it found a minor missing space at a mobile-hidden footer line break. Explicit whitespace was added and the phone footer capture refreshed. Font shaping was visually inspected; native-speaker editorial review and real assistive-technology listening were not performed. DOM/focus evidence does not claim NVDA/VoiceOver validation.

Screenshots: [phone](d3-impl-1-1-evidence/home-375.png), [desktop](d3-impl-1-1-evidence/home-1440.png), [phone footer](d3-impl-1-1-evidence/footer-375.png), [desktop footer](d3-impl-1-1-evidence/footer-1440.png), full-page and translated captures in the same directory. Raw logs sit beside this report.

Antigravity was attempted first for routine implementation; its transport was closed. The bounded existing worker handled cost logic/tests, with root design/browser work and separate review. One browser only. Owned browser and preview server are closed; port 4180 confirmed closed. No shared dependencies were installed/updated, no `.env.local` read, no production DB tests, no production actions. The prior ignored dependency-copy artifact was not touched.
