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
