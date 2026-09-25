# KairosLearn live audit — 2026-09-25

Status: consolidated initial audit for Gate1 review. Product implementation and production acceptance have NOT passed. Ten new founder-owned synthetic students span Grades9–12, Ontario and transfer. Test1–9 are linked; test10 is intentionally unlinked. Additional fixtures: qa-c1 head, astra-graduate1 supervised graduate, existing qa-s1/s2 students. No real users contacted, paid service published, deployment or migration.

Evidence: work-diary/screenshots/001–123 (desktop and375px shown), matching DOM/text/console/network records under work-diary/evidence, events.md and audit-matrix.md. Capture alone is not a pass. Loading/stale captures081/093/103 have replacements or qualifications085/095/104;067desktop is a loading shell. Chronological QA11–59 detail is preserved in work-diary/audit-chronological-through-115.md.

Local prerequisite commit9e5e0f5: build0, TypeScript0,393 source tests in43files, targeted lint0errors/one pre-existing warning. NOT deployed. Default unit scripts contain database reset fixtures and were excluded from restored production. Correct configured Supabase ref: irnxkvjhrzfqboucufdd; authenticated health200. Dashboard display name was not verified.

## Top ten problems
1. **Ownership gaps, source-only (P1).** Counselor comment writes do not bind essay to authorized student; reads lack agency scope. Admin-backed course deletion and recommender mutations lack student filters. Verify and repair in an isolated test database before expanding sharing (QA18/19).
2. **Incomplete supervised review, live (P1).** Graduate prose stays private, but review-state changes bypass head approval. Head has no publish-comment button. Published comments are invisible in live Brainstorm (QA20,112–115).
3. **Mobile Essay Studio/navigation, live (P1).** Narrow vertical headers, overlapping controls, overflow and missing mobile feature navigation obstruct work at375px (QA24/31/38;048/113/116).
4. **Fragmented memory, live and source (P1).** Coach misses saved courses, transfer facts, brainstorming and human feedback. Text prompt gets20recent messages despite50visible history. Essay Studio retained notes but inconsistently recalled them (QA30/53/56/58/59).
5. **Agency operations incomplete, source and UI (P1).** No usable general file vault, relationship chat, grouped notifications, staff task queue or student reassignment UI found. Tables/APIs alone do not establish workflows (QA21/22).
6. **False saves/dead routes, live (P1).** Recommender creation200/listempty, transfer GPA discarded, Settings/net-price404, Attach no-op (QA27/37/41/48/51).
7. **Wrong regional/stage assumptions, live (P1).** Ontario/Canadian schools and transfer students receive US high-school defaults and inappropriate application framing (QA26/43/50–54).
8. **Unverified claims/data, live (P1).** Testimonials, fit precision, unknown cost shown as$0, inconsistent rates and prior-cycle deadlines lack provenance. Observed claims are not certified facts (QA12/32/35/42/44/46/49/55).
9. **Relationship/identity continuity, live (P1).** Signup loses invitation destination; connected counselor is not clear; names supplied at signup become Unnamed student and staff UUIDs (QA23;110/111/114).
10. **Misleading priorities/counts, live (P1/P2).** Empty dashboards say All deadlines logged; fixed targets look personalized; concerns do not affect priorities; pricing/trial promises conflict and navigation duplicates (QA13/14/33/36/40/47).

## Homepage, pricing, stories and counselor marketing
Purpose: explain value and route students/agencies. Evidence001–007. In ten seconds the price comparison is clearer than grade-specific help; AI/human counseling are conflated. Pricing uses conflicting trials and unexplained credits. Stories combine illustrative labels with purported real admit outcomes. Unsigned marketplace discovery redirects to login.
Design deviations: duplicate app/marketing headers, mixed logos, excessive mobile spacing, decorative neural background, oversized centered copy. Counselor costs, student counts, admit outcomes, language counts, savings, counselor ratios and speed promises need dated proof or removal. No checkout exercised. Guest glossary401/500 and preload warnings are logged.

## Signup, onboarding and counselor linking
Ten real-form signups succeeded after backend recovery. Stage onboarding completes; test8 regional changes persist. Invitation context is lost through new signup/onboarding; manual links succeed201. Test9 preassigned code correctly links the graduate. Dashboard lacks durable counselor identity. Signup names do not populate roster names; concerns do not deliver promised prioritization. Long language grids, generic learning/credits copy and unclear confirmation impede comprehension. Exact persona limits: work-diary/audit-matrix.md.

## Student dashboard and navigation
Purpose: prioritize stage-appropriate work. Submitted and decision variants respond correctly to saved statuses (071/074). Empty seniors nevertheless see All deadlines logged and supplements0of1; the saved course initially did not update its count (a later login correctly shows1). Fixed PSAT targets/calendar dates lack student/cycle basis; Submitted0 refers to essays, not the nearby submitted application. At375px cards clip, sidebar disappears and More exposes legacy navigation. Settings404 repeats.
Ten-second gap: completed, suggested and unknown work look alike. Use concrete next actions/missing-data states and a consistent mobile shell using DESIGN.md tokens (015/026/041/055/071/074/082/092/105).

## School list, applications and supplements
Purpose: save choices and requirements. Michigan/Toronto/Waterloo saves survive reload. In-progress/submitted/accepted/waitlisted statuses persist and drive dashboards (028/031/043/044/057–059/070/075/096–097).
Coach auto-opens over mobile schools; unknown Toronto cost appears$0, filters/checklists assume US/Common App. Acceptance-rate formatting differs in interview prep.2025–26 deadlines appear without cycle/source labels in September2026. Empty tracker loses app context; supplement headers crowd mobile.
Source persists supplements as essays and passes counts/by-school phases to Coach. Program-specific applicability and every transition remain unverified. Unknown cost is not free; school data needs official dated validation.

## Essay Studio and human review
Purpose: interview, structure and critique while the student writes. No essay prose generated/rewritten. Synthetic drafts are empty; existing qa-s1 draft unchanged.
Test4 Amber Compass brainstorming survives reload and logout/login. A returning-session prompt received a false memory denial; neutral follow-up recalls four details without answer priming. API retains8turns/empty draft. General Coach cannot retrieve those brainstorming notes (106–109). Persistence PASS, recall consistency FAIL.
Attach has no action. Brainstorm/Revise at375px have severe overlap/overflow (048/113/116). Auto-generated canvas bullets are not proof of saved selected theme/outline; those fixture transitions are untested.
qa-s1 sees both published head notes in Revise, resubmits via UI; head receives resubmitted and approves via UI (116–117, JSON). After another login the student API returns approved200/comments2 and the UI displays Approved by your counselor (118). This is a state-transition test, not prose revision quality.
Test9 graduate comment is hidden before publication and returned as shipped by the student API after head publication. Live Brainstorm still has no review panel. Local all-phase-panel code is not deployed evidence.

## Profile, courses, activities and honors
Purpose: retain the actual student record. Grade9 course save/reload passes; form defaults Grade11/US and excludes ordinary course levels. Transfer school/32credits/Fall2027 persist, but GPA is lost. Ontario identity survives new login; course defaults remain US.
Activities empty state offers resume import while referring to profile entry without a useful link. Source imports structured activities/honors but does not retain the original resume file. It is not a file vault. Coach source attempts top3activities plus counts, not honors/courses; its activity_name selection disagrees with the organization field in inspected schema. Live122 sees count1 but cannot retrieve the saved activity name/description; honor is also inaccessible. Query mismatch is a source-supported diagnosis, not a verified production database error. Synthetic PDF upload/parse200 and two-entry save now pass121; description edits survive reload/new-login. There is no original-file download control; original-file retention is unsupported in inspected source. Honors autosave/profile debounce risks are source findings, not reproduced data-loss tests.

## Majors, testing, summer and visits
Purpose: explore and retain planning choices. Major generation200 uses unexplained precise fit scores. Test2 SAT recommendation survives reload, quiz answers reset. Synthetic summer/visit entries persist after reload (020/029–033/038–039).
Grade9 visit school picker is empty with no add-school path, but school is optional in source, so all logging is not blocked. Regional program/eligibility examples lack sources/dates. Coach does not query saved quiz/test-plan/summer/visit records; manual intended-major/test-strategy fields are different. New-login GET200 now confirms test2 SAT/summer/visit records and test1 major results; Coach explicitly cannot read those test2 logs120.

## Recommenders and interviews
Recommender POST200 returns ID but GET200/listempty persists after reload. Ordering by created_at, absent in inspected schema/response, is a likely diagnosis, not a verified production DB error. No email sent.
Test5 synthetic interview reflection/feedback persists after reload and new-login GET200. School coverage is limited and Toronto rate formatting inconsistent. Coach gets an interview-session-exists flag, not reflection content. Source recommender mutation ownership gaps need isolated verification.

## Aid, waitlist, family and voice
Live /cc/net-price404 despite local code; local calculator estimates are transient. MIT waitlist follows synthetic status. LOCI generation is enabled with empty fields and source requests unsupported specifics without retrieval; no letter generated/sent, so no observed-output hallucination is claimed.
Family chat uses separate storage/history and student summary in source. Voice shares conversation storage but seeds fewer turns and skips extraction branches. Audio devices, family tokens and runtime privacy boundaries were not exercised; these remain explicit acceptance gaps.

## Coach memory
Test8 recalls Cedar Lantern project, corrected Saturday3-hour schedule, Ontario commuter preference and Waterloo after logout/login. Test9 starts empty and receives no test8 details. Test10 foreign test4 essay/feedback reads404 and counselor-file403.
These prove bounded recent-history/read isolation, not permanent recall/all authorization. Source UI50/model20/voice8 windows differ. Courses, transfer fields, brainstorming and human comments are absent from general prompt. Some save/extraction failures log errors while responses continue. One stored response appears only after reload; browser-busy timing confounds root cause.
Per-feature evidence, unknowns and source citations: work-diary/memory-audit.md, memory-source-review.md, memory-feature-source-final.md. Distinguish stored records from model input.

## Agency, files, chat and notification workflows
Team UI adds graduate with requiresReview. Graduate enters counselor workspace without student onboarding. Test9 join201; graduate sees only test9 and another test file403; head sees11expected linked students, test10absent (110–115).
No preassignment UI; API fixture only. UUIDs/Unnamed student and no roster search/filter/workload queue hinder scale. Used1/1 codes remain active, meaning not revoked rather than redeemable capacity.
Graduate Request changes bypasses review requirement; head sees drafts without publish control. Synthetic head PATCH200 proves backend publication only. No general file organization/versioned submission, relationship DM, digest/quiet controls or staff-task UI found; session-room source has placeholders. Service requests create quote engagements, not roster links. No priced service published/real counselor contacted.
Static risks: comment essay/student binding, comment agency scope, invite member validation, task-assignee access and student mutation ownership. Passing reads does not clear writes. Details: work-diary/agency-source-independent-review.md.

## Coverage and release limits
All ten new personas exist; coverage is individual in audit-matrix.md. Shared surfaces were sampled across stages, not every transition repeated under every account. Remaining: remaining feature transitions and corrections, voice/family, multi-agency/removal boundaries, general file storage/download and paid-interest UI. Missing capabilities are not passing. Never run production-reset fixtures to fill gaps.
This audit supports prioritization, not a production-ready declaration. No new product code beyond prerequisite commit, migration, pricing or deploy is authorized by this report.

## Proposed order and specialist agents
Recommend homepage3hook directions/shared mobile system first (Gate2.0), then signup/linking/navigation/dashboard; agency roster/student record/approval queue; Essay Studio/memory visibility; schools/applications/private files; activities/profile/courses/testing/majors/visits/summer; aid/scholarships/interviews/waitlist/family/voice; pricing consistency. Founder must approve this adjustment; every later surface retains its own gate. Scholarship matching remains first in Track3 unless pilot blockers are explicitly reprioritized.
Proposed bounded specialists: official-source requirements researcher, regional pathway adviser, aid/opportunity researcher, essay interviewer/critic, application completeness reviewer, agency briefing/triage assistant. Shared memory needs provenance, corrections, version/permissions and retrieval of relevant older history. Private graduate drafts must not enter student prompts. See work-diary/agency-agent-design-proposal.md for concrete relationship, file, digest and memory design. None is claimed implemented.




Additional persistence evidence119-123: test1 courses/major results and imported activity/honor edits; test2 SAT/summer/visit/school records; test5 reflection all survive new login via own authenticated GET200. Test4 second essay has no first-essay marker before/after neutral recall and no draft prose123. This is bounded essay isolation, not all memory scopes.119 is an unsubmitted-prompt capture;120 is its actual response.
