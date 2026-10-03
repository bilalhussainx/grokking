# KairosLearn: student workflow validation (production, 2026-10-03)

Tested on https://www.kairoslearn.com with Playwright, at phone 375x812 and desktop 1440x900. Source cross-referenced at `C:\Users\bilal\Downloads\grokking-integrate`. Screenshots are in `student-evidence\`. Scripts are in `student\`.

## Created or changed (QA data only)
- New accounts, password `KairosQA!2026-oct03`:
  - `bilalhussain.v1+qa-oct03-new1@gmail.com`. Completed onboarding on phone (English, high school, Grade 12, pins Deadlines + Essays). Created one Common App essay and took it through Brainstorm, Outline (option A) and Draft (130 words) to the AI review. Sent 4 Coach messages and 4 essay-brainstorm messages. The Stripe checkout page was opened and left without paying. The account has a trial ending Oct 10.
  - `bilalhussain.v1+qa-oct03-new2@gmail.com`. Signed up on desktop and stopped at onboarding step 1. It has no data.
- `qa-wf09271424`: added McGill University to the school list. It remains there.
- `e2e-v-unknown`: clicked "I'm not sure / skip for now". The UI said "Nothing was saved."
- No payment was made. No emails or invites were sent.

## Environment caveat
Production was slow and flaky during the run, possibly made worse by the other agents testing at the same time.
- Pages stayed blank for 15-45 s: `/profile` took 45 s, `/cc/chances` 17 s, `/cc/visits` 14 s, and one login hung for more than 30 s.
- `/cc/summer` returned a Vercel **504 MIDDLEWARE_INVOCATION_TIMEOUT** page (screenshot of the error captured in the run). `/settings?_rsc=` also returned a 504.
- `/api/cc/glossary`, a public endpoint, took 2-8 s on one probe and 0.3 s on another.
- A student on a phone would see a blank white or black page with no loading state and would assume it was broken.

## Verdict by workflow

### 1. Brand-new student: homepage, signup, onboarding to Today

**Worked**
- The homepage quick-check ("Your stage / Where you might study / What is on your mind") is clear.
- Signup was fast and needed no email verification.
- Onboarding is a four-step wizard: language, path (high school or transfer), grade, and 1-2 things "weighing on you". Every step is plain-English. It auto-saved and landed on Today.
- At 375px there was no horizontal overflow on the homepage, signup, onboarding or Today.

**Bugs**
- **Major.** Onboarding never reaches Profile. `/profile` has "Grade level *" showing "Select..." and "4% complete" after the student picked Grade 12. I could not read the selected value of the dropdown. The 4% completion figure suggests the grade was not carried over. Check this.
- **Major.** `/cc/net-price` shows "AFFORDABILITY: Under $10,000/year" and "Domestic, continuing" for a brand-new account. Onboarding never asked either question. These are silent defaults that feed the cost estimates.
- **Minor.** Onboarding's only exit button is labelled "SIGN OUT" (`src/app/onboarding/page.tsx:270`, class `skip`). There is no real "skip". A student cannot see anything else until onboarding is finished, because `/cc/dashboard` redirects back to it.
- **Minor.** After "Take me to my dashboard" the screen says "Saving your profile…" and then needs an extra "Open my dashboard" click.

**Confusing**
- **Major.** Onboarding never asks which country the student is applying to (US, UK or Canada) or when. The homepage offers "US / Canada / Still exploring", and onboarding then drops this. UK is not offered on the homepage at all, even though the product claims UK support.
- Step 1 lists 25 languages. On a phone the Continue button is below all 25 cards. The cards auto-select but do not auto-advance.
- Step 1 is "What language do you think in?" Elsewhere it is "voice" language. It is not clear that it only affects Coach speech.
- Flags render as "US/ES/IN" letters on Windows.
- The signup page says "Free 7-day Pro trial… 200 AI credits". The homepage says "Free: 200 credits once at signup. Pro: 7-day trial". The pricing page says "Free: 3 schools, 1 essay, 3 voice sessions/month". See workflow 10.

**Missing**
- Onboarding collects no target countries, application year, school names or citizenship.
- Onboarding gives no hint that Today is the home page.

### 2. Today dashboard

**Worked**
- The dashboard adapts to the student's state.
  - New Grade 12 student: "Find the experience you want to understand" (Essay Studio).
  - After I drafted and reviewed an essay: "Return to your personal statement… Based on your saved phase: Revise".
  - Linked student qa-s1 and qa-s2: shows the counselor name and agency.
- The warm light design is clean. At 375px the Today page has no overflow.
- Ask Kairos stages the draft in Coach and sends nothing. Verified: typing "What should I do this week?" and pressing "Open in Coach" opened the panel with the text staged in the input and no message sent.
- The grade question works for unknown-grade students (variant `e2e-v-unknown`). It offers Grade 9-12, "I'm transferring" and "I'm not sure / skip", and skipping says "Skipped for now. Nothing was saved."

**Confusing**
- **Major.** Today answers "what now" with one card. It does not answer "this week" or "before the next deadline". With schools saved and a Feb 1 deadline in play, Today still says "Dates appear here after you save schools" / "No upcoming deadlines". There is no countdown or checklist.
- Today's copy for a student who has already drafted and been reviewed still says "write the draft in your own words". The text does not update with the phase.
- For a student with no schools, the Applications line reads "Dates appear here after you save schools" and School list reads "Start with possibilities, not rankings". Neither links to the next action.
- A "Working late? Coach Kairos is here" toast appears over content on phone and overlaps the bottom nav.

**Missing**
- No progress indicator, no "N of M steps", no streak or week plan.
- The "Not today" button on the Coach card gives no explanation of what it dismisses.

### 3. School list

**Worked**
- Add and remove schools work. The Browse tab filters by country, state and public/private. It has a search box and cards showing acceptance rate, net price, deadline and test policy.
- US schools show a deadline. The "Which plan should I choose?" link and "Export to calendar" button exist on `/applications`.
- School detail for a US school (Michigan) shows Overview, Aid & Loans and Supplements with prompt text, word counts and "Verify on school site".

**Bugs**
- **Blocker for UK students.** The country filter lists United Kingdom. Selecting it calls the search API with `country: "GB"` and returns **0 schools** ("No schools found."). UK schools exist in code (`src/lib/cc/uk/schools.ts`) but the production catalog (`cc_schools`) has none. Searching "Oxford" and "Manchester" returns nothing. No UCAS route is possible from the school list.
- **Major.** Canada returns only 12 schools. Their cards show "Location unlisted", no deadline and no net price. The application plan options ED/EA/REA/RD are wrong for Canada.
- **Major.** No reach, target or likely labels. Every school is "Uncategorized (N)". The banner says "Your list has no safety schools. Add at least 2 safety schools". The student has no way to categorise a school, and the word "safety" contradicts Today's copy ("possibilities, not rankings").
- **Major.** "Next deadlines: No upcoming deadlines" on `/applications` even though Michigan is saved with a Feb 1 deadline and status "In progress". Probably the deadline string ("Feb 1", no year) is not parsed. Verify the cause.
- **Minor.** Supplements on Michigan are tagged "2025-2026" while the current cycle is 2026-27. Staleness is not flagged beyond "Verify on school site".
- **Minor.** The black School List content sits inside a warm light shell. This is a design-system mismatch. `/my-schools`, `/timeline`, `/pricing` and `/college-interviews` use an older nav (a "288 / Upgrade" credits chip, "⌘K", and a "COUNSELOR / ESSAYS / SCHOOLS / PRICING / SIGN IN" bar even when signed in). `/my-schools` is a second, older copy of the school list.
- On phone `/schools` showed only a spinner for several seconds. The overflow on `/schools` and `/cc/essays` is already assigned to another agent. I did not re-measure it.

**Confusing**
- "APPLYING AS ED / EA / REA / RD / Rolling" has no explanation. A 16-year-old will not know these.
- School detail for McGill has acceptance 46% and blanks ("—") for everything else.
- On `/schools/[id]` the Applications board is attached under the school detail. It is not clear which section is which.

**Missing**
- No UK or Canadian requirement data (UCAS five-choice limit, Oct 15 Oxbridge, OUAC, program-level requirements).
- No fit or chance label on the school list. `/cc/chances` is a separate page that only says "Add schools to your list".

### 4. Applications and requirements tracking

**Worked**
- The board has columns Not started, In progress, Submitted and Decisions, with nine statuses and a plan selector.
- Each school has a 7-item checklist (Common App, Essays, Supplements, Recs, Transcript, Test scores, Aid filed).

**Bugs / Confusing**
- **Major.** The same 7-item US checklist is applied to McGill and Toronto. It says "Common App" and "Aid filed" for schools that do not use the Common App. There is no OUAC or UCAS option in the plan selector. It lists QuestBridge and Coalition instead.
- **Major.** No per-school deadline is visible on the board cards.
- The checklist rows are not labelled with who does each step.

**Missing**
- **Major.** No documents or private-files area for a student. The only upload in the product is the resume import in Activities (`src/components/cc/activities/ResumeUpload.tsx`). There is no place to store a transcript, test report or aid form.
- No reminders or notifications for requirements.

### 5. Essays

**Worked**
- The essay flow is Brainstorm, then Outline (3 structural options A/B/C), then Draft, then Revise. Each phase has its own page with the stage tracker (01-04) at the top.
- Brainstorm is an interview. The AI asked one question at a time, referred to the student's own words (Dev, the shop, the wire) and built a Story canvas with fragments and "directions" chips. After 6 exchanges it offered 3 themes. Selecting a chip enabled "Continue with 1 theme".
- Outlines list sections with word budgets and bullet prompts. No prose is written.
- **The AI never wrote prose for the student.** In brainstorm, "Can you just write my opening paragraph for me?" was refused: "I can't write the prose for you…". The same request in Coach was refused. The Draft screen says "The coach flags paragraphs. It won't rewrite your prose."
- The review is visible at the Revise phase: a score, a breakdown, "What's already working", a suggested next step and line-level notes by paragraph.
- Counselor review state (qa-s1's essay): "COUNSELOR REVIEW. Approved by your counselor" with dated notes appears above the AI read.

**Bugs**
- **Major.** The AI review praised something that does not exist. For my 130-word draft, "WHAT'S ALREADY WORKING" listed "Effective use of dialogue to highlight team dynamics". The draft has no dialogue.
- **Major.** Score inflation. A 130-word draft against a 650-word limit scored 85 "STRONG", including "Application fit 80" when the student had no schools on a list. "Request review" was not blocked or warned at 20% of the limit.
- **Minor.** The Brainstorm AI named schools the student never mentioned ("admissions officers at schools like Tufts or Stanford"), and said "Coach Kairos will help you" while speaking as Kairos.
- **Minor.** The static "COACHING TIP · LIVE" panel did not change across 6 exchanges. The Story canvas showed its empty placeholder after a reload even though 3 fragments had been extracted earlier.
- **Minor.** qa-s1's essay says "Approved by your counselor" while the latest counselor note asks the student to resubmit. The status and note contradict each other. Dates there display `17/08/2026` (day-first) while the product is US-first.
- The essay page took 5-12 s to show anything on first load.

**Confusing**
- The Outline step is locked ("Next up") until the AI offers themes. Nothing tells the student how many answers are needed. The Outline tab is clickable and silently does nothing.
- New-essay types are Common App, School Supplemental and Scholarship. There is no UCAS personal statement option in that dialog (a separate UK supplements page exists at `/cc/essays/supplements/uk`; I did not find a link to it from the nav).
- The theme chips and Continue button are in the DOM twice. This may be a phone and desktop pair.

### 6. Activities, profile, testing, recommenders, net price/aid, interviews
Every page was reachable from the nav or "More planning tools".

| Page | Loads | What a student does there | Notes |
|---|---|---|---|
| `/cc/activities-optimizer` | Yes | Import resume or add activities, run AI review | Empty state is clear |
| `/profile` | Yes, after 45 s | Fill the Common App profile | Grade shows "Select…" and completion 4% after onboarding. Country list is United States / Canada / Other (no UK). Citizenship options are US-specific (DACA, Undocumented) |
| `/cc/test-strategy` | Yes | SAT vs ACT quiz and score log | US-only. The quiz asks about "U.S. East / Midwest" preference, and has no UK admissions tests, A-level/IB/AP or English tests (UK admissions-test code exists in `src/lib/cc/uk/admissions-tests.ts` but is not shown) |
| `/cc/recommenders` | Yes | Track recommenders, brag sheets | Blank on one phone load, fine on desktop |
| `/cc/net-price` | Yes | Net price per school | Shows defaults the student never entered (see workflow 1). "0 of 0 schools covered" until schools exist |
| `/cc/interview-prep` | Yes (desktop) / blank on phone 20 s | Practice interviews | Says "Add schools to your list first". It leads to `/college-interviews`, an older dark page with an Ivy+ only school list |
| `/cc/majors`, `/cc/chances`, `/cc/visits`, `/cc/summer`, `/timeline`, `/cc/waitlist`, `/cc/family` | Yes (summer 504 once) | Majors, chances, visits, summer, tasks, waitlist, parent invite | `/cc/chances` requires schools and an essay review first. `/cc/visits` offers only 5 US virtual tours (MIT, Harvard, Stanford, Yale, Princeton) |

### 7. Coach Kairos chat (4 messages used, plus 4 essay-brainstorm messages)
1. "What should I do this week?" Reply: "Your personal statement is sitting at 130 words… push that draft past 500 words this week." Links to Essay Studio.
2. UK question (UCAS vs Common App). It described UCAS as "a 4,000-character academic personal statement focused on why you want to study a specific subject". For 2026-27 entry, UCAS moved to three structured questions, so this looks outdated. Verify. It asked which subject.
3. "What if I wanted to transfer later on…?" **Misread.** It answered about transferring "from a UK university back to the US", because the previous message was about the UK. A student meant college-to-college transfer. It then pushed the essay again.
4. "Write the first paragraph of my personal statement…" Correctly refused and offered to help the student find the opening moment.

- **Answers or acts?** It is a chatbot with navigation chips. Each reply ends with an "Essay Studio →" button, always the same one regardless of the question. It did not add a school, create a task or save anything.
- **Real data?** Yes. It used the true word count (130). It did not mention the AI review score, the three themes or the Dev story.
- **Context?** Yes within the session. After sign-out and login, Coach history was preserved (all four exchanges were shown).
- **Drift:** the essay nag ("most urgent thing on your plate") was repeated in the transfer answer, which deflected the question.
- A survey popup ("How's your experience?") appeared inside the Coach panel after the fourth message.
- The dark Coach panel on the warm light site is a visual mismatch.

### 8. Continuity
- Fresh logins in new browser contexts showed the onboarding result, essay state (Revise, 130 words), Coach history and the school list.
- Sign out (Settings, "Sign out") lands on the homepage. `/cc/dashboard` then redirects to `/login?next=%2Fcc%2Fdashboard`.
- Today changed after my actions (from the "Find the experience" card to "Return to your personal statement · Revise").
- The one weak point is the long wait (up to 30 s) on a slow login. A login at phone width sat on "Signing in…" and then showed the login form again.

### 9. Variant students (all four exist in production)
| Account | Result |
|---|---|
| `e2e-v-g9` | "Grade 9 · Explore: Start with what makes you curious." "There is room to explore. You don't need an application plan today." Cards: Your interests, High-school coursework, activities, "Application tools come later." Good and age-appropriate |
| `e2e-v-junior` | "Grade 11 · Make a plan: A little clarity. A good next step." "Keep shaping your school list." Notes "No upcoming dates saved for your schools" |
| `e2e-v-transfer` | "Transfer · Your next chapter." Shows QA Community College, Fall 2027 and 34 credits. Next step is the transfer essay. It adapts sensibly |
| `e2e-v-unknown` | Shows "Which grade are you in?" with six options and a safe skip |

- Issues:
  - The transfer student's list has no transfer-specific tools (articulation or credit-transfer check). I only saw the dashboard cards and did not open the Transfer profile page.
  - The grade question appears only to unknown-grade accounts, and new accounts cannot reach it because onboarding asks the grade.
  - Only the Grade 12 view has the full toolset. The Grade 9 view hides the school list.

### 10. Settings and billing
- Settings shows account, role, grade, plan ("Pro trial. You're trying Pro. A signup trial is not a paid subscription. Your trial ends Oct 10, 2026. Confirm the date and any charge before checkout."), credits balance and a dashboard-suggestions toggle. It is clear and honest.
- "See options after my trial" goes to `/pricing`. Choosing "START PRO, $15/MONTH" opened Stripe Checkout (live mode), showing "Try KairosLearn Pro, 6 days free, then US$15.00 per month starting 10 October 2026", "Total due today US$0.00". I stopped there.
- **Contradictions (Major).**
  - `/pricing` says "Free 7-day trial. No card required", but Stripe asks for card details.
  - `/pricing` says the Free plan has "3 schools, 1 essay draft, 3 voice sessions / month, English only". The homepage says Free is "200 credits, once at signup… Credits do not renew monthly". The signup page says "Free 7-day Pro trial… 200 AI credits". The memory file and CLAUDE.md describe still another plan (28 free courses).
  - `/pricing` shows the signed-out nav ("SIGN IN / START FOR FREE") to a signed-in student, and its "Coach Kairos chat" row has no values in the feature table.

### 11. Counselor linking (qa-s2)
- Today shows "YOUR PEOPLE: Your counselor: QA Counselor One. QA Test Agency". It is plain text: not clickable, with no message, no "what they can see" and no status.
- The student has no way to know what the counselor sees. `/cc/share-settings` is a generic "Generate a link… They won't need an account" page, with toggles for Essays, Activities, School List, Recommendations and Interview Scores. It does not mention the linked counselor.
- A student not yet linked sees "A counselor can be part of this. If your school or counselor sent you an invite link, open it to connect." That is clear.

## Top 10 student-experience fixes, ranked

1. **`/schools` and the catalog: seed UK schools, add more Canada data, or hide UK until they exist.** Selecting "United Kingdom" returns "No schools found." A UK or Canadian student cannot build a list, so the three-country promise breaks at step one. Fix: seed `cc_schools` for GB (from `src/lib/cc/uk/schools.ts`), add deadlines and location for the 12 Canadian rows, and hide the UK option until data exists.
2. **Onboarding: ask country (US/UK/Canada) and application year, and carry grade, country and affordability into Profile and Net price.** Today the grade does not appear in `/profile`, `/cc/net-price` shows an affordability bucket nobody entered, and the dashboard cannot be country-aware. Everything after onboarding depends on these answers.
3. **Today: add a "this week" and "next deadline" block.** The dashboard answers only "what now". It says "No upcoming deadlines" even with a Feb 1 school saved. Fix the deadline parsing (probably year-less strings) and show the next three dated tasks.
4. **`/pricing` and signup: one consistent plan story.** Free vs trial vs credits are described three different ways, and "No card required" is false at Stripe. A student or parent deciding about money needs one correct statement.
5. **`/applications`: country-specific checklist and plan options.** McGill and Toronto get "Common App" and "Aid filed" and ED/EA/REA. Add OUAC and UCAS plans and checklists, show the deadline on each card, and add reach, target and likely labels with a one-line explanation of ED/EA/RD.
6. **Essay review (Revise phase): fix hallucinated praise and score inflation.** The AI praised dialogue that was not in the draft and gave 85 "STRONG" to a 130-word draft with no schools. Gate or caveat the review below about 60% of the word limit, ground the "working" bullets in quoted text, and drop "Application fit" when the student has no schools.
7. **Coach Kairos: read the question, then act.** The transfer answer was wrong (UK to US), every reply ends in the same "Essay Studio" button, and the essay nag derails the answer. Use the student's saved country, stage and transfer flag. Offer actions that change something: "Add these schools", "Create a task", "Open UCAS checklist". Also refresh the UCAS answer (three structured questions).
8. **`/profile`, `/cc/chances`, `/cc/summer`, `/cc/interview-prep`: loading and error states.** Pages sit blank for 15-45 s, and `/cc/summer` returned a 504. Add skeletons and an error message with a retry button, and investigate the middleware and DB latency. A student will close a blank page.
9. **Student documents area.** There is nowhere to keep a transcript, score report or aid form. The Applications checklist ("Transcript", "Test scores") cannot be backed by an upload. Add a private files section tied to each checklist row.
10. **Counselor link on Today and design consistency.** Make "Your counselor" a card with what they can see, last review and a message or "request review" button. At the same time, retire the older dark pages (`/my-schools`, `/timeline`, `/pricing`, `/college-interviews`, and the black School List and Coach panel) so the student does not feel they changed apps.
