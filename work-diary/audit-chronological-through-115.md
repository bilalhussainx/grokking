# KairosLearn live audit — 2026-09-25 (in progress)

Target: https://www.kairoslearn.com. Browser: gstack headless Chromium. Desktop 1440×900; mobile 375×812. Screenshot pairs are in `work-diary/screenshots/`; corresponding DOM/text/console/network in `work-diary/evidence/`. Captures are displayed to the founder as each is inspected. This report distinguishes live observations from local source inspection; authenticated coverage remains in progress.

## Build baseline
Commit `9e5e0f5`: auth types/callers, missing-client loading initialization, marketing route-change menu, menu regression, existing demo fallback lint fix and typed audit fixture. Build exit 0, TypeScript exit 0, targeted lint 0 errors, 393 isolated unit tests pass in 43 files. Complete unit command contains database integration tests with resetting fixtures; initial run failed while Supabase was unavailable. Do not rerun those against restored production. Initial source test timeouts during concurrent build disappear on sequential rerun.

## Findings register
| ID | Severity | Evidence type | Finding |
|---|---|---|---|
| QA-11 | P0, recovered | Live 002/006/008 | Signup/login unavailable while configured Supabase project was paused; DNS failure then CORS failure during restoration. Founder restarted project; qa-c1 login now 200. Treat restored backend as prerequisite, not product fix. |
| QA-12 | P1 | Live 001/003/007 | Public claims are not substantiated on page: $8,000 counselor comparison, named admit outcomes labeled illustrative, language counts and savings claims. Remove or supply verified dated evidence before redesign approval. |
| QA-13 | P1 | Live 003 | Pricing promises both 7-day trial and one month free; live $12, 300 signup credits and free-tier caps differ from requested $15/$99 and 200-credit model. Backend pricing remains a separate gated change. |
| QA-14 | P2 | Live 003/004/007 | Marketing pages render both app header and marketing header; duplicative navigation, mixed logos and extra vertical overhead on mobile. |
| QA-15 | P1 | Live 005 | /find-counselor redirects an unsigned visitor to login, so selecting a counselor before contacting them is blocked by signup. |
| QA-16 | P1 | Live 008 | Head counselor dashboard centers paid engagements and service onboarding, not agency roster/review workload. Implementation-phase language appears in product copy. |
| QA-17 | P1 | Live 008 | Mobile head dashboard has no visible Students/Team navigation in viewport; four large empty stats consume first screen; counselor name truncates. Full mobile navigation interaction still pending. |
| QA-06 | P1, reconfirmed | Live 008 network | Authenticated glossary request returns 500; public mounts return 401. Prior finding remains open. |
| QA-10 | P1, reconfirmed | Live 009/010 | Direct /counselor/team navigation bounces to dashboard; sidebar navigation works after role state loads. Survey interrupts the roster. |
| QA-03 | P1, reconfirmed | Live 011 | Two existing test students display as Unnamed student plus UUID; no search/filter/attention queue visible. |
| QA-09 | P2, reconfirmed | Live 010 | Team copy still says Samsara, head identified by UUID, exhausted invite codes still labeled active. Mobile invite table clips controls. |
| QA-18 | P1 | Source review | Comment POST authorizes roster student but does not check submitted essay belongs to that student; comment helper accepts arbitrary essay ID. No exploit attempted. |
| QA-19 | P1 | Source review | Counselor comment reads lack agency filtering, so multi-agency student links may expose another agency's draft feedback. Runtime/deployed-schema verification pending. |
| QA-20 | P1 | Source review | Requires-review applies to comment prose but not review-state actions; no head publish-draft control found. Clarify and enforce approval boundary. |
| QA-21 | P1 | Source review | Paid assignment API exists without UI; assigned status omitted from dashboard buckets; nonprimary assignee still lacks student-file visibility. |
| QA-22 | P1 | Source review | Student file implements essays only; no general agency documents repository, relationship DM, or quiet/digest notifications found in inspected code. |

## Homepage — 001-live-home
Does: public marketing hook and school-list chat teaser.
Ten-second comprehension: strong price comparison, weak explanation of how grade-specific counseling or agency support works. Mobile first viewport omits the interactive school-list teaser.
Visual issues: decorative neural canvas and long centered/large copy conflict with new design brief; desktop/mobile navigation and logo differ.
Claims: $8,000 comparison, user counts/languages and aid promises require validation or removal. Local uncommitted copy differs from production.
Console/network: guest glossary 401; CSS preload warning. Evidence is the saved network/console, not an assertion that the whole page works.

## Signup — 002-signup
Does: name/email/password or Google entry.
Initial outcome: Failed to fetch from Supabase DNS failure. After restoration test1 and test2 real form signup succeeded; test1 completed onboarding and redeemed a code. Invitation context is lost through fresh signup/onboarding (QA-23).
Ten-second comprehension: advertises 7-day Pro trial and 300 credits, inconsistent with proposed commercial model. Generic app header and logo differ from landing.

## Pricing — 003-pricing
Does: free/pro feature comparison and CTAs.
Broken/confusing: 7-day versus one-month trial; different free-tier language/school limits; no unit explanation for credits. Factual claims about language support and subsidies need feature evidence.
Visual: two headers and excessive top spacing; pricing requires scrolling on mobile.
Console: guest glossary 401. No checkout or billing mutation attempted.

## Counselor product — 004-counselor-product
Does: sells Coach Kairos to students, with human counselor workspace CTA near bottom.
Confusion: AI counselor and human agency workspace share the same word and page, so Ad Astra sees consumer marketing before its workflow.
Claims requiring evidence: 415:1 ratio, sub-second latency, all listed voice languages, privacy isolation, availability. No external facts verified in this audit yet.
Visual: duplicated nav and large vertical gaps on mobile. Console: glossary 401.

## Marketplace / login — 005-marketplace, 006-counselor-login
Unsigned /find-counselor redirects to /login?next=%2Ffind-counselor. Existing counselor login initially failed during restore, then succeeded (008-auth-recovered-network).
Copy: “continue learning” is legacy positioning; 300 credits promotion distracts from agency sign-in. OAuth destination preservation needs testing: source caller does not pass next to signInWithGoogle.

## Stories — 007-stories
Does: presents quote cards with names and school acceptance outcomes.
Trust issue: simultaneously labels them illustrative and outcomes of real early users. No evidence of consent or verified outcomes is supplied. Proposed handling: remove admissions-result testimonials until verified; use clearly labeled product walkthroughs without invented students/results.
Visual: oversized heading/spacing; double navigation. Console: guest glossary 401.

## Head counselor dashboard — 008-counselor-dashboard
Does: counts paid-review inbox, active engagements, sessions and active services.
Confirmed: qa-c1 authenticated, role-specific sidebar appears on desktop. Not a proof of student assignment/permissions.
Gaps: agency workload is not the main view; no “needs my review” cross-student queue; onboarding text includes “Phase 2 profile editor” and “Phase 4 admin tool.” Mobile name truncates and empty stats dominate. “Engagements” marked active while at dashboard.
Console/network: glossary 500, see 008 logs. Other flows pending.

## Agency team, roster, files, reviews and ten students
Team works by sidebar navigation (010) but not direct load (009). Minted one single-use test invite for Astra test1 grade9; code shown in 010 screenshot and DOM. No counselor preassignment control is exposed in that UI. Roster (011) shows two existing synthetic students as unnamed and is interrupted by a survey. Source inventory is work-diary/agency-source-independent-review.md; its findings are not live exploit verification. Student files and remaining matrix are in progress. Do not infer completion from this report's existence.

## Proposed order (not greenlit)
Restore reliable auth/data first; then homepage direction; auth/onboarding and counselor-link clarity; student dashboard/app shell; agency review queue and student workspace; essays/review lifecycle; application/files; chat and quiet notifications; remaining student surfaces. Reconcile with source prompt at Gate 1; no next-surface approval inferred.

## Specialized agent opportunities (proposals only)
- A source-backed requirements checker by school/program/cycle; show source date and uncertainty, never invent deadlines or odds.
- A grade-aware next-step planner for courses and activities with student constraints; planned work stays distinct from claimed achievements.
- An essay interviewer and critique agent that cannot generate essay prose; independent compliance evals before release.
- An aid analyst wrapping deterministic cost/eligibility logic and verified official data.
- A counselor briefing assistant that groups changes by student, highlights consequential changes and prepares draft task assignments for head approval.
- A file-review assistant that inventories versions, missing materials and requested actions; private scoped access and human approval for external sharing.
# Additional authenticated student findings

- **QA-36: onboarding concerns do not produce promised dashboard pins.** Test3 chose Deadlines+Aid and completed200, but Grade11 dashboard prioritizes School List/Test Strategy/Activities. Local summary uses variant-based priorityWidgets without reading saved concerns. Evidence041–042.
- **QA-37: recommender saved but omitted from list.** Test3 UI submission200; one instrumented diagnostic submission returned saved recommender id f6e1abdf-2711-493b-83b7-67634d5063eb; subsequent GET200 returns recommenders[]. Reload remains empty. Likely cause: GET orders by created_at, absent in inspected migrations and returned row, and swallows query errors. This is a source-supported diagnosis, not a verified production query error. Do not repeat create attempts. Evidence045–046 and test3-recommender-*-response.json. No emails sent.
- **QA-38: essay brainstorm unusable mobile layout.** Header becomes a narrow vertical column with overlapping language/phase/voice controls; phase row and two-column workspace overflow375px, chat content sits outside initial viewport. Desktop interview opens and responds200. Evidence048. No essay prose generated.
- **QA-39: application tracker loses student workspace navigation.** Fresh account sees a single school-list sentence without title/sidebar, unlike sibling tools. Supplements has cramped mobile header links. Evidence043–044.

- **QA-33: Grade10 PSAT target is fixed data presented as a personal target.** Fresh account displays1,420 before scores/goals are collected; local source variants.ts:737 contains literal1,420. Calendar-specific testing advice requires source/date and location context. Evidence026 and DOM text.
- **QA-34: school list auto-opens coach on navigation/reload.** Mobile becomes a full-screen empty coach instead of showing schools. Closing via observed X button works, but X lacks accessible name. /api/cc/me404 appears. Search Michigan, add school and reload persistence succeeded. Evidence028/031.
- **QA-35: testing guidance needs current source review.** Quiz returns SAT200; result makes fee-waiver inference from only two checkboxes, no sourced eligibility details. Claims about exam formats, regional preference and fee waivers must be validated before retaining. This audit has not adjudicated factual accuracy. Evidence029/030.

## Grade9 authenticated surfaces — 014–025
Onboarding: language selection is a long card grid; English → high school → Grade9 completes. Signup invitation is not carried through. Dashboard: grade-appropriate reduced sidebar, but generic name, repetitive priority/explore links, mobile clipping and stale course count. Courses: form saves and reloads but defaults wrong grade, lacks regular course level. Activities: resume-only empty state blocks first activity creation. Majors: generation works, scoring lacks explained basis; no evident task handoff. Visits: school-dependent form with empty school selector; no add-school route here. Summer: record form renders, regional examples unsourced; mutation untested. Settings404. Coach streams a response, clearly states missing course/counselor context. No human counselor connection surface visible after invite. Shared errors: glossary500 and settings404. Captures and action verdicts are individually logged in work-diary/events.md.

## Grade10 authenticated surfaces — 026 onward
Onboarding completed; code redeemed201 after slow auth setup. Dashboard introduces school list/test strategy and a hardcoded PSAT target. School list search/add persisted across reload, but auto-open coach covers mobile content; selected schools have unsourced/date-less numerical/policy snippets. Test-strategy quiz submits200 and shows recommendation, but result appears above the current scroll position without moving focus (030 screenshots show lower form, DOM contains result). Shared activity empty-state issue repeats. Remaining shared-page and workflow coverage pending.

- **QA-28: visits has no usable school picker for a fresh Grade9 student.** Its sole school option is the placeholder, while school-list navigation is locked in this grade's sidebar. No add-school path on the page. Evidence021. Correction after source review: school is optional; an unassociated visit can potentially be saved once a date is supplied. Do not describe all visit logging as blocked. Grade10 with a saved school needs follow-up check.
- **QA-29: summer recommendations need sourcing and context.** Named Pakistan programs and US-recognized wording lack source URLs/dates, displayed before location is collected. Audit does not certify whether these programs exist or remain available. Evidence022.
- **QA-30: saved data does not inform dashboard or coach.** Grade9 course persisted in Courses, but dashboard remains0 courses through reload and Coach explicitly says it cannot access saved courses or linked human counselor. Coach response itself succeeded200 and acknowledged its limits. Evidence018/024.
- **QA-31: mobile navigation omits student features.** Sidebar disappears; More exposes old tech features and application links despite grade locks, with no Activities/Visits link. Evidence025. Do not equate this UI inconsistency with an authorization vulnerability.
- **QA-32: major fit scores imply unsupported precision.** One interest and a short note produce6–10/10 scores and perfect-fit language, without explanation of scoring or uncertainty. POST200 in14.7s; result visible. Evidence020. Propose exploratory suggestions with reasons and a small next action instead.

- **QA-25: early-stage activities empty state is a dead end without a resume.** It says add entries from your profile but offers only resume import and no profile link/add control. Mobile review toolbar clips. Evidence016. No persistence test claimed here.
- **QA-26: courses ignore grade and curriculum context.** Grade9 account defaults Grade11/US; available levels exclude regular/on-level classes. Synthetic course save succeeds and survives reload, but form defaults reset incorrectly. Evidence017–018.
- **QA-27: student settings link points to missing route.** Sidebar points /account/settings and prefetch returns404 on several screens; direct navigation test pending. Evidence016–019 network.

- **QA-23: invitation context lost through fresh signup/onboarding.** test1 started /signup?next=/join/QA-TEST-AGENCY-R8Q5VA, completed Grade 9 onboarding and landed on dashboard without redemption. Manual revisit redeemed POST201. The destination dashboard shows no durable agency/counselor identity. Evidence: 014, 015 and 015-test1-join-network.txt.
- **QA-24: Grade 9 mobile priority cards overflow.** At 375px, the three-column priority section remains a horizontal row with clipped content; the coach launcher overlays it. Desktop dashboard is readable. Grade-specific application tools are hidden as intended, but the dashboard greets the named account only as Welcome. Evidence: 015 mobile/desktop.

## Grade12 writing and file submission — captures055–056
- QA-40: Empty senior dashboard claims All deadlines logged despite zero schools/application records; supplements shows 0 of1 with no known supplement. Default hero asserts November1 deadlines without student school context/source.
- QA-41: Essay brainstorm Attach button is a no-op: real click produced no picker/dialog; BrainstormChat.tsx915–917 has no handler or file input. There is no usable upload workflow here. Distinguish this verified UI defect from broader source-only document-management gaps.
- test4 signup/onboarding200; founder-issued invite join201581ms. Blank essay44477f95-3b9d-4744-ae39-52d4799db616 created2005850ms. No prose entered/generated. Initial automatic brainstorm greeting answered; mobile overlap repeats test3.


- QA-42: Canadian school search (Toronto) shows blank city/province, $0 net price, bare Test badge, and acceptance percentages without sources/dates. Filters only offer US states. Capture057. These are observed UI values, not validated admissions facts; unknown cost must not render as free.

- QA-43: University of Toronto application uses universal Common App checklist and ED/EA/REA/QuestBridge/Coalition options, with no province/platform/prerequisite distinction. Capture058 shows actual list. Saved school POST200 and application status set in progress; reload GET200 and DOM confirmed persistence. School cost shown as $0 in057 is an unsupported displayed value, not a verified price.

- QA-44: Interview Prep prints acceptance_rate directly with a percent sign (page.tsx188–189), displaying0.43% for Toronto versus43% in school list. Source and screenshots confirm inconsistent fraction formatting; underlying admissions rate is not independently validated. Interview practice unavailable for this school; UI lists ten supported US schools. Capture060. Supplements059 lists2required/1optional without program selection on overview; inspect detail/source before trusting applicability.

- QA-45: Student asks how linked counselor access/uploads work; Coach responds it lacks platform specs, directs to support and resumes GPA intake. Honesty is appropriate, but it cannot guide this central collaboration flow. Capture069 and message2005400ms. Aid posture dashboard link points/applications without explicit aid context.

## Submitted-stage follow-ups — test5

- QA-46: Application tracker offers dates from November2025–February2026 on September25,2026 with no visible cycle/freshness/source labeling. Newly saved Harvard record is presented as ready to plan against. Capture070. Verify official current-cycle requirements before replacing values; do not infer new deadlines by adding a year.
- QA-47: After one school's submitted status persists, the dashboard switches to the submitted variant but a lower widget says Submitted0. Source variants.ts764 uses essaysSubmittedCount under the ambiguous Submitted label. It also hardcodes March decision timing and May1 commitment language without the selected school's date/cycle. Capture071 and settled text.
- test5 real signup/onboarding200615ms, invite2011079ms, school add2001315ms, RD plan PATCH200624ms, submitted status PATCH200672ms. Dashboard reload proves stage selection from the saved status. These are synthetic internal records; no university application was sent.
- Source-only discrepancy: Grade11 dashboard says draft/revise unlock at Grade12, but essay page/phase controls and inspected APIs do not enforce that condition. Delegated source extraction is at work-diary/persona-stage-source-extraction-20260925-b.md. Phase-stepper code is legacy in current workspace; do not mistake that old component for a live phase-navigation test. Behavioral grade11 progression remains unverified.

## Decisions, waitlist and aid — test6

- Yale accepted and MIT waitlisted synthetic tracker records persisted; dashboard renders one admitted/one waitlisted and selects the decisions variant. Captures074–075. The collapsed application card does not identify its outcome; an accepted and waitlisted school look alike until expanded.
- QA-48: `/cc/net-price` exists in the local worktree but returns HTTP404 in production (capture077). Decisions dashboard has no direct offer-comparison action despite selected Aid concern. Local code is not deployment evidence; neither financial-aid comparison nor document upload is verified live.
- QA-49: Waitlist UI permits Generate LOCI with both updates and school-interest fields empty (capture076). Local `api/cc/waitlist/loci/route.ts` asks the model to choose school programs/professors when none are supplied and supplies generic continuing-growth fallback. It does not retrieve dated sources. This creates unsupported-fact and student-authorship risk; distinguish LOCI policy scope from the explicit essay-prose prohibition. No letter was generated or sent in this audit.
- test6 onboarding2001562ms; codeTBBJ84 redemption201507ms; Yale/MIT school adds200915ms/1585ms; accepted/waitlisted updates2003954ms/953ms. Dashboard navigation and waitlist list prove persisted states, not a real admission outcome.

## Transfer onboarding — test7
- QA-53: Coach cannot see persisted transfer context. Own-profile GET200 contains school,32credits,Fall2027, but Coach says all are missing and tells student to fill the transfer profile again (message2004176ms,090). GPA really is absent (QA-51); the other three fields are present. School list auto-opens coach (088); Settings404 repeats (089). No essay prose generated.

## Ontario profile and guidance — test8
- Canada/Ontario/Grade11 persist across profile reload091; agency codeF78UZ8 redemption2011047ms. Coach correctly recognizes these three fields. Profile still calls itself a CommonApp profile; citizenship choices only describe US statuses, and multiple inputs have no associated accessible label.
- QA-54: Ontario dashboard still prioritizes SAT/ACT and a CommonApp countdown; course planning defaultsUS(AP) with no Ontario curriculum/prerequisite workflow (092,094). Location alone does not establish target-school system; after explicit Ontario-only goal, contextual planning should support that choice instead of forcing US defaults.
- QA-55: Ontario coach assumes domestic eligibility from residence/grade and gives policy/program claims without dated evidence. It mentions OUAC101, top-six averages and Waterloo AIF with a homepage-level OUAC link and an undated Waterloo link. Official current requirements have not been independently validated here. Do not publish this generated advice as verified.093 captured streaming;095 shows the complete persisted answer after navigation, avoiding a false completion claim.
- Source-only profile-save risk: IdentityForm uses one debounce timer for individual field saves; grade change immediately queues both grade and graduation_year, canceling the grade save. Rapid cross-field edits can similarly discard an earlier field. Not yet reproduced live; inspect and test before a fix claim.

## Memory extension and boundaries — captures099–105
- QA-58: EssayStudio brainstorming persists (test4 API200, four turns, draftempty,106), but general Coach opened on that same essay says it cannot access the saved notes (107) and asks student to paste them again. Source selection omits brainstorm_transcript. This reproduces the missing cross-feature memory bridge; no essay prose generated.
- QA-59: EssayStudio incorrectly denies prior-session memory. After logout/login, old notes and question are visible, but a new-login recall question returns “each conversation starts fresh” (108,brainstorm2005692ms). A neutral follow-up asking it to inspect earlier messages correctly returns all four seeded details without repeating them in the request (109). API200 retains8turns including seed and both replies; draft remains empty. Thus persistence and contextual access exist, but recall behavior/capability description is unreliable; do not diagnose this as deleted history. Add regression evaluations for natural returning-student wording.
- Founder explicitly added per-feature persistence and cross-session Coach memory; see work-diary/memory-audit.md. test8's saved Waterloo reaches Coach; corrected synthetic schedule recalled after logout/login. test9 cleanhistory/API + neutral question show no test8 conversation. test10 foreign synthetic essay/feedback404 and counselor-file403; ownhistory empty. These are bounded successful cases, not a global security or long-term-memory guarantee.
- QA-56: UI/model memory windows differ: history endpoint50messages, model prompt20; feature-context omissions documented in memory-source-review.md (source-only until individually exercised). Recent-session recall passes, older unsummarized details remain at risk; do not promise permanent recall.
- QA-57: After test8 re-login, response was stored but absent from visible chat even with streaming false (103 and test8-recall-ui-status.txt). Reload104 shows it. Browser daemon experienced temporary busy errors during this test; reproduce cleanly before attributing root cause to client state. Database persistence passed.
- QA-50: Transfer onboarding placeholder promises Coach Kairos will draft the transfer essay; sourceonboarding/page.tsx618 and live DOM078. This contradicts the explicit product rule against AI-authored essay prose. Audit used planning bullets only, not generated essay text.
- QA-51: GPA3.50 was entered on transfer onboarding but was not saved: authenticated own-profile GET200 returned academic:null after successful onboarding, while school/32credits/Fall2027 persisted. Sourceonboarding/complete explicitly skips GPA persistence. Evidence078 and test7-persisted-profile-summary.txt.
- QA-52: Transfer dashboard offers misleading destinations. Course evaluations points to the high-school course-rigor form; Translate-for-parent docs points to recommenders; both the hero and priority why-transfer actions point to the generic essay list. Sidebar alone appends type=transfer. Transfer hero urges refining an essay before one exists and overstates essay importance without sources. Evidence079 and DOM link inspection.

- QA-52 follow-up: `?type=transfer` still opens the first-year Common App prompt form (080). Settled course screen085 offers only Grades9–12, defaults Grade11 and US(AP), and has no college credit/equivalency workflow. Recommendations082, activities083, majors084, visits086 and applications087 reproduce their shared surfaces; applications again loses its sidebar. Screens081 are loading shells and are superseded by085 for visual evaluation. All082–087 desktop/mobile images displayed and settled text inspected.
