# Hermes Test Runbook — kairoslearn.com

> **For the Hermes agent.** Execute these flows against **https://www.kairoslearn.com**
> (production). Drive a real browser. For each step: perform the action, observe the
> result, and record PASS / FAIL / BLOCKED with evidence (screenshot + console errors +
> the actual on-screen text). Report at the end with a funnel table + a bug list ranked
> by severity. **Do not fix anything** — observe and report.

## How to report
For every numbered step record: `step id → PASS|FAIL|BLOCKED`, what you saw, a screenshot
filename, and any console error. At the end produce:
1. **Conversion funnel table** (landing → signup → onboarding-complete → first activation) with drop-off at each stage and time-on-step.
2. **Bug list** ranked Critical / High / Medium / Low, each with repro steps + screenshot.
3. **Feature coverage matrix** (feature → reachable? → works end-to-end? → notes).

## Cautions (read first)
- This is **production**. The test personas below already exist in the live DB. The counselor invite / approve / comment flows **mutate real rows** — keep to the `e2e-`prefixed accounts so cleanup is scoped.
- AI features (essay brainstorming agent, financial-aid guidance, Coach Kairos) **spend LLM credits**. Don't loop them needlessly.
- Known background noise: an unidentified request **500s on a ~45s cadence** on authenticated pages (logged as ISSUE-005). Note it once; don't treat each recurrence as a new bug.

## Test personas (real, seeded)
| Role | Email | Password | Notes |
|---|---|---|---|
| Counselor / agency head | `e2e-head@test.local` | `E2eTestPass!1` | Head of "QA Demo Agency"; has 2 students + 2 invite codes |
| Student A | `e2e-student1@test.local` | `E2eTestPass!1` | "Maya Chen", 11th grade, Lincoln High CA, profile 64% |
| Student B | `e2e-student2@test.local` | `E2eTestPass!1` | "Devon Park", 12th grade, Riverside Prep TX, profile 88% |
| Fresh student (no links) | `e2e-student3@test.local` | `E2eTestPass!1` | Use for the invite-code redemption flow |
| Brand-new signup | create `hermes+<timestamp>@test.local` | choose one | Use for the acquisition funnel (Phase 1) |

**Live invite codes (QA Demo Agency):** `E2E-QA-AGENCY-QM7T2X` (fresh, maxUses 5) — use for the redeem flow. `E2E-QA-AGENCY-AB3K9P` (already used 1/1).

---

## Phase 1 — Acquisition funnel: landing → signup (the conversion question)

Goal: measure where prospects drop off from first paint to an activated account. Use the **brand-new signup** persona. Time each stage.

1. **Landing first paint.** Goto `https://www.kairoslearn.com/` logged-out (clear cookies first). Capture: hero headline, primary CTA label/position, time-to-interactive, console errors. Is the value proposition clear in <5s? Is there a visible CTA above the fold?
2. **Landing → signup intent.** Click the primary CTA. Record where it lands (`/signup`? `/login`? a pricing wall?) and how many clicks from landing to the signup form.
3. **Signup form friction.** On `/signup`: count required fields (name/email/password), note password rules, whether Google OAuth is offered, and any confusing copy. Record field-level validation (submit empty; submit a 3-char password; submit a malformed email) — does each show a clear inline error?
4. **Create account.** Sign up `hermes+<ts>@test.local`. Record: does it land on email-verify, or straight into the app? Time from CTA-click to account created.
5. **Onboarding funnel.** Follow the student onboarding (`/onboarding`: language → role hs/transfer → grade → concerns). Record each step's friction and whether any step lets you proceed without input. Time the whole flow. **Drop-off risk:** note any step a real student would abandon.
6. **Activation.** After onboarding, land on `/cc/dashboard`. Record: is there an obvious "first action" (a next-best-step)? What does an empty dashboard look like for a brand-new student?
7. **Counselor acquisition path.** Back on `/login` (logged out), confirm the **"Counselor or agency? Sign in to your workspace →"** link and the **"Set up a counselor account"** link are present. Click each; confirm they route toward `/counselor/onboard` (via `?next=`). This is the counselor top-of-funnel — note if it's discoverable from the landing page at all (check `/product/counselor`).

**Funnel metrics to output:** landing-view → signup-start → signup-complete → onboarding-complete → first-activation, with the count/time and the single biggest drop-off point.

---

## Phase 2 — Student exhaustive flows

Log in as **Student A (Maya Chen)** unless noted. Capture screenshots of each surface.

8. **Student dashboard.** Goto `/cc/dashboard`. Record the sections present, the "next step" prompts, and whether the data matches Maya (11th grade). Console clean?
9. **Course rigor.** Open the course-rigor surface (`/cc/courses`). Enter a real AP/honors load (e.g. AP Bio, AP US History, Honors Pre-Calc, AP Lang). Confirm it produces a rigor assessment. Record what the output says and whether it's actionable.
10. **Activity list.** Open `/cc/activities-optimizer`. Add a real activity: *"Varsity Debate — Captain, 4 hrs/wk, 36 wks/yr, led team to state semifinals."* Confirm it saves, and capture any AI feedback/optimization the tool gives. Add a second weaker activity and see if the tool differentiates.
11. **Essay foundation — brainstorming agent.** Open the essay brainstorming surface (`/cc/essays`, the brainstorm/foundation step). Start a personal-statement brainstorm with a real prompt response: *"I want to write about immigrating from Taiwan in 9th grade and how running cross-country helped me find belonging."* Confirm the **brainstorming agent** responds with real, on-topic guidance (not a generic template). Record latency and whether responses stream. Push one follow-up to test conversational memory.
12. **Financial aid + CSS profile.** Open the financial form / net-price flow (`/cc/net-price` and `/cc/profile/css-guide`). Enter realistic family financials (e.g. household income $85k, one sibling in college, home equity modest). Confirm it generates a **net-price report** per school and that the **CSS Profile guidance** tells the student exactly what to enter. Record whether the numbers look sane and the guidance is specific.
13. **School list.** Open `/my-schools` (or `/schools`). Add 2 reach / 2 match / 2 safety schools. Confirm fit/state coloring renders and deadlines show.
14. **Coach Kairos.** Open the coach (floating launcher / `coach=open`). Ask a real question: *"Given my 3.8 GPA and AP load, is UMich a reach or match for me?"* Confirm a relevant, personalized answer. Note streaming behavior (does text appear word-by-word or in one chunk?).

---

## Phase 3 — Counselor flows

Log in as **Counselor (e2e-head@test.local)**.

15. **Counselor entry (no URL typing).** After login, confirm you land in the **counselor workspace** (not student onboarding). Open the account menu (avatar, top-right) and confirm a gold **"Counselor workspace"** item is present; click it → `/counselor/dashboard`. This validates the entry-point fix.
16. **Counselor dashboard.** Goto `/counselor/dashboard`. Record the overview (stat cards, profile-setup card). Confirm the left sidebar shows **Workspace → Students, Team & invites**.
17. **Roster.** Click **Students** (or goto `/counselor/students`). Confirm both seeded students render as cards — **Maya Chen (11th, Lincoln High CA, 64%)** and **Devon Park (12th, Riverside Prep TX, 88%)** — with the gold profile-completion bar, "joined via code" badges, and tabular numbers. Confirm it does NOT redirect to dashboard.
18. **Team & invites.** Click **Team & invites** (`/counselor/team`). Confirm it loads (not a redirect). Verify: the members table lists the head; the invite-codes table shows `E2E-QA-AGENCY-QM7T2X` (0/5) and `E2E-QA-AGENCY-AB3K9P` (1/1, used). Test **copy link** on the fresh code (clipboard → `…/join/E2E-QA-AGENCY-QM7T2X`). Test **Mint invite code** with label *"Hermes test cohort"* and confirm a new code appears.
19. **Add a counselor (negative + positive).** In the add-member form, try an email that isn't a registered user → expect a clear "user not found" message. Then add `e2e-student3@test.local`'s email is NOT a counselor; instead confirm the error path is graceful. (Do not actually promote a student.)

---

## Phase 4 — The headline cross-actor loop (invite → workspace visible → approve → comment → re-review)

This is the core counselor value loop. Run it across two browser sessions (counselor + student).

20. **Counselor mints + shares a code.** As the head, on `/counselor/team`, mint a fresh code (or reuse `E2E-QA-AGENCY-QM7T2X`). Copy the join link `…/join/<CODE>`.
21. **Student redeems the code.** In a separate session, log in as **Student B (e2e-student2 / Devon Park)** — or the fresh student — and goto the join link. Confirm: redemption succeeds, the student is auto-linked to QA Demo Agency, and they land on their dashboard. (If logged out first, confirm `/join/<code>` routes through `/login?next=` and returns to redeem.)
22. **Workspace becomes visible to the counselor.** Back as the head, refresh `/counselor/students`. Confirm the newly-linked student now appears on the roster.
23. **Open the student's work.** From the roster, open the student (when the per-student file view ships — **NOTE: this is SP2/SP3, may not exist yet**; if there's no per-student page, record it as "not yet built" and continue). Confirm you can view their essays / school list / activities read-only.
24. **Leave a comment / feedback.** On a student essay, leave an inline comment (when comments ship — SP3). Record whether the student sees it.
25. **Approve an application / submit for re-review.** Confirm the counselor can mark feedback "shipped"/approve, and the student can address it and **submit for re-review**. **NOTE:** the approve / comment / re-review loop is **SP3 scope and likely not built yet** — if the UI is absent, record the gap explicitly (this is the most important thing to verify exists or doesn't).

> **Expectation calibration for Phase 4:** Steps 20-22 (invite → link → roster visibility) are **shipped and should pass**. Steps 23-25 (per-student file view, inline comments, approve/re-review) are **the next build (SP2/SP3)** — Hermes should confirm whether they exist and, if not, report them as "designed, not yet implemented" rather than as bugs.

---

## Phase 5 — Cross-cutting checks
26. **Console health.** Across all authenticated pages, tally console errors. Separate the known ~45s background 500 (ISSUE-005) from anything new.
27. **Mobile.** Re-run the landing → signup funnel (Phase 1) and the counselor roster (step 17) at 375×812. Record layout breaks.
28. **Auth edges.** Confirm logged-out access to `/counselor/team` and `/counselor/students` redirects to `/login?next=…`. Confirm a logged-in non-counselor visiting `/counselor/team` is bounced to `/counselor/dashboard`.

---

## Output template for Hermes
```
## Funnel
landing-view → signup-start → signup-complete → onboarding-done → activated
  <n> → <n> → <n> → <n> → <n>   | biggest drop-off: <stage> (<why>)

## Bugs (ranked)
[Critical] <title> — <repro> — <screenshot>
[High] ...
[Medium] ...

## Feature coverage
| Feature | Reachable | Works E2E | Notes |
| course rigor | Y/N | Y/N | |
| financial aid + CSS | | | |
| essay brainstorm agent | | | |
| activity list | | | |
| counselor roster | | | |
| invite → redeem → visible | | | |
| approve/comment/re-review | | | (SP3 — may be absent) |
```
