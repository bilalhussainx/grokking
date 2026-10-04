# S7 — Today dashboard and counselor work queue (effort: High)

## Why
- **Students:** Today must answer "what do I do now, and how far along am I?" with real data, not prose.
- **Counselors:** they need one screen that says who needs them today and why (D4.9). Today they get a roster and engagement columns only.

## Read first
- 03-DESIGN-DIRECTION §6.
- Amendment C (C1–C5, C7).
- `docs/qa/2026-10-03-student-workflows.md` §2 and the top-10 list.
- `docs/qa/2026-10-03-counselor-workflows.md`.
- Student code: `src/app/cc/dashboard/*` (`today-input.ts`, `today-model.ts`, the variants `dashboard-grade9`, `dashboard-junior`, `dashboard-transfer`), `src/components/cc/today/*` and `src/lib/cc/agent/journey-tools.ts` (`get_journey_state`, `NextAction`).
- Counselor code: `src/app/counselor/{dashboard,students}/**`, `src/hooks/useCounselorRole.ts` (shared lookup; don't add fetches), the agency-scope helpers in `src/lib/cc/` (`student-roster.ts`, `agency-membership.ts`) and `src/app/api/counselor/**`.

## Student: Today
1. **Next step card:**
   - the first open weekly-plan task (S4 `weekly_plan`), otherwise `get_journey_state().nextAction`;
   - shows a finish line ("Done when: 3 schools saved");
   - one primary button that opens the right screen through the same `navigate_to` allowlist (S5).
2. **Journey map:** the S5 milestones, compact, with the current one highlighted.
3. **Deadline countdown:** the next 3 deadlines from the student's applications, **from S3 evidence only**, each with a `CitationChip`. A deadline without evidence shows `NotVerified` with "I can check". Never invent one. Times keep their zone (e.g. "18:00 UK time").
3b. **Rule conflicts:** any S3 `checkList` conflicts, as `RuleConflictCard`s, above the countdown.
3c. **Pace:** Gentle mode shows only the next step and the map (the rest behind "Show more"); Full control expands everything (03-DESIGN §6).
4. **Essay pipeline:** per prompt (Common App, UCAS Q1–Q3, each supplement), a 4-stage strip: story → outline → draft → review. Derive it from `get_essay_status` plus `cc_stories` mapping.
5. **Kairos inbox** (flagged users): reuse `KairosInbox`. The dock stays the only Coach door. Remove `AskKairos` from Today if the dock covers it (C4).
6. Keep the grade 9, junior and transfer variants working: map each to the same layout with variant-specific next steps. Write one test per variant.
7. **Performance:** Today must render server-side with one data fetch (`today-input.ts`) plus at most one client fetch for the inbox. There's a known double fetch of `/api/cc/me` and `ensure-profile`; dedupe it here (shared promise or server prop) and measure before and after.

## Counselor: work queue
1. **Page:** make `/counselor/work` the counselor landing page. Redirect `/counselor/dashboard` there, or show both as tabs, and record the Ruling.
2. **Queue items** (server-computed, `src/lib/cc/counselor/work-queue.ts`):
   - `essay_review`: essays in `in_review` assigned to this counselor (heads: agency-wide), oldest first;
   - `comment_approval` (heads): draft comments from counselors flagged `requires_review`;
   - `stalled`: an assigned student with no activity for 10+ days (no turns, edits or task completions);
   - `deadline_soon`: an assigned student with a sourced deadline in ≤ 7 days and missing requirements;
   - `rule_conflict`: an S3 rule-engine conflict (or an S1/S4 `plan_conflict` nudge) on an assigned student (only students who share agent activity with their counselor; respect the share settings in `src/app/cc/share-settings`);
   - `referral`: an S10 `refer_to_human` item the student consented to share. Show the reason category only (e.g. "aid appeal", "accommodations"), never the conversation text.
3. **Each row:** student name, the reason in plain words, age, and one action (open essay review / approve comments / message student / open plan).
4. **Scope:** a counselor sees only assigned students and a head sees the agency. Use the existing helpers; tests must prove a counselor in agency A can't see agency B or unassigned students.
5. **Assign and reassign** (heads): from the queue or the roster, reassign a student's primary counselor. Audit it in an existing or new `cc_assignment_events` table (a migration file, not applied; stop at deploy).
6. **Counselor task to student:** "Add task to student's plan" creates a plan task marked `from_counselor` (proposal-free, since a human did it; it shows as "from your counselor").

## Tests first
- The work-queue builder is pure, with fixtures, one test per item type and ordering.
- The scope tests (agency A/B, counselor vs head, unassigned).
- The Today model per variant.
- A deadline without a source renders "check date".
- One Coach door on Today.
- Dedupe: rendering Today triggers one `/api/cc/me` request (fetch spy).

## Evidence
- Screenshots at 375 and 1440: Today for the 4 variants; the work queue with each item type; empty states.
- Load timing for `/cc/dashboard` and `/counselor/work` before and after (Playwright, warm, 3 runs each).

## Prod checks
1. The QA student's Today shows the next step, the map and the countdown (or "check date").
2. The QA counselor's `/counselor/work` renders within 3 s warm.
3. Scope: the QA counselor can't open a non-assigned student (403 or 404).
