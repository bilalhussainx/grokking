# Claude Code progress (read this instead of re-verifying)

Owner: the founder's Claude Code session. Astra (Codex) reads this file and
doesn't re-test what's recorded here. Newest work goes at the top.

## Queue

| # | Item | Status |
|---|---|---|
| 1 | Security holes (ownership and counselor review integrity) | **Done**: built, tested, live-verified, final review "ready to merge" (plans 1A and 1B). **Not deployed.** |
| 2 | Broken saves and dead pages: recommenders don't show after saving, transfer GPA dropped, Settings and net-price 404, Outline generation 500 (from Astra's D1) | **In progress**: `docs/superpowers/plans/2026-09-25-fix-2-broken-saves-dead-pages.md` |
| 3 | Bug fixes from `docs/superpowers/plans/2026-08-17-essay-studio-roadmap.md` (Tasks 2-11) | Queued |
| 4 | Stripe and credits for the new prices (Free 200 credits; $15/month; $99/year) | Queued |
| 5 | Competitor research, phone app (PWA), Ad Astra readiness, full testing of every student type | Queued |

## Security 1A — student-data ownership

Plan: `docs/superpowers/plans/2026-09-25-security-1a-student-data-ownership.md`.
Commits `2ae3862..cdb456a` on `feat/counselor-marketplace`. **Not deployed.**

Fixed. Each hole was proven by a failing test before the fix:

- `PATCH /api/cc/essays/[id]/draft`: any user could overwrite any essay's draft.
- `POST /api/cc/essays/[id]/share`: minted **or returned an existing** public
  share link for any essay.
- `POST /api/cc/essays/[id]/outline` (save): any user could overwrite any
  essay's outline.
- `DELETE /api/cc/courses`: deleted any student's course.
- `PATCH` and `DELETE /api/cc/recommenders/[id]`: edited or deleted any
  recommender (including the teacher's email). `ask-email-text` wrote onto any
  recommender.
- `POST /api/cc/intake/link`: handed the caller another anonymous student's
  orphan profile. The adoption was removed; sessions still link.

What's new:

- `src/lib/cc/ownership.ts`: `isUuid`, `getStudentProfileId`, `getOwnedEssay`.
- `src/lib/cc/__tests__/helpers/{fake-supabase,fixtures}.ts`: an in-memory
  Supabase for route tests. Reuse it, and import routes statically.
- `src/app/api/__tests__/ownership-contract.test.ts`: a static tripwire that
  fails the suite when any `api/cc` or `api/counselor` handler writes through
  the service role without ownership logic.
- `vitest.config.ts`: `testTimeout` raised to 30s. First-import cost under
  parallel load was timing out tests, including pre-existing ones.

Evidence: `npx vitest run src` → **426/426**; `npx tsc --noEmit` → 0;
`npm run build` → 0.

## Security 1B — counselor review integrity

Plan: `docs/superpowers/plans/2026-09-25-security-1b-counselor-review-integrity.md`.
Commits `f9f9caa..c80010a`. **Not deployed.**

- Counselor comments can only land on the named student's own essays
  (`EssayNotOwnedError` → 404). Before, a counselor could inject feedback into
  any essay whose id they knew.
- Counselors see only their own agency's comments, in both the essay view and
  the list counts. Students still see all shipped feedback on their own essay.
- Supervised counselors (`requires_review`) can no longer set the review state
  (403), and the UI shows them a note instead of the buttons. Heads get a
  **Publish to student** control on draft comments.
- Invite codes can only be preassigned to members of the head's own agency.

## Security verification (2026-09-25)

- **Live local checks** (dev server against the production DB, QA accounts only):
  - qa-s2 against qa-s1's essay got 404 on draft, share, and outline-save.
  - Random-uuid course and recommender DELETEs got 404. The real query chain works; no 500s.
  - qa-s1's essay was unchanged: 187 words, no share token.
  - As qa-c1, a cross-student comment got 404; the legitimate essay view and student file both got 200.
- **Fresh whole-branch review (opus): ready to merge, 0 Critical, 0 Important.**
  One minor was re-graded and fixed: a student with duplicate profile rows could
  get 404 on their own writes. Ownership now accepts every profile the user owns
  (`95cd4b6`).
- **Production data audit (read-only):**
  - 21 essays, **0** with a share token, so no essay was exposed through the share hole.
  - **0 of 6** essay comments sit on another student's essay, so no injection happened.
  - 0 of 50 users have duplicate profiles.
- Suite **446/446**, tsc 0, build 0.

## Known residuals (not fixed yet)

- Review state (`cc_essays.counselor_review_state`) is a single column, so two
  agencies linked to the same student share it. Per-agency state needs a
  migration.
- `recommenders/submission` doesn't verify that `studentSchoolId` belongs to
  the caller (the junk rows it can create are invisible to the other student).
  It and `canvas-extract` return 403 rather than 404.
- Invite preassignment is checked at mint time, not at redemption.

- Intake-completed anonymous profiles are no longer auto-adopted. A correct
  link needs a session→profile column (`cc_intake_sessions` doesn't record the
  profile it created).
- The static tripwire can't prove a write is scoped when an unrelated
  ownership lookup precedes it. Behavioral tests cover the known case.
- Pre-existing lint errors on the counselor student page (`set-state-in-effect`,
  two `<a>` navigation links) are untouched.
