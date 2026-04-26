# Features Testing Guide

How to manually verify each implemented feature. Each feature lists the prerequisites, the steps, and what you should observe. Failures should be filed as fix-up tasks; do not advance to the next phase until the current phase passes.

---

## Phase 1 — Senior User Depth

### Feature 1A — Hindi / Punjabi voice + multilingual coach

**Prereqs:**
- Migration `supabase/migrations/20260425_feature_1a_voice_mode.sql` applied.
- `NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED=true` in `.env.local` to test the canvas extraction.
- Reset a test profile with: `UPDATE cc_student_profiles SET language_picker_seen_at = NULL, voice_quality_check_passed_at = NULL, home_language = 'en' WHERE user_id = '<id>';` and `UPDATE cc_essays SET canvas_fragments = '[]'::jsonb WHERE student_id = '<id>';`

**Tests:**
1. **Picker redirect.** Log in. Expect redirect to `/onboarding/language`. Pick Français. Expect redirect to `/?coach=open&focus=intake` and Français in TopNav.
2. **Picker stickiness.** Reload `/`. Expect no redirect. Log out, log back in. Expect no redirect. Sign up a fresh user → expect redirect.
3. **Coach drawer text in Hindi.** TopNav → हिन्दी. Open coach drawer, type a Hindi sentence. Expect Devanagari reply.
4. **Coach drawer text in Punjabi.** TopNav → ਪੰਜਾਬੀ. Type a Punjabi sentence. Expect Gurmukhi reply.
5. **Urdu text-only mode.** TopNav → اردو. Open coach drawer.
   - Mic button is disabled with tooltip "Voice not supported for this language".
   - Volume icon is greyed.
   - Type "میرا نام بلال ہے" — input renders RTL in Nastaliq; reply is RTL.
   - Type mixed: "میں MIT جانا چاہتا ہوں" — "MIT" stays LTR inside the RTL flow.
6. **Coach voice sub-second.** Switch to Français. Tap mic. Say "bonjour, comment ça va aujourd'hui". Pause 2.5s. Within ~500-800ms the coach replies in French audio. Coach knows your school list / essay state because the dynamic prompt was fetched.
7. **Bilingual brainstorm Fragments.** Open any essay → brainstorm phase in Hindi. Type a substantive Hindi message about a personal experience. After the reply, switch right rail to Story canvas. New "Fragments" card shows an English sentence extracted from your Hindi turn + tag chips. "Directions" card sits below it.
8. **Family Mode.** TopNav → हिन्दी. Open coach drawer. Click the Users icon (right of Languages icon). Full-screen overlay opens with big gold mic. Tap mic, say "अपने बच्चे के बारे में बताइए". Coach replies in Hindi (text bubble + browser TTS). Click "Hand back" — overlay dismisses to your prior route. Open normal coach history — Family Mode turns are NOT visible (separate `cc_family_mode_turns` table).
9. **Voice quality check.** Reset `voice_quality_check_passed_at = NULL`. Open brainstorm in Hindi. Toggle voice on. "Before we start" card appears with mic permission + 3-second test record/playback. Click "Yes, sounds good". Reload — card no longer appears.
10. **English regression.** Switch to English. Walk brainstorm + outline + draft + revise. Confirm nothing regressed.

---

### Feature 1B — Voice GPA explainer + translate-for-parent + 11pm prompt

**Prereqs:** none beyond Feature 1A.

**Tests:**
1. **Working-late prompt.** Manually advance system clock to 11pm (or wait). Reload any authenticated page. Bottom-right toast: "Working late? Coach Kairos is here whenever you need." Click X to dismiss; reload — should NOT reappear (per-day localStorage). Tomorrow it should reappear after 10pm.
2. **Translate for parent (route-level).** `curl` the endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/cc/translate-doc \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"content":"Your child should aim for the CSS Profile by November 15.","targetLang":"ur","docKind":"aid_summary"}'
   ```
   Expect `{ translated: "<Urdu text>", isRTL: true, ... }`.
3. **Voice GPA explainer (lib).** In a Node REPL or test:
   ```ts
   import { buildGPAExplanation } from "@/lib/cc/gpa-converter";
   buildGPAExplanation("ur", { rawScore: 87, rawDisplay: "87% FSc", conversion: { gpaLow: 3.5, gpaHigh: 3.8, confidence: "approximate" }, system: "percentage" });
   ```
   Expect Urdu text mentioning 87%, 3.5-3.8 GPA, and "Additional Information section".

---

### Feature 2 — Application Deadline Calendar

**Prereqs:**
- Migration `20260426_feature_2_application_tracker.sql` applied.
- Add at least 3 schools to the school list via `/schools` (e.g. MIT, Harvard, Cornell).

**Tests:**
1. **Auto-populated deadlines.** After adding MIT, navigate to `/applications`. The MIT card has `deadline_ea: 2025-11-01` and `deadline_rd: 2026-01-04` already filled. (Verify in Supabase if needed.)
2. **Kanban board.** `/applications` shows 4 columns: Not started / In progress / Submitted / Decisions. Each school card has plan badge, next-deadline, 0/7 progress bar.
3. **Status updates.** Click any card to expand. Change application_status from dropdown — refresh the page; status persists. Card moves to the appropriate column.
4. **Component checklist.** In the expanded card, check "Common App". Refresh — checked state persists; progress bar advances 1/7.
5. **Urgency.** Find a school whose next deadline is <14 days. Card border is rose. Top-of-board banner shows "Deadline alert: N deadlines within 14 days".
6. **Calendar view.** Visit `/applications/calendar`. Monthly grid renders deadlines as colored pills (rose = EA/ED/REA, amber = RD, sky = aid/CSS, emerald = FAFSA). Sidebar shows next 10 upcoming.
7. **iCal export.** Click "Export to calendar (.ics)". File downloads. Open it — valid `BEGIN:VCALENDAR` ... `END:VCALENDAR` with one VEVENT per deadline. Drag-import into Google Calendar — events appear on correct dates.

---

### Feature 3 — Activities Optimizer narrative layer

**Prereqs:** Feature 2 schools added; at least 3 activities entered in `/cc/activities-optimizer`.

**Tests:**
1. **Narrative panel locked.** With < 3 activities entered, the Narrative Diagnosis panel shows "Add at least 3 activities to unlock the Narrative Diagnosis."
2. **Analyze My Story.** With ≥ 3 activities, click "Analyze My Story". Within a few seconds:
   - Profile-type badge: SPIKE / WELL-ROUNDED / UNCLEAR (correctly colored).
   - "What admissions sees" paragraph (specific to your activities, not generic).
   - Strengths chips (emerald), gaps chips (amber), suggested-additions chips (sky).
   - "For your school list" recommendation that names schools from your list.
3. **Cultural context (Pakistani).** Add an activity titled "Khuddam al-Ahmadiyya" in the optimizer. Re-run "Analyze My Story". The diagnosis should include a culturalContextNotes entry explaining what Khuddam al-Ahmadiyya is for U.S. admissions readers.
4. **Description enhancer (route-level).**
   ```bash
   curl -X POST http://localhost:3000/api/cc/activities/enhance \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"description":"I was the captain of my robotics team and helped organize meetings","position":"Captain","organization":"FRC Team 1234","activity_type":"Athletics: JV/Varsity"}'
   ```
   Expect `{ currentlyCommunicates, strongerVersion (<=150 chars), diff }`.

---

### Feature 4 — Supplemental Essay Studio

**Prereqs:** Migration `20260426_feature_4_supplements.sql` applied. Add at least 3 schools that have seed prompts (MIT, Yale, Harvard).

**Tests:**
1. **Dashboard.** Visit `/cc/essays/supplements`. Each school in your list shows as a card with required-prompt count and 0% progress bar.
2. **Per-school workspace.** Click a school (e.g. MIT). All seed prompts list with type badge, word limit, "required" tag. None have status yet.
3. **Start an essay.** Click "Start" on a prompt. Routes to `/cc/essays/<id>` (existing editor). The supplement is saved with `essay_type: 'supplement_short_answer'` and `prompt_text` populated.
4. **Word-count + trim.** In the editor, write 300+ words for a 100-word-limit prompt. The word count should reflect over-limit. Then `curl`:
   ```bash
   curl -X POST http://localhost:3000/api/cc/supplements/trim \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"draft":"<your 300-word draft>","wordLimit":100}'
   ```
   Returns `{ trimmed, finalCount: <=100 }` preserving voice.
5. **Reuse detector — school leakage.**
   ```bash
   curl -X POST http://localhost:3000/api/cc/supplements/check-reuse \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"draft":"I love MIT'\''s hands-on culture and faculty research opportunities.","schoolName":"Stanford"}'
   ```
   Expect `{ flagged: true, schoolLeakageDetected: "MIT" }`.
6. **Reuse detector — high overlap.** Save a substantial draft (>50 words) for a Brown supplement. Then call `check-reuse` with the same text but `schoolName: "Yale"`. Expect `flagged: true` with `reuseScore > 0.55`.

---

### Feature 5 — ED / EA / REA strategy

**Prereqs:** Feature 2 in place. Add MIT, Harvard, NYU, Cornell to your school list.

**Tests:**
1. **"Which plan?" explainer.** On `/applications`, click "Which plan should I choose?". Modal shows comparison table for ED/EDII/EA/REA/RD/QuestBridge.
2. **REA conflict banner.** Set Stanford's plan to REA and MIT's plan to EA. Top-of-board banner: "REA conflict: You selected REA for Stanford. REA restricts EA/ED to other private schools — change MIT to RD..."
3. **REA + public school is fine.** Set Yale plan to REA, UMich plan to EA. No conflict banner.
4. **ED warning state — safe.** Set `affordability_value` to 80000 for the test profile in Supabase. Set Cornell to ED. Expanded card shows green banner: "ED looks safe: ED is a strong choice if this is your #1".
5. **ED warning state — warning.** Set `affordability_value: 0, needs_full_aid: true`. Set Cornell to ED. Expanded card shows amber banner: "ED warning: ED is binding — and aid you receive could fall short" with alternatives "Apply EA" / "Apply RD" / "Run NPC".
6. **ED warning state — block.** Set `is_international: true` (still aid-dependent). Set NYU to ED. Expanded card shows red banner: "ED not recommended: NYU is need-aware for international applicants..." with alternatives.
7. **Plan-not-accepted note.** Set MIT plan to ED. Expanded card shows "Heads up: MIT doesn't offer ED" (MIT is EA-only).

---

## Phase 2 — Complete the Senior Counselor Pipeline

### Feature 6 — Waitlist management

**Prereqs:** Migration `20260426_feature_6_waitlist.sql` applied. At least one school in your school list.

**Tests:**
1. **Waitlist auto-listing.** On `/applications`, change a school's status to "waitlisted". Visit `/cc/waitlist`. Expect that school in the list.
2. **LOCI generation.** Click "Open LOCI generator". Fill "What's new since you applied" with 1-2 specific updates. Fill "Why this school is right" with one specific program. Click "Generate LOCI". Within seconds: 250-300 word letter that names your update, names the school's specific program, signs off with your preferred name.
3. **Save + send.** Click "Save draft". Reload `/cc/waitlist` — the saved draft is reflected. Click "Mark as sent". The card now shows a green "LOCI sent" badge.
4. **No regression.** Change status to "considering" on `/applications`. The school disappears from `/cc/waitlist`.

### Feature 7 — Teacher recommendation submissions + ask emails

**Prereqs:** Migration `20260426_feature_7_recommenders.sql` applied. The existing `/cc/recommenders` page is unchanged; new endpoints can be exercised via curl.

**Tests:**
1. **Add a teacher.** Use the existing UI on `/cc/recommenders` to add Mr. Smith (AP Calc).
2. **Generate ask email.**
   ```bash
   curl -X POST http://localhost:3000/api/cc/recommenders/ask-email-text \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"recommenderId":"<id>","teacherName":"Mr. Smith","subject":"AP Calculus","relationship":"Pushed me on related rates problems"}'
   ```
   Expect a 150-200 word email body that names AP Calc + the relationship + asks if they can write a STRONG letter + offers brag sheet/transcript.
3. **Track submission per school.**
   ```bash
   curl -X PATCH http://localhost:3000/api/cc/recommenders/submission \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"recommenderId":"<recId>","studentSchoolId":"<schoolId>","submitted":true}'
   ```
   Returns `{ ok: true }`. Then GET `/api/cc/recommenders/submission` — see the row with `submitted: true, submitted_at: ...`.

### Feature 8 — Interview reflection + questions to ask

**Prereqs:** Migration `20260426_feature_8_interview_reflection.sql` applied.

**Tests:**
1. **School-specific questions.** Visit `/cc/interview-prep/reflect`. In the "Generate questions to ask" card, enter "MIT" + interests "robotics, biology". Click Generate. Expect 3 specific questions naming MIT-specific items (e.g. UROP, IAP, the makerspace) — none generic.
2. **Different schools differ.** Generate for "Georgetown" — questions reference different programs (e.g. School of Foreign Service, Jesuit values). Outputs must NOT be the same as MIT.
3. **Reflection + AI feedback.** Fill the reflection form: school = "Yale", went-well = "I got into a real conversation about my Quranic studies activity", was-hard = "Talking about my GPA struggles", confidence = 7. Click Save. Within seconds the past-reflections list shows your entry with a 120-180 word AI feedback paragraph that names the Quranic studies moment specifically + names the GPA-talk moment as the work-on point.
4. **Confidence trend.** Submit 3+ reflections. The "Confidence trend" bar chart appears (only renders ≥2 entries with confidence_score set).

### Feature 9 — SAT/ACT strategy engine

**Prereqs:** Migration `20260426_feature_9_test_strategy.sql` applied.

**Tests:**
1. **Quiz recommendation — SAT.** Visit `/cc/test-strategy`. Answer all 6 questions choosing SAT options. Click "Get my recommendation". Recommendation card shows "Recommended: SAT" + reasons + a "Register →" link to satsuite.collegeboard.org.
2. **Quiz recommendation — ACT.** Reset, choose ACT options. Recommendation flips to ACT with a link to act.org.
3. **Quiz BOTH.** Mix evenly. Recommendation says "BOTH" with a "weak — take both diagnostics" note.
4. **Fee waiver — eligible.** Check "I receive free or reduced-price lunch". Submit quiz. Fee-waiver banner: green, "You qualify based on free/reduced-price lunch...".
5. **Fee waiver — international.** In Supabase set `is_international = true` for the test user. Resubmit. Banner: white/grey, "SAT/ACT fee waivers are only available to U.S. domestic students..."
6. **Score log.** Add an SAT attempt: 2024-10-05, total 1480. Reload — appears in Score history.

---

## Phase 3 — Broader Audience

### Feature 10 — Parent Communication Portal

**Prereqs:** Migration `20260426_feature_10_parent_portal.sql` applied.

**Tests:**
1. **Create invite.**
   ```bash
   curl -X POST http://localhost:3000/api/cc/parent-invite \
     -H "Content-Type: application/json" -H "Cookie: <session>" \
     -d '{"parentEmail":"abu@example.com","parentName":"Abu","preferredLanguage":"ur"}'
   ```
   Returns `{ invite: {...}, inviteUrl: "http://localhost:3000/parent/<token>" }`.
2. **Token-only auth.** Open the inviteUrl in an incognito window (no Supabase session). Page renders the parent portal — no redirect to `/login`.
3. **Localization.** With `preferredLanguage: ur`, the page renders RTL with Urdu headings ("خوش آمدید", "درخواست کی حیثیت", etc.). Repeat with `hi`, `pa`, `en`.
4. **Privacy.** Parent portal shows school list with chancing band + status, financial aid posture summary, essay-stage counts. Verify it does NOT show: brainstorm transcripts, draft content, GPA struggles.
5. **Expiry.** In Supabase, set `expires_at` to a past date. Reload the URL. Page shows "Invite expired".

### Feature 11 — Course Rigor

**Prereqs:** Migration `20260426_features_11_14.sql` applied.

**Tests:**
1. **Add courses.** Visit `/cc/courses`. Add 4 AP courses (AP Calc BC, AP Bio, AP Chem, AP Lit) all grade 11.
2. **Analyze rigor.** Click "Analyze rigor". Within seconds: rigor badge ("most_rigorous" or "very_rigorous") + a summary that NAMES specific courses, + strengths + gaps.
3. **International translation.** In Supabase, set `is_international = true, country = 'PK'`. Add 4 FSc-Pre Med courses. Re-analyze. The `internationalNote` field in the response should explain how FSc translates for U.S. readers.

### Feature 12 — Major + career exploration

**Prereqs:** Migration `20260426_features_11_14.sql` applied.

**Tests:**
1. **Quiz with chips.** Visit `/cc/majors`. Click 3 chips (e.g. "biology", "philosophy", "social justice"). Click "Suggest majors".
2. **Result shape.** Within seconds: narrative thread blockquote + 4-6 suggested majors each with fitScore (1-10) + 3-5 career paths.
3. **Persistence.** Reload `/cc/majors`. Saved exploration is still visible (re-hydrated from `cc_major_explorations`).

### Feature 13 — College visit tracker

**Prereqs:** Migration `20260426_features_11_14.sql` applied. At least 1 school in your school list.

**Tests:**
1. **Log visit.** Visit `/cc/visits`. Pick a school from the dropdown, set date, type "in_person", click Add. Visit appears in History.
2. **Demonstrated interest indicator.** Log 2 visits to the same school. The "Demonstrated interest" section shows "2 touchpoints" in emerald green. 1 = amber. 0 = grey.
3. **Virtual tour links.** The fixed list of 5 (MIT/Harvard/Stanford/Yale/Princeton) is clickable.

### Feature 14 — Summer experience planning

**Prereqs:** Migration `20260426_features_11_14.sql` applied.

**Tests:**
1. **Add experience.** Visit `/cc/summer`. Add "AKU summer hospital volunteer" / Volunteer / 2025-06-15 → 2025-08-15. Appears in Logged.
2. **South Asian alternatives card.** Visible by default — shows 7 hardcoded entries explicitly tagged for Pakistani / international applicants.
3. **Honest framing.** "Family business shift work — log honestly as 'job'" entry is visible (this is the "translate culturally for admissions" promise).

---

## Phase 4 — New User-Type Dashboards

### Feature 15 — Junior Year (grade 11) Dashboard

**Prereqs:** Migration `20260426_phase_4_dashboards.sql` applied. Set `grade_level = 11` for the test profile.

**Tests:**
1. **Visit `/cc/dashboard-junior`.** Renders. Header shows "Junior year" + "X days until Common App opens (August 1)" countdown that counts down realistically.
2. **Phase checklist.** 6 phases shown with tile-style links to schools / test-strategy / essays / activities-optimizer / visits.
3. **Brainstorm-only note.** The Essay Studio tile carries "Draft + revise unlock at grade 12".
4. **Wrong grade redirect.** Set `grade_level = 12`. Visit `/cc/dashboard-junior`. Page shows "This dashboard is for grade 11. Your profile says grade 12" + back link.

### Feature 16 — Grade 9 Dashboard

**Prereqs:** Set `grade_level = 9` for the test profile.

**Tests:**
1. **Visit `/cc/dashboard-grade9`.** Renders 4-year game plan with the current grade highlighted in gold.
2. **What-matters list.** 5 entries each with `<thing>` + `<why>`.
3. **Tile grid limited.** Only Courses / Majors / Summer tiles. Footer: "Essay Studio, Application Tracker, SAT/ACT Strategy, Interview Prep, and Financial Aid are unlocked at grade 11."
4. **Wrong grade redirect.** Set `grade_level = 11`. Visit `/cc/dashboard-grade9`. Shows mismatched-grade message.

### Feature 17 — Transfer Student Dashboard

**Prereqs:** Migration `20260426_phase_4_dashboards.sql` applied.

**Tests:**
1. **Empty state.** Visit `/cc/dashboard-transfer` for a fresh user. Form shows: current school, credits completed, target term, why-transfer essay prompt.
2. **Save profile.** Fill in: "UC Davis", credits 30, "Fall 2026", "Wanted research access I can't get at my current school". Click Save. Form replaced with read-only summary view + "Edit" button.
3. **GPA recovery framing.** Amber-bordered card visible: "A weaker first-year GPA followed by an upward trajectory is one of the most common transfer narratives…"
4. **Tile grid points at transfer-specific tools.** Why-transfer essay (Essay Studio), Transfer school list (Applications), Professor recs (Recommenders), Course evaluations (Courses).

---

## End-of-Phase-4 final checklist

After all 17 features pass their individual tests, verify cross-feature stability:

1. **TypeScript.** `npx tsc --noEmit` returns clean for everything in `src/`.
2. **Unit tests.** `pnpm test:unit` is all-green (181+ tests).
3. **English regression.** Walk a full senior flow in English: pick language → onboarding → add 3 schools → enter activities → run rigor analysis → run narrative diagnosis → start a personal-statement brainstorm → start an MIT supplement → log a campus visit → log a summer experience → log an interview reflection → take the SAT/ACT quiz → invite a parent → mark one school waitlisted → generate a LOCI. Each surface should work without regressions.
4. **Hindi text regression.** Switch to Hindi via TopNav. Brainstorm in Hindi → confirm Devanagari reply + Fragments card extraction.
5. **Urdu RTL regression.** Switch to Urdu. Type a coach drawer message — RTL/Nastaliq, voice toggle disabled, mixed-script content (Urdu + English school names) renders correctly.
6. **Voice latency regression.** With Coach Kairos in Français, voice mode replies within ~500-800ms.
7. **All migrations applied.** Run the verification queries in each Phase's prereqs to confirm the schema is current.

---
