# Counselor and agency workflow validation (prod, 2026-10-03)

Site: https://www.kairoslearn.com (master 7c58b6c). Code read from `grokking-integrate` (branch refocus/admissions-only). Evidence: `counselor-evidence/` (screenshots, d = 1440x900, p = 375x812). Scripts: `counselor/*.mjs`.

## Accounts and data I created (all QA)
- `bilalhussain.v1+qa-oct03-counselor@gmail.com` (head of new agency "QA Oct03 Counseling", slug `qa-oct03-counseling`, counselor slug `qa-oct03-counselor`)
- `bilalhussain.v1+qa-oct03-student@gmail.com` (linked via code `QA-OCT03-COUNSELING-CPH67R`, now 1/1 used)
- `bilalhussain.v1+qa-oct03-c2@gmail.com` (added to the oct03 agency as a plain counselor, used for permission tests)
- No comments or approvals were posted on QA student 1's essay (see Limits). The counselor profile edit was NOT saved.

## Limits of this run (be honest)
- Posting a comment on essay `86c5d33e...` was blocked by the permission classifier on my second attempt, so the comment/approve write path and the student-side view of results are NOT verified. I read the code (`api/counselor/students/[studentId]/essays/[essayId]/route.ts`) instead.
- Production was badly degraded late in the run: `/counselors/qa-oct03-counselor` took 7.7s, 9.5s, 19s, 29s and 60s on repeated requests (other pages 0.1-0.3s), and email login timed out at 90s. Profile-editing save and phone marketplace views could not be completed. Treat the slowness as a finding but possibly partly load from other audit agents running concurrently.
- Phone views done: head dashboard/roster/team/profile/services/payouts, student detail, empty counselor roster. Phone views not done: signup, join, marketplace.
- `e2e-head@test.local` exists and logs in (head of a different agency, used only for cross-agency checks). Other variant students not touched.

## 1. Counselor signup from scratch (qa-oct03-counselor)
Worked: `/product/counselor` has "Set up your counselor workspace" (-> `/signup?next=/counselor/onboard`); signup then lands on `/counselor/onboard`; claiming a profile lands on the dashboard; the dashboard shows a "Set up your student workspace" card; creating one lands on Team & invites; minting a code works.

Broken
- Minor/Major: after signup, a LATER plain login (no `?next`) for someone who has not yet claimed a counselor profile lands on `/onboarding`, the student "What language do you think in?" flow. Observed on first re-login of qa-oct03-counselor. Abandoning onboarding strands them in the student product.
- Major: `agencySlug` on onboard silently attaches the new counselor to ANY existing agency by slug with no approval (`src/lib/cc/counselor-helpers.ts:72-79`, `ensureCounselorProfile`). Anyone can claim affiliation with another agency and appear on its public page (`/agencies/[slug]` lists by `agency_id`). Not exploited on prod; code evidence only. The field is also explained only as "If you work with an existing agency, enter its slug".

Confusing
- Major: no path from the homepage for a counselor. Homepage has zero counselor/agency links (only "For families"). The nav item "COUNSELOR" is the AI counselor (Coach Kairos) page for students; the human-counselor CTA is hidden at the bottom of that page. Pricing has no counselor/agency tier at all.
- Major: two competing concepts of "set up". `/counselor/onboard` copy says "Phase 1 is a minimal claim. Stripe Connect... unlock once your profile is verified" (internal jargon, not a counselor's concern), asks for an "agency slug", and does not mention workspaces. The real next step (create workspace) only appears as a card on the dashboard. Until a workspace exists the sidebar hides Students and Team (`n-dashboard-fresh-d.png`).
- Minor: the dashboard's header cards (Inbox/Active/Sessions/Active services) and the checklist ("bio, publish a service, get verified") are about the marketplace, not about students. Nothing says "invite your first student".
- Minor: the join link for students signed out goes to the generic "Sign in to continue learning" screen, with a "Counselor or agency? Sign in to your workspace" link that a student may click by mistake. It never says "You've been invited by X" (`j-signedout-d.png`).

## 2. Head counselor (qa-c1): roster, student view, team, codes
Worked: roster lists 14 linked students with name, grade, state, profile %, linked date, "joined via code"; Team page lists members, role, requires-review flag, codes with usage/status/copy link/revoke; minting works.

Broken
- Major: student detail header shows "Unnamed student" for QA Student One and for the new oct03 student, while the roster shows the proper name. The roster has an auth-metadata name fallback (`student-roster.ts:~85`) but `api/counselor/students/[studentId]/route.ts` does not, so the detail page and "They'll appear here once Unnamed starts drafting" copy are wrong.
- Minor: on an essay already "Approved", both "Request changes" and "Approve" remain enabled. The page's review buttons ignore failures: `setReview` (`students/[studentId]/page.tsx:126-138`) never reads the response, so a supervised counselor who gets a 403 ("Review decisions need your head counselor") sees nothing happen.
- Minor: Team "Add counselor" takes ~4s+ and shows no progress; the list did not update within 3.5s and I initially thought it failed (the second click then returned 409). Cause: `api/counselor/members/route.ts:76` scans `auth.admin.listUsers({page:1, perPage:1000})` for the email, which will also fail with "user not found" once the platform exceeds 1000 users.

Confusing
- Major: the roster cards show "School not set" for 14 of 14 students, "Grade" and a profile %. The detail page shows: grade, Pro badge and essays. It does NOT show target schools, application deadlines, activity, last login, intake answers, tests or aid status. The spec in the task asks what a counselor can see about schools/deadlines/activity: nothing today.
- Minor: "2 shipped / 2 notes" on the essay card is unexplained jargon; comments show no author or role, so a counselor cannot tell their own from a colleague's.
- Minor: the head's roster mixes in 14 QA test students with generic IDs ("bcb6a283") under each name, no search or filter, no sort by need.
- Minor: Team page keeps every used-up code forever (14 on qa-test-agency) with no hide/filter.
- Polish: on phone the Team tables are clipped horizontally: "Joined" is cut off and the copy link/revoke column is off screen (`c1-team-p2.png`). The black panel stops mid-screen on a cream page.

Missing
- Major: a head cannot assign or reassign students to counselors in the UI. The Team page always mints `maxUses: 1` with no assignee (`team/page.tsx:107`), and redemption falls back to the first head (`invite-codes.ts:169-170`). The API supports `preassignedCounselorUserId` (`api/counselor/invite-codes/route.ts:41,59`) and there is no reassign endpoint (grep for `primary_counselor_user_id` finds no update). So the "counselor sees only assigned students" model has no way to ever get a student for a counselor. An empty counselor roster says "Students assigned to you will appear here once they join", which cannot happen.
- Minor: codes are single-use only in the UI, so a head must mint one per student; no cohort codes, no expiry, no email send.

## 3. Invite redemption
Worked via login path: with `/login?next=/join/<code>`, sign-in redeemed (`POST /api/counselor/join` 201), the page said "You're linked to QA Oct03 Counselor at QA Oct03 Counseling", and the student appeared on the head's roster ("QA Oct03 Student", linked 03/10/2026, joined via code). Team page then showed 1/1 used up.

Broken
- Major (needs one more repro): via the signup path (`/signup?next=/join/<code>`, email signup) the page loaded `/join/<code>` but remained "Checking your session..." for 8s and no join POST fired; the student ended up unlinked until I logged in again. Possibly caused by the slow period but the first thing a new invited student sees is a stall. The `ran` guard in `join/[code]/page.tsx:25-34` is the likely place: if `user` is still null when `authLoading` flips, it redirects to login instead of waiting.

Confusing
- Major (consent): linking is automatic with no confirmation. A 16-year-old is linked and told "They can now see your essays, school list and progress" AFTER the fact, with no opt-out/unlink anywhere I could find.
- Minor: new student shows "Grade —", "School not set", profile 0%, "Pro active" on the counselor view (trial shown as Pro).

## 4. Essay review loop (QA student 1, essay 86c5d33e...)
Verified (read-only): head can open the essay (draft text, 187 words, state Approved) and sees two shipped comments (17/08 and 25/09) plus "Send feedback" and Request changes/Approve buttons; direct API GET works (200).
Not verified: posting a comment, request-changes/approve, and what the student sees (blocked, see Limits).
From code: supervised counselors' comments are forced to draft and the head must "ship" them; supervised counselors cannot approve at all (403, but the UI hides the error). Comments are not range-anchored in the UI (the API supports `rangeStart/rangeEnd`; the page only sends a body), so feedback cannot point at a sentence.
Phone: the essay opens below the list; the composer is ~1800px down the page.
Missing: no notification to the counselor when a student resubmits (nothing on the dashboard references essays), no inline comments, no version history/diff.

## 5. Permissions (important: authorization held)
Tested with API calls from signed-in sessions:
- Plain counselor (qa-oct03-c2, no assigned students): `GET /api/counselor/students` returned `[]`; student `bcb6a283` (in the same agency, unassigned) 403 "student not on your roster"; QA student 1 (other agency) 403; QA student 1 essay 403; `/counselor/team` redirects to dashboard; invite-codes 403 "head only"; UI direct URL shows "student not on your roster".
- Other agency head (e2e-head): QA student 1 and the oct03 student both 403, including the essay endpoint.
- Findings: Minor information exposure: a plain counselor can `GET /api/counselor/members` and sees all members' user IDs/roles/requires-review flags (200). Low severity. The agency membership lookup is `getAnyAgencyMembership`, so someone in two agencies sees only one (edge case).
- Requires-review settings: toggle exists on Team page (per-member) and at creation ("drafts need review"); the effect is described only in code, and the counselor is never told in the UI that their comments are held. I did not test with a supervised account.

## 6. Marketplace
Signed out: `/find-counselor` renders filters but shows "No counselors match your filters. Try widening the search."; `/api/counselor/search` returns `{"counselors":[],"count":0}`. The directory is verified-only (`api/counselor/search/route.ts:~43`) and no counselor is verified, so the marketplace is empty on prod today.
- `/counselors/qa-oct03-counselor` (unverified, unpublished) is publicly reachable by URL, shows "0 sessions", a raw language code "en", and "This counselor hasn't published bookable services yet." Minor/Major trust issue: unverified profiles are linkable, though not listed. It was extremely slow (see Limits).
- `/agencies/qa-test-agency` shows "No counselors listed yet for this agency." even though the agency has two counselors (listing is filtered, unexplained).
- Profile editing: form fields in code (display name, headline, bio, photo URL, years, rate, languages, accepting toggle). "Photo URL: direct link" and "Comma-separated ISO codes" are developer-grade; no upload. Not saved (see Limits). Services page and Payouts page show only a spinner for 6-10s (services API took 9.7s), and payouts "Checking status...".

## 7. Counselor billing and plan
- Settings shows a counselor "Plan & billing: Pro trial... trial ends Oct 10, 2026... 400 credits" which is the student plan; "Your account role and your plan are different things" is stated, but nothing explains what a counselor or an agency pays. Pricing page lists only Free/Pro student plans ($15/month).
- The only counselor money statement: Payouts page "KairosLearn keeps a 10% platform fee" on student bookings. Nothing about seats, per-student, or agency fees. Not clear whether running a roster with invite codes is free, and a counselor will see "Pro trial ends Oct 10" with no guidance on what happens to their students afterwards.
- No checkout touched.

## 8. Day in the life: "which student needs me today and why?"
Cannot be answered in 30 seconds. The roster has no sort, no "waiting on you" signal, no unread essay/resubmitted flag, no last-active, no deadlines; the dashboard is about marketplace engagements and shows zeros. A counselor would have to open each student and each essay. For the 14-student qa-c1 roster that is 14 page loads. This is the biggest product gap.

## Top 10 counselor-experience fixes, ranked
1. Make the roster a work queue: per-student "needs you" reason (essay resubmitted, comment awaiting, deadline in N days, inactive N days), default sort by urgency, and surface the same on the dashboard so the day-in-the-life question is answered in one screen.
2. Enrich the student view with target schools, deadlines, activities, recent activity, last login, tests/aid status. Today it shows only grade, Pro, and essays.
3. Let heads assign and reassign students to counselors (assignee dropdown on code mint, "Assign" on the roster, reassignment API). Without it the head/counselor model is unusable.
4. Fix the student-detail header name ("Unnamed student") by reusing the roster's name fallback, and the "Unnamed starts drafting" copy.
5. Make review actions reliable and clear: show errors from `setReview` (403 for supervised counselors), disable Approve on already-approved essays, label comment author/role, and add inline range comments.
6. Give the invite flow consent and context: an "X invited you to share your essays, school list and progress" confirm screen before linking, an unlink option, and a signed-out landing that says who invited them; fix the signup -> /join stall (wait for auth before redirect).
7. Unify counselor onboarding: one flow "claim profile + create workspace + invite first student" (remove "Phase 1" jargon and the agency-slug field, or require approval to join an existing agency), and add counselor/agency entry points to the homepage, nav and pricing.
8. State the counselor/agency pricing and plan clearly: seats, fees, 10% booking fee, and what happens when the Pro trial ends; stop showing the student "Pro trial" box as the counselor's plan.
9. Fix performance: public counselor profile (7-60s observed), services/payouts (~10s), Add counselor (listUsers scan; replace with an email-indexed lookup), and give the roster/services pages skeletons rather than "Loading...".
10. Phone polish and marketplace readiness: make the Team/code tables responsive with the copy/revoke actions visible, hide used codes, make essay composer reachable without long scrolling, and either verify at least one counselor or show an honest empty state for the directory; stop exposing unverified/unpublished profiles by URL.
