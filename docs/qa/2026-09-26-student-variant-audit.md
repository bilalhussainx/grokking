# Every-student-type audit (2026-09-26)

## How it was run

Run 1 raw findings: `docs/qa/evidence/student-variants/findings-2026-09-26-run1.json`. The spec was later hardened: it now uses the app origin, records page errors, network failures, paywalls (402) and empty pages, and writes its evidence outside Playwright's wiped output folder.

- **Spec:** `tests/e2e/student-variants.spec.ts`.
- **Accounts:** `scripts/qa-seed-student-variants.mjs` created 8 QA students, one per dashboard variant: g9, g10, junior, three senior stages (writing, post-submit, decisions), transfer, and unknown grade. They're `e2e-v-*@test.local` accounts in production. New signups currently get a Pro trial, so these test as trial-Pro.
- **Setup:** the local dev server against the production database.
- **Pages** (9 per variant, at desktop 1440×900 and phone 375×812): `/cc/dashboard`, `/schools`, `/applications`, `/cc/essays`, `/cc/activities-optimizer`, `/cc/recommenders`, `/cc/net-price`, `/cc/interview-prep`, `/settings`.
- **Recorded:** our own `/api/` calls returning ≥400 (other than an intended 402), console errors, HTTP errors, redirects, and horizontal overflow.
- **Result:** 16 of 16 walk-throughs passed login and navigation in 19.3 minutes. There were 87 raw findings from 3 root causes.

**No horizontal overflow on any of the 9 walked pages, for any variant, at 375px.** None of these pages uses the marketing footer, so the walk doesn't exercise the footer fix in `5f687d1`. That fix was measured separately on `/` and `/pricing`.

## Findings by root cause

| # | Root cause | Affects | Severity | Owner |
|---|---|---|---|---|
| 1 | **`GET /api/cc/me` doesn't exist** (it's in no commit in git history) but four pages call it: `/schools` (`src/app/schools/page.tsx:114`), `/applications` (`ApplicationBoard.tsx:97`), home (`src/app/page.tsx:240`) and `/cc/transfer-profile` (`page.tsx:32`). The 404 is swallowed. | All 8 variants, desktop and phone (60 findings: 30 API 404s plus 30 console "Failed to load resource") | **Blocker for transfer students; major for everyone else.** Inferred from code (the walk didn't visit `/cc/transfer-profile` or `/`): `refresh()` returns early on a non-OK response, and `save()` posts all four fields. (a) International students are never flagged as international on the school list. (b) The applications board never loads affordability. (c) The home walkthrough is never personalized to grade or transfer. (d) **The transfer profile page never loads saved answers.** A transfer student sees an empty form, and saving posts blanks over their data. | **Fixed in fix-5b (`a223956`):** `GET /api/cc/me` added. Verified: the transfer profile shows the saved school, and `/api/cc/me` returns 200. |
| 2 | Console: "Error checking Cross-Origin-Opener-Policy: Failed to fetch" | All variants: 17 on `/cc/dashboard`, 1 on `/schools`, 1 on `/settings` (19) | Minor, console-only. The source is `@base-org/account` (Coinbase's SDK, pulled in by the Privy wallet provider, which was mounted on every page). | **Fixed in fix-5b (`041f2b0`):** Privy is mounted only on `/credentials`; 0 COOP errors after the fix. |
| 3 | g9 students are redirected to `/cc/dashboard` from `/applications`, `/cc/essays`, `/cc/recommenders` and `/cc/interview-prep` | g9, desktop and phone (8) | **Intended.** The middleware's `isGrade9BlockedPath` gates these stages. But it's **silent**: no message says why. | Codex session B (design): explain it, for example "Essays open in grade 11. Here's what to do now." See `docs/handoff/codex-prompts/session-b-note-02-variant-audit-design.md`. |

## Not covered by this pass

- **Free-tier behavior per variant:** the seeded accounts get the production signup trial (the header showed a 200-credit balance). Per-variant paywall behavior on the free tier isn't covered yet.

- **Form submissions:** this was read-only, so there's no evidence yet on saving, editing or deleting per variant. Individual flows were verified earlier in fixes 1–4.
- **Coach chat and voice:** both cost model calls.
- **Counselor flows:** they have their own `counselor` Playwright project, and the evidence is in `docs/handoff/claude-progress.md`.
- **Language switching** and real phone hardware (Safari/iOS).
