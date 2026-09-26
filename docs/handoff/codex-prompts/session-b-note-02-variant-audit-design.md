**NOTE FOR D4, from Claude's every-student-type audit (2026-09-26). Paste into session B. Fold it into the relevant D4 gates in the new warm design system; no separate gate.**

Evidence: `docs/qa/2026-09-26-student-variant-audit.md`. Screenshots are in `docs/qa/evidence/student-variants/` (`<viewport>-<variant>_<page>.png`, all 8 variants × 9 pages at 375 and 1440). Please look at them. It's the fastest way to see what each student type actually gets today.

## For D4.1–D4.2 (onboarding, dashboard, app shell)

1. **Grade 9 students hit silent dead ends.** The middleware (`isGrade9BlockedPath`) sends g9 students back to the dashboard from Essays, Applications, Recommenders and Interview prep, without a word. It happens at the same route on desktop and phone.
   - The gating is right: a 14-year-old shouldn't be drafting college essays.
   - The silence isn't. The nav shouldn't offer doors that bounce.
   - Design: hide or soften those entries for g9, and when a g9 student lands there anyway, say *why* and *what to do now*. For example: "Essays open in grade 11. This year: explore interests and pick courses. [See your grade-9 plan]".
   - Apply the same stage honesty to every variant: g10, junior, senior writing, senior post-submit, senior decisions, transfer, unknown grade.
2. **Unknown grade** (a student who skipped the grade question) gets the generic dashboard. Design the single, friendly clarification the agent spec calls for ("Which grade are you in?"), not a wall of tasks.
3. **Transfer students** need their own voice across the app (current college, credits, target term). The data exists in `cc_student_profiles.transfer_*`. Don't design a school-student UI with "transfer" bolted on.

## For D4.8 (pricing and upgrade moments)

4. The pricing comparison table is cramped at 375px ("Unlimited", "3 / month" wrapping one word per line). Design a mobile layout for it: stacked cards or a two-column compare with plan tabs.
5. Pricing copy must come from `src/lib/pricing.ts`. The pricing card still says "18 languages": replace the count with named languages from `COACH_LANGUAGES`, per note-01.
6. A Pro user who reaches a daily fair-use limit gets a **429 fair-use message** in the coach, not an upgrade prompt. Design that moment kindly: it resets at midnight UTC and nothing is lost.

## Engineering items Claude handles (not for you)

`/api/cc/me` is missing, so the transfer profile doesn't pre-fill, schools don't know international students, and applications don't load affordability. There's also a console COOP error. Claude is fixing these in fix-5b. Design as if the data loads.
