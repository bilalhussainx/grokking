# Pre-deploy workflow QA: 2026-09-27

**Verdict: NOT READY TO DEPLOY.** Five student-facing defects would hurt real users on day one. The biggest is that the Pro checkout charges a different price, with no trial, from what the site advertises. Also, the build I tested is older than the branch head (see "Build under test"), so the release build still needs a re-run.

Tester: Claude (QA agent), Playwright scripts driving headless Chromium against `next start` on http://localhost:3100. The server talks to the production Supabase database.
Evidence: `docs/qa/evidence/predeploy-2026-09-27/workflows/` (234 files: PNG screenshots plus a `*-result.json` / `*-sweep.json` per script).

## Build under test (read this first)

- The running server (`next start -p 3100`, process started 14:13) serves `.next/BUILD_ID = 8H6uR30l3I_mqF4Z4OHny`. That build was written **2026-09-27 00:27 -04:00**, so it contains commits up to about `af42a54` (00:25).
- `refocus/admissions-only` HEAD is now `369a54b` (14:49). About ten fix commits landed **after** the build, while this QA was running: `bc1172d` (retire /landing), `6b9878c` (signup credits copy), `3ee30e9` (public counselor search), `6cbbd13` (phone sign-out, empty-deadline and transfer links), `8813b9a`, `ee1cc0f` ("no dead Attach or forced coach", invite codes, onboarding copy), `369a54b`.
- Some findings below may already be fixed in HEAD. Those are marked **(HEAD may fix: <commit>)**. I have not verified any of them. As instructed, I did not rebuild. **The release build must be re-tested before deploy.**

## Workflow results

| # | Workflow | Desktop 1440 | Phone 375 | Result |
|---|---|---|---|---|
| W1 | New student via counselor invite → linked → roster by name | PASS (see W1 caveat) | PASS | **PASS**, with one should-fix (TopNav "Sign Up" drops the invite) |
| W2 | Schools, activity, recommender, application status; logout/login persistence | PASS | PASS (render only) | **PASS**. Should-fix: coach auto-opens over /schools; tracker says "No upcoming deadlines" |
| W3 | Transfer student fields incl. GPA survive reload and re-login | PASS | PASS (render only) | **PASS**. GPA is editable only on /profile, not in the transfer profile |
| W4 | /settings, /cc/net-price, /pricing → Stripe | FAIL | FAIL | **FAIL**: checkout price/trial mismatch, referral link `/ref/null` returns 500, net price shows "0 of 0 schools" |
| W5 | Essay Studio full path on a fresh essay | FAIL | PASS (no overflow) | **FAIL**: themes dead end plus raw markers, theme pick and outlines lost on reload. Outline generation itself works (QA-60 OK). AI never wrote prose. |
| W6 | Counselor comment and request-changes → student sees it in Revise and Brainstorm | PASS | PASS | **PASS** |
| W7 | Coach continuity across logout/login | PASS | n/a | **PASS**: recalled the robotics fact and both schools |
| W8 | Stage-appropriate behaviour (g9, senior-decisions, unknown grade) | PASS | PASS | **PASS**. Copy bug: "unlock tools tools" |
| W9 | Retired product routes | PASS | PASS | **PASS signed in.** Signed-out `/landing` still renders the old landing page instead of "/", and phone throws React #418 (HEAD may fix: bc1172d) |
| W10 | Guest homepage check, guest coach | PASS | PASS | **PASS**. No guest coach: every app route sends you to /login |

## Release blockers (would hurt a real student on day one)

1. **Pro checkout does not match the advertised price or trial.** `/pricing` and the homepage say "$15/month" and "Free 7-day trial. No card required." Signed in as a new student who is already in the trial, I clicked "START PRO — $15/MONTH". It opened a **live-mode** Stripe checkout (`cs_live_…`) showing **"Subscribe to KairosLearn Pro, US$12.00 per month, Total due today US$12.00"**, with no trial. I stopped at the checkout page and did not pay. Evidence: `w4b-A-desktop-03-after-start-pro.png`, `w4b-A-desktop-02-pricing-top.png`, `w10-desktop-01-home.png`.
2. **The brainstorm dead-ends when the coach offers themes.** On the live turn the coach replied "…Which of these feels most like the essay you actually want to write?" but **no themes and no chips were shown**, so the student has nothing to pick. After a page reload the chips appear, but the transcript then shows raw `<<THEMES_READY>> … <<END_THEMES>>` markers. Evidence: `w5b-turn2-desktop-02-turn2.png` (live, empty), `w5b-look-desktop-01-open.png` (after reload, raw markers).
3. **Essay progress is lost on reload.**
   - (a) Picking a theme and pressing "Continue with 1 theme" makes no API write. After a reload the essay is back in Brainstorm. Evidence: `w5b-pick-*` shows no POSTs; `w5b-outline-*` shows the stepper back on Brainstorm.
   - (b) Generated outline options are not persisted. On return, the Outline phase says "Based on the themes you picked — (no theme selected)… Generate 3 outline options" (`w5c-desktop-01-draft.png` from the first attempt, and `w5c-*result.json`). After a draft exists, the Outline phase shows "Coach Kairos was supposed to draft three structurally different paths. Regenerate to get the full set." (`w5d-phone-02-outline-full.png`).
   - Impact: students re-spend AI credits. It also pushed this QA one AI call over the W5 cap.
4. **Net price is empty for a student with schools on their list.** New student A has University of Michigan and University of Toronto (confirmed via `/api/cc/school-list`). `/cc/net-price` shows "CATALOG 0 of 0 schools covered". `POST /api/cc/net-price` returns `estimates: [], uncovered: [], catalogSize: 12`, so the school names never reach the estimator. The page also shows the raw enum "AFFORDABILITY under_10k" for a student who never entered affordability. There is no form, so no estimate could be run. Evidence: `w4b-A-desktop-01-net-price.png`, `w4b-A-desktop-result.json`.
5. **The referral link is `/ref/null` for every account I checked, and it returns HTTP 500.** On /settings, "Refer a Friend" shows `http://localhost:3100/ref/null` for the new student and for qa-s1. Opening it gives HTTP 500 and the "Something went wrong" page. Evidence: `w4-desktop-01-settings.png`, `w4-phone-ref_null.png`, `s1set-desktop-sweep.json`.
6. **Process blocker:** the build under test is older than HEAD (see above). Re-run W1, W4, W5 and the re-checks on the real deploy build.

## Should fix soon

- **The invite is lost through the header "Sign Up" button.** A signed-out student opening `/join/<code>` lands on `/login?next=/join/<code>`. The in-form "Sign up" link keeps `next=` and works (W1 phone passed end to end). The TopNav "Sign Up" button next to it goes to plain `/signup`, and the student ends up unlinked. Reproduced in W1 desktop: account A was created unlinked and I linked it afterwards by revisiting `/join/<code>` while signed in. Evidence: `w1b-desktop-result.json` (`login page signup links`), `w1-desktop-result.json`.
- **The coach auto-opens on every /schools visit.** On phone it covers the whole school list and has to be closed each time. On desktop the 400px panel covers the "+ Add" buttons (Playwright could not click "+ Add" until the panel was closed). This is audit re-check #9: FAIL. (HEAD may fix: ee1cc0f "no … forced coach".) Evidence: `w2-desktop-01-schools.png`, `w2-phone-schools.png`.
- **/pricing ignores signed-in state.** It shows "SIGN IN / START FOR FREE", and the "START FREE" / "START PRO FREE" CTAs go to `/intake` → `/signup?next=/` for a student who is already signed in and in the trial. Evidence: `w4b-A-desktop-02-pricing-top.png`.
- **Credits copy is inconsistent.** `/signup` says "Free 7-day Pro trial for students — 300 AI credits included". `/login` says "Get Started Free — 200 Credits". The homepage says "200 credits, once at signup". Settings shows 200 "Free trial credits — expires October 4, 2026". (HEAD may fix: 6b9878c.) Re-check #13: FAIL.
- **Application tracker says "Next deadlines: No upcoming deadlines"** after Michigan was set to RD. Michigan's card shows "Feb 1". Evidence: `w2b-desktop-02-after-edits.png`. (HEAD may fix: 6cbbd13 "honest empty-deadline".)
- **/find-counselor for signed-out visitors:** `GET /api/counselor/search` → **401**, and the page shows "No counselors match your filters". Re-check #8: FAIL. (HEAD may fix: 3ee30e9.) Evidence: `recheck-08-find-counselor.png`.
- **Glossary:** `/api/cc/glossary` returns `{"terms":[]}`, and signed-out `/glossary` redirects to the login page. Re-check #15: FAIL. Evidence: `recheck-15-glossary.png`.
- **Settings page:**
  - The "Subscription" card has no button or link to the Stripe portal; it is text only.
  - "Role: pro" is shown for a trial student.
  - "Login Streak 1 days" is a gamification leftover with a grammar error.
  - The "Copy" button did not change to "Copied" (the clipboard did receive the link).
- **Transfer profile:**
  - `/cc/transfer-profile` has no GPA field. The onboarding transfer GPA can't be edited later; only the HS-style "GPA (unweighted)" on `/profile` exists.
  - Once the profile is filled, the dashboard has no link back to it.
  - "CREDITS TRANSFERABLE" stays "—" after saving 34 credits.
  - Saving with an empty reason turns "Why transfer: —" into a blank.
- **Theme extraction is too greedy.** qa-s1's "Directions" chips include outline section labels such as "Opening (lines 1-3)", "Rising action (paragraphs 2-3)" and "Crisis (paragraph 4)". Evidence: `recheck05-s1-phone-02-brainstorm.png`.
- **The review score looks inflated.** A 138-word fragment (of 650) scored "90/100 · STRONG" with no note about length. It does not rewrite prose; the notes are questions. Evidence: `w5c-desktop-02-review.png`.
- **Brainstorm replies are slow.** Turn 1 had not rendered after about 30s, although it was present on reload. Later turns took about 12s.
- **Toronto saved card says "Location unlisted"** while browse shows "ON, Canada". The cost is not shown as $0 (QA-35 OK).

## Design and copy (for Codex)

- The `/counselor/team` invite table at 375px is clipped: the "copy link" and "revoke" columns are cut off inside `overflow-hidden`. The "Label (optional…)" label is 10px and the helper text is 11px. Evidence: `w1-phone-02-team-minted.png`.
- The Brainstorm composer at 375px clips its placeholder to "Type your / thou…" on two cut lines. Evidence: `w5d-phone-02-brainstorm.png`, `recheck05-s1-phone-02-brainstorm.png`.
- The Revise phase bar at 375px clips the 4th step ("Revis…", "Score… 3 note…"). Evidence: `w5d-phone-01-revise.png`.
- Draft coach copy says "tap a prompt on the right". On phone the prompts are a tab below.
- The unknown-grade dashboard says "Finish the intake to unlock **tools tools**." Evidence: `w8unk-desktop-cc_dashboard.png`.
- The login page still says "Sign in to continue learning", a learning-product leftover.
- The dashboard still has a "DAY STREAK —" / "STREAK —" tile, a gamification leftover.
- Body copy under 12px:
  - Dashboard priority captions are 11–11.5px ("Take a diagnostic SAT or ACT this fall…", "Transfers need college, not high-school recs.", the g9 captions).
  - Outline section bullets in Draft are 11–11.5px.
  - Brainstorm direction chips are 11.5px.
  - The homepage "No signup. Your answers stay on this page." line is 11px.
- The onboarding transfer placeholder says "Coach Kairos will draft your transfer essay from this". That conflicts with the "you write every essay" promise.
- There is no horizontal page overflow at 375px on any page I visited.

## Per-workflow detail

### W1: New student via counselor invite (audit QA-23, top-10 #9)

| Step | Expected | Actual | Result | Evidence |
|---|---|---|---|---|
| qa-c1 → /counselor/team → mint code with label | Code appears, 0/1 active | `QA-TEST-AGENCY-F4MBPB` (desktop), `QA-TEST-AGENCY-4XJAQ5` (phone); "copy link" put `http://localhost:3100/join/<code>` on the clipboard | PASS | `w1-desktop-02-team-minted.png`, `w1-phone-02-team-minted.png` |
| Signed-out visitor opens /join/<code> | Sent to sign in, then brought back | Redirected to `/login?next=%2Fjoin%2F<code>` with the copy "Taking you to sign in…" | PASS | `w1-*-03-join-signedout.png` |
| Sign up (in-form "Sign up" link) | Invite kept | Phone: `/signup?next=/join/<code>` → after "Create Account" landed directly on `/join/<code>` → "You're linked to QA Counselor One at QA Test Agency." No code re-entry. | PASS | `w1-phone-05-after-signup.png` |
| Sign up (TopNav "Sign Up") | Invite kept | Desktop: plain `/signup` → `/onboarding`, **not linked** (`/api/cc/my-counselor` → `counselor:null`) | FAIL (should-fix) | `w1-desktop-result.json` |
| Onboarding, grade 11 | Completes to the dashboard | Language → path → grade 11 → concerns → `/cc/dashboard` | PASS | `w1c-desktop-onboarding-*.png`, `w1-phone-onboarding-*.png` |
| Dashboard shows the counselor | Clear counselor chip | "Your counselor: QA Counselor One · QA Test Agency" at the top | PASS | `w1c-desktop-02-dashboard.png`, `w1-phone-07-student-dashboard.png` |
| qa-c1 /counselor/students shows the student by name | Name, not "Unnamed" or a UUID | "QA Workflow 0927" and "QA Workflow 0927 Phone", Grade 11, "joined via code". A short id is shown under the name (`c8374d44`), which is fine. | PASS | `w1b-desktop-04-roster.png`, `w1-phone-08-counselor-roster.png` |

No `ensure-profile` 500 and no failed API calls during either signup (QA-02 OK).

### W2: Progression and persistence (new student A, grade 11)

- /schools: the coach panel auto-opened. After closing it I searched and added "University of Michigan-Ann Arbor" ($13,138 net, Feb 1, Test Optional) and "University of Toronto" (43% accept, **no price shown, not $0**). The list reads "My Schools (2)", Uncategorized. Evidence: `w2-desktop-02/03/04*.png`.
- /cc/activities-optimizer → "Add manually" → "Build lead / School Robotics Team" saved. Evidence: `w2-desktop-06-activity-saved.png`.
- /cc/recommenders → Add "Ms. QA Rivera, AP Physics" (no email entered): `POST /api/cc/recommenders` 200, the row is listed, and **it is still listed after reload** (QA-27/37 OK). Evidence: `w2-desktop-08/09*.png`.
- /applications: this is a kanban board; clicking a card expands its plan and status selects. I set Michigan to plan RD, status "in progress" and checked "Common App": three `PATCH /api/cc/applications/update` calls, all 200. It moved to IN PROGRESS, 1/7. Evidence: `w2b-desktop-02-after-edits.png`.
- After logging out and back in, all of it persisted: 2 schools, the activity, the recommender, Michigan RD in progress 1/7. Evidence: `w2-desktop-13*.png`, `w2b-desktop-03-relogin-apps.png`.
- The dashboard changed accordingly: the hero moved from "Start your school list" to "Take a diagnostic SAT or ACT… You've started the school list", and it shows "2 SCHOOLS LISTED" and "1 ACTIVITIES". It does **not** claim "All deadlines logged" (QA-13/33 OK for this student). However, the tracker shows "No upcoming deadlines" even though Michigan has Feb 1 RD. Evidence: `w2b-desktop-04-dashboard.png`.
- Phone: all five pages render without overflow. /schools opens the coach full screen. Evidence: `w2-phone-*.png`.

### W3: Transfer student (e2e-v-transfer)

- Dashboard is in transfer mode: "Refine your why-transfer essay", professor recs, credits tile. Evidence: `w3-desktop-01-dashboard.png`.
- **Where to edit transfer info:** `/cc/transfer-profile` (current school, credits, target term, why) and `/profile` → Academic (GPA). The dashboard links to the transfer profile only while it is incomplete.
- Credits changed from blank to 34 (`POST /api/cc/transfer-profile` 200). GPA (unweighted) on /profile changed from blank to 3.58 (`PATCH /api/cc/profile/academic` 200). Both survived reload **and** re-login. Evidence: `w3-desktop-03/05/06*.png`, `w3-desktop-result.json`. PASS.
- There is no GPA field in the transfer profile form (fields: Current school, Credits completed, Target term, Why). Phone views have no overflow (`w3-phone-*.png`).

### W4: Settings, aid, pricing

- /settings has no XP, gems or sound sections. It still shows "Login Streak" and "Role: pro". The Subscription card has no action. Referral link is `/ref/null` → 500 (blocker). Evidence: `w4-desktop-01-settings.png`.
- /cc/net-price loads but shows "0 of 0 schools covered" (blocker). There is no input form, so no estimate could be run. Evidence: `w4b-A-desktop-01-net-price.png`. qa-s1 (no schools) shows the same page (`w4b-s1-phone-01-net-price.png`).
- /pricing signed in shows the marketing header with "Sign in / Start for free"; the Free and Pro cards say $0 and $15/month plus a 7-day trial. "START PRO — $15/MONTH" → `POST /api/billing/stripe/checkout` → Stripe hosted page, **live mode, US$12.00/month, due today** (blocker). I stopped there without entering card details. Evidence: `w4b-A-desktop-03-after-start-pro.png`.

### W5: Essay Studio (new student A, grade 11)

| Step | Result | Evidence |
|---|---|---|
| /cc/essays → New Essay → Common App Personal Statement, prompt 1 → Start Essay | PASS: `/cc/essays/273e407f-165d-4952-9571-a0319a710402` | `w5a-desktop-01..03*.png` |
| Opening Brainstorm auto-sends an AI greeting (1 AI call). The coach already knew about "robotics… drivetrain design" from the W2 activity. | PASS; good cross-feature context | `w5a-desktop-03-brainstorm-start.png` |
| Brainstorm turns 1–3 (3 AI calls). The coach asks probing questions and does not write prose. | PASS | `w5b-*` |
| Themes offered | **FAIL**: live turn shows no themes; after reload raw `<<THEMES_READY>>` markers are visible | `w5b-turn2-desktop-02-turn2.png`, `w5b-look-desktop-01-open.png` |
| Pick theme → Outline phase | Works in-session, but **not persisted** (back to Brainstorm after reload) | `w5b-pick-desktop-02-outline-phase.png` |
| "Generate 3 outline options" (QA-60) | **PASS**: `POST …/outline` 200 in about 15s. Three structurally different outlines (chronological, vignette, in medias res) made of bullet points only, no prose. | `w5b-outline-desktop-02-outlines.png` |
| Return to the essay | **FAIL**: generated outlines gone, "(no theme selected)". I regenerated them (1 extra AI call). | `w5c-desktop-result.json` |
| Use Option A → Draft phase loads | PASS: outline locked in the side panel, header says "The coach flags paragraphs — it won't rewrite your prose." | `w5c-desktop-01-draft.png` |
| Wrote 138 words myself → Request review | PASS: `POST …/review` 200 in about 11s. Revise shows score 90/100 and 3 line notes, all phrased as questions. **The AI did not write essay prose** anywhere in the path. | `w5c-desktop-02-review.png` |
| 375px Brainstorm, Outline, Draft and Revise (new essay and qa-s1 essay 86c5d33e) | No horizontal overflow. Composer placeholder clipped, phase bar clipped (design). | `w5d-phone-*.png`, `recheck05-s1-phone-*.png` |

### W6: Counselor review loop (QA-20, top-10 #2)

- qa-c1 → /counselor/students → QA Workflow 0927 → Personal Statement (138 words) → typed a comment → "Send feedback" (`POST …/essays/273e407f… 201`). As head, the comment shipped directly ("1 shipped"), so no "Publish to student" button appeared.
- "Request changes" → `POST … 200`. The badge reads "Changes requested" and persists after reload. Evidence: `w6-02..05*.png`.
- Student desktop and phone, **Revise** phase: the "COUNSELOR REVIEW" panel shows "Your counselor requested changes" plus the comment, with the button "I've addressed the feedback — submit for re-review" (not clicked).
- **Brainstorm** phase: the comment is also visible. Evidence: `w6-06-student-*-revise.png`, `w6-07-student-*-brainstorm.png`. PASS.
- Not tested: the supervised-counselor path (needs `astra-graduate1`, which I was not allowed to use).

### W7: Coach continuity (2 AI calls)

- Told the coach "my robotics team placed 3rd at regionals… build lead". After logging out and back in, the coach panel showed the prior exchange (history persists).
- Asked "What do you know about my activities… which schools…?". Reply: "you have University of Michigan-Ann Arbor and University of Toronto on your list, and your one logged activity… you just told me about the robotics regional — 3rd place, build lead". **Recall works for both the fact and the schools.**
- Caveat: the fact was still in the visible transcript, so this shows continuity through chat history. It does not prove a separate long-term memory. Evidence: `w7-01..03*.png`.

### W8: Stage-appropriate behaviour

- **e2e-v-g9**: `/cc/essays` and `/applications` redirect to `/cc/dashboard` with a dismissible banner, "That tool unlocks junior year — let's keep building your foundation here." The sidebar says "Apply: Unlocks junior year". PASS, and there is an explanation. Evidence: `w8g9-*`.
- **e2e-v-senior-decisions**: the dashboard hero is "University of Toronto waitlisted you. Decide and write a LOCI." The Decisions tile shows Admitted 1 · Waitlisted 1 · Denied 0 and "May 1 deposit deadline". `/applications` DECISIONS lists Harvard and Toronto. PASS. Evidence: `w8dec-*`.
- **e2e-v-unknown**: the "Welcome — Talk to Coach Kairos" dashboard with tools gated behind the intake. Copy bug "tools tools". Evidence: `w8unk-*`.

### W9: Retired product

- Signed in, at both 1440 and 375: `/courses`, `/course/python-fundamentals`, `/talk` and `/leaderboard` all go to `/cc/dashboard`, and `/interviews` goes to `/cc/interview-prep`. No 404s and no loops. PASS.
- Signed out, `/landing` renders the old landing page ("College guidance that starts free…") and does not go to "/". Phone logs a hydration error (Minified React error #418). The drawer "Sign out" also lands on `/landing`. (HEAD may fix: bc1172d.) Evidence: `w9out-*`, `recheck-03-after-signout.png`.

### W10: Guest

- Homepage "Find my next step" with Grade 11 / Canada / What it could cost gives a client-side answer: "Collect the annual cost… Which annual cost or funding amount still needs checking?". It made no API calls.
- The cost check (60,000 − 20,000 − 15,000) gives "USD 25,000.00" with honest caveats.
- "Start a family conversation" produced no visible change I could detect.
- There is **no guest coach**. `/schools`, `/cc/dashboard` and `/cc/essays` redirect to `/login?next=…`, and `/intake` goes to `/signup?next=/`. Signup is required for any AI or any saving. Evidence: `w10-*`, `w10b-*`.

### Console, network and layout across all pages visited

- Uncaught page errors: 1. React #418 on signed-out phone `/landing`.
- Failed `/api` calls (4xx/5xx, excluding expected 401s): none in the student and counselor flows.
- Separately: `GET /api/counselor/search` → 401 for signed-out `/find-counselor`, and `/ref/null` → 500 (page route).
- Console `404` "Failed to load resource" lines were all `/_vercel/insights` and `speed-insights`, which I ignored as instructed.
- Horizontal overflow at 375: none (`scrollWidth − clientWidth = 0` everywhere). The one clipped table is inside an `overflow-hidden` container (counselor team).

## Audit re-checks (from `2026-09-27-audit-resolution-matrix.md` §a)

| QA | Route | Account | Expected | Actual | Result |
|---|---|---|---|---|---|
| #1 QA-23/T9/QA-02 | signed-out `/join/<code>` → login → Sign up → join → onboarding → roster | new `+qa-wf09271432` (grade 11, not 9), head qa-c1 | Linked without re-entering the code; name in roster | Linked via the in-form Sign up; "You're linked to QA Counselor One at QA Test Agency"; roster shows "QA Workflow 0927 Phone". The email-confirmation step does not exist (no verification). The TopNav "Sign Up" path loses the invite. | PASS (in-form) / FAIL (TopNav) |
| #2 QA-27/37 | `/cc/recommenders` | new junior A | Row visible after save and after reload | Visible after save, after reload and after re-login | PASS |
| #3 | `/settings`, `/cc/net-price`, phone drawer Sign out | A (qa-s1 for net-price; astra-test6 not allowed) | Load; sign out works | Both load. Net price shows "0 of 0 schools" for a student with 2 schools. Phone "Sign out" (menu button) signs out; `/cc/dashboard` then redirects to login; lands on `/landing`. | PARTIAL: sign-out PASS, net-price FAIL |
| #4 | onboarding transfer path → `/cc/transfer-profile` | needs a new transfer student | GPA and profile prefilled | Not run: the 2-new-account cap was already used. Checked seeded e2e-v-transfer instead: fields persist, no GPA field in the transfer profile. | BLOCKED |
| #5 QA-07/38 | `/cc/essays/<id>` all four phases at 375 | new A essay and qa-s1 essay 86c5d33e | No overlap or overflow | 0 overflow in every phase. Composer placeholder clipped; phase bar clipped; FAB sits close to the draft-coach send button. | PASS (minor design) |
| #6 QA-20/T2 | supervised publish → student sees it in Brainstorm | astra-graduate1 / astra-test9 not allowed; ran as head qa-c1 with student A | Supervised draft hidden until head publishes | Head path: comment ships immediately, Request changes works, student sees it in Revise and Brainstorm. The supervised part was not testable. | PARTIAL: head PASS, supervised BLOCKED |
| #7 QA-60 | Outline → Generate 3 outline options | new A (grade 11) | 200 with 3 options | 200 twice, about 12–15s each, 3 options. Vercel log n/a locally. | PASS |
| #8 QA-15 | `/find-counselor` signed out | signed out | Network 200 with data | `GET /api/counselor/search?` → **401**; "No counselors match your filters" | FAIL (HEAD may fix: 3ee30e9) |
| #9 QA-34 | `/schools` at 375 | new A (astra-test2 not allowed) | Coach does not cover the list | Coach auto-opens full screen on every visit | FAIL (HEAD may fix: ee1cc0f) |
| #10 QA-14 | `/pricing`, `/stories`, `/product/counselor` at 375 and 1440 | signed out and new A | Single header | Single marketing header in all 12 combinations. When signed in it still shows "Sign in / Start for free". | PASS (single header) |
| #11 QA-25 | `/cc/activities-optimizer` | e2e-v-g9 | "Add manually" works without a resume | Saved "QA Chess Club" (`/api/cc/activities/save-parsed` 200); present after reload | PASS |
| #12 QA-10 | `/counselor/team` hard load and reload | qa-c1 | No bounce | Stays on `/counselor/team` ("Team & Invites") | PASS |
| #13 QA-13 | `/signup` | signed out | Credits copy matches 200 | "Free 7-day Pro trial for students — 300 AI credits included" | FAIL (HEAD may fix: 6b9878c) |
| #14 QA-35 | `/schools` Toronto | new A (astra-test8 not allowed) | Not $0 | No price shown in browse or on the saved card. The saved card says "Location unlisted". | PASS |
| #15 | glossary for guest | signed out | Terms render | `/api/cc/glossary` → 200 `{"terms":[]}`; `/glossary` → login page | FAIL |

## AI usage

Total LLM-triggering actions: **9 of the 12 allowed.**

- W5: **7**, one over the W5 cap of 6.
  - 1 automatic brainstorm greeting when the essay opened.
  - 3 brainstorm turns.
  - 2 outline generations. The second was forced by blocker #3b, because the first set of outlines was lost on reload.
  - 1 essay review.
- W7: 2 coach messages.
- No other AI calls. Outline "save" POSTs are not LLM calls (`action: "save"`).

## Accounts and data created

- New accounts (2, password `KairosQA!2026-wf`):
  - `bilalhussain.v1+qa-wf09271424@gmail.com`: "QA Workflow 0927", grade 11, linked to qa-c1 via `QA-TEST-AGENCY-F4MBPB`.
  - `bilalhussain.v1+qa-wf09271432@gmail.com`: "QA Workflow 0927 Phone", grade 11, linked via `QA-TEST-AGENCY-4XJAQ5`.
- Invite codes minted on qa-test-agency: the two codes above (both now used, 1/1).
- Student A data:
  - Schools: Michigan (RD, in progress, Common App checked) and Toronto.
  - Activity: "Build lead / School Robotics Team".
  - Recommender: "Ms. QA Rivera" (no email).
  - Essay `273e407f-165d-4952-9571-a0319a710402`: brainstorm, outline, 138-word draft, AI review.
  - Two coach messages.
- qa-c1 activity: one comment on essay `273e407f…` and review state "changes_requested".
- Seeded accounts modified:
  - `e2e-v-transfer`: transfer credits blank → 34; GPA (unweighted) blank → 3.58.
  - `e2e-v-g9`: added activity "Member / QA Chess Club".
- One live Stripe Checkout session was created (not paid, abandoned).
- Nothing was deleted. No emails were sent, and no real person was contacted.

## Re-test on 804c998

- **Build:** `.next/BUILD_ID = Wc9tzUELNDTd7_he0sUND`. It was written 2026-09-27 15:45 -04:00, after `804c998` (15:42), so this re-test covers the fixed code.
- **Setup:** same rules as the first round. Headless Chromium through my own Playwright scripts, one browser at a time.
- **Evidence:** `docs/qa/evidence/predeploy-2026-09-27/workflows/rc2/` (`rc2-w4-result.json`, `rc2-w5-result.json`, `rc2-w7-result.json`, `w1hdr-desktop-result.json` and screenshots).

**Verdict for this round: all 7 re-tests pass.** No blocker from the first round reproduced. One new should-fix-before-launch item came up (N1 below).

| # | Re-test (fix) | Account | Expected | Actual | Result | Evidence |
|---|---|---|---|---|---|---|
| 1 | Brainstorm themes on the live turn (d0c1890) | new essay `55ee59a5-624c-4370-942e-55000040d166` on `+qa-wf09271432` | Chips appear on the live turn without a reload; no `<<THEMES_READY>>`/`<<END_THEMES>>` text, live or after reload | Turn 3 (live): "Here are three directions your essay could take: … Which of these feels most…" followed by 3 chips under "PICK A DIRECTION TO DEVELOP" and in the Directions panel. No marker text live, and none after reload (same 3 chips). | **PASS** | `rc2-01-turn3-live.png`, `rc2-01-after-reload.png` |
| 2a | Theme pick persists (a785b64) | same essay | After reload the student is still in Outline with the theme shown | Picked "Notebook as anchor: translating mom's handwriting…" → Continue (`POST …/outline action=themes`) → reload → OUTLINE phase, "Based on the theme you picked — Notebook as anchor…", stepper "1 theme picked" | **PASS** | `rc2-02-reload-after-pick.png` |
| 2b | Generated outlines persist (a785b64) | same essay | The same 3 options after reload, with no second `action=generate` | Generated A "Chronological — the journey from notebook to kitchen", B "Vignette collage — moments of translation and connection", C "In medias res — the moment of crisis in the kitchen" (about 11s). After reload the same three titles appear, with **zero** outline POSTs after the reload, no Generate button and no "was supposed to draft three" text. | **PASS** | `rc2-02-outlines.png`, `rc2-02-reload-after-outlines.png` |
| 3 | Net price lists the student's schools (369a54b + 804c998) | `+qa-wf09271424` (Michigan + Toronto) | Schools listed, not "0 of 0"; affordability in words | "AFFORDABILITY: Under $10,000/year". "CATALOG: 0 of 2 schools covered". "Not yet in our estimator (2): University of Michigan-Ann Arbor, University of Toronto — use each school's official Net Price Calculator". The API returns `uncovered: [both]`. Same result at desktop and phone, no overflow. | **PASS** | `rc2-03-net-price-desktop.png`, `rc2-03-net-price-phone.png` |
| 4 | Referral card and `/ref/null` (68bec25) | `+qa-wf09271424`, `+qa-wf09271549`, signed out | No "Refer a Friend" card without a code; `/ref/null` goes to /signup with no 500 | No Refer card on either account (desktop or phone). Signed out, `/ref/null` → `/signup` (200). Signed in, `/ref/null` → `/cc/dashboard` (200). | **PASS** | `rc2-04-settings-A-*.png`, `rc2-04-settings-C.png`, `rc2-04-ref-null-signedout.png` |
| 5 | Checkout respects the trial (ccbfa8a) | `+qa-wf09271549`, created today (trial until Oct 4) | Stripe shows the trial and first-charge date; judge trial behaviour only | "START PRO — $15/MONTH" → `POST /api/billing/stripe/checkout` 200 → live Stripe page. It says **"Try KairosLearn Pro · 6 days free · Then US$12.00 per month starting 4 October 2026 … Total after trial US$12.00 · Total due today US$0.00"**, with a "Start trial" button. The first charge date matches the app's trial end ("Free trial credits — expires October 4, 2026"). The US$12.00 amount is the known stale local price (production uses $15), recorded but not judged. I did not pay. | **PASS** (trial) | `rc2-05-stripe.png`, `rc2-05-pricing.png` |
| 6 | Header "Sign Up" keeps the invite (ca6db1b) | new `+qa-wf09271549` ("QA Workflow Header 0927"); qa-c1 minted `QA-TEST-AGENCY-BQJ2VX` | Linked to QA Counselor One without re-entering the code | Signed-out `/join/QA-TEST-AGENCY-BQJ2VX` → `/login?next=…` → clicked the **header** "Sign Up" → `/signup?next=%2Fjoin%2FQA-TEST-AGENCY-BQJ2VX` → Create Account → "You're linked to QA Counselor One at QA Test Agency." → Continue → onboarding (grade 11) → dashboard chip "Your counselor: QA Counselor One · QA Test Agency". qa-c1 roster shows "QA Workflow Header 0927", and the code shows 1/1. | **PASS** | `w1hdr-desktop-03..08*.png` |
| 7a | #9 `/schools` coach | `+qa-wf09271424` | Coach does not auto-open | Coach closed and school list visible, at phone and desktop | **PASS** | `rc2-07-schools-phone.png`, `rc2-07-schools-desktop.png` |
| 7b | #13 `/signup` credits copy | signed out | 200 credits | "Free 7-day Pro trial for students — 200 AI credits to start" (no "300") | **PASS** | `rc2-07-signup.png` |
| 7c | #8 `/find-counselor` signed out | signed out | Counselors listed | `GET /api/counselor/search?` → 200; 6 counselors listed; no overflow at 375 | **PASS** (but see N1) | `rc2-07-find-counselor.png`, `rc2-07-find-counselor-phone.png` |
| 7d | Phone drawer Sign out | `+qa-wf09271424` at 375 | Signs out | Menu → "Sign out" → lands on "/" (no longer `/landing`); `/cc/dashboard` then redirects to `/login?next=…` | **PASS** | `rc2-07-phone-drawer.png`, `rc2-07-after-signout.png` |

### New findings in this round

- **N1 (should fix before a public launch): the public counselor directory lists test and synthetic accounts.** Signed-out `/find-counselor` now shows real data from the production database, including "E2E Counselor", "QA Head Counselor", "QA Counselor One", "QA Graduate One - Synthetic Test", "BH" and "Bilal Hussain", all with "0 sessions". A real visitor would see fake counselors. These rows need hiding (for example an `is_test` flag or an unlisted status) before the directory is promoted.
- **N2 (copy): the pricing and FAQ copy says "7-day trial. No card required."** The Start Pro checkout asks for card details to start the trial ("Enter payment details … Start trial"). The in-app trial itself needs no card, so the copy should distinguish the free trial you already have from subscribing now.
- **N3 (observation): the coach held off naming themes twice** even when the student asked for them explicitly, and only offered them on the third turn. The prompt is working as designed, but it costs students about two extra AI turns.
- **Still open from the first round (not in scope for this re-test):** Settings still shows "Role: pro" and "Login Streak 1 days" and has no Stripe-portal action; the net-price catalog covers 12 schools only, so neither Michigan nor Toronto gets an estimate.

### AI usage this round

**5 of 6** LLM actions:
- 1 automatic brainstorm greeting
- 3 brainstorm turns
- 1 outline `action=generate`

The outline `action=themes` POST is a save; the route returns before any LLM call.

### Account created this round

`bilalhussain.v1+qa-wf09271549@gmail.com` / `KairosQA!2026-wf`, "QA Workflow Header 0927", grade 11, linked to qa-c1 via `QA-TEST-AGENCY-BQJ2VX`. That makes 3 new accounts in total across both rounds.

Other data created this round:
- essay `55ee59a5…` on `+qa-wf09271432` (brainstorm, theme, 3 outlines)
- invite code `QA-TEST-AGENCY-BQJ2VX` (used)
- one abandoned live Stripe Checkout session (trial), not paid
