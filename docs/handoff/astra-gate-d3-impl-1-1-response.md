**GATE D3-IMPL-1.1: ACCEPTED and integrated.** Paste into session B.

Claude merged `design/daybreak` (`baea252`, `44f49a3`) into the release candidate `refocus/admissions-only` at `04a87f2`, then made your three integration requests.

**Integration:**
1. `src/lib/pricing.ts` exports `PRO_FAIR_USE = { coachMessagesPerDay: 300, voiceMinutesPerDay: 120 }`. The server limits in `tier-gate.ts` default to it, and the homepage Pro card now reads "Fair use: up to 300 coach messages and 120 voice minutes a day."
2. `MarketingShell` (`/pricing`, `/stories`, `/product/*`) renders `DaybreakFooter`. The unused `components/layout/Footer.tsx` was deleted.
3. The manifest carries your three PNG icons (any, any, maskable) with `#FFF7EE` for both colors, and the Apple touch icon is set through metadata.

**Verified on a production build (`next start`):**
- The build succeeds and tsc is 0. The inherited aid-explainer error was already fixed on this branch.
- `npx vitest run src` passes: 109 files, 707 tests.
- First load: `/` 478 KiB (fonts 82), `/login` 455 KiB, `/pricing` 636 KiB. Pricing grew 46 KiB because it now loads `daybreak.css` and Nunito for the footer.
- Signed-out pages at 375 and 1440 have no overflow and no page errors. The icons are served.

**Known transition:** the `MarketingShell` pages still use the navy header with the gold "k" monogram above your warm footer with the BRAND-1 emblem, so there are two logos on one page. It resolves when D4.8 redesigns pricing. Don't patch it separately.

**Before D4.2, rebase your branch.** The product is now admissions-only; the study courses are gone and about 1,560 files were deleted. In `../grokking-daybreak`, run `git merge refocus/admissions-only` (Claude's branch lives in the same repo) and resolve on the admissions-only tree, so you never design against deleted pages.

**Next: D4.2, student dashboard, app shell and mobile navigation** (kickoff §D4.2). Fold in:
- `docs/handoff/codex-prompts/session-b-note-02-variant-audit-design.md`: grade-stage honesty, unknown grade, transfer voice.
- `docs/handoff/codex-prompts/session-b-note-03-predeploy-findings.md`: legibility, and the Settings items.

Design the admissions-only signed-in navigation: dashboard, Coach Kairos, school list, applications and deadlines, essays, activities, aid and net price, interview prep, and family mode, plus the counselor workspace nav. The coach's proactive greeting is effectively off, because sessions no longer land on `/`; decide where it belongs.

Mock first at 375×812 and 1440×900, then stop at **GATE D4.2**. The rules are unchanged.
