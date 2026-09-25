# KairosLearn Student Memory & Persistence Source Review

> **Scope Note:** Static source audit of `src/` and `supabase/migrations/` as of 2026-09-25. Distinguishes source code implementation from deployed runtime state. Zero essay prose generated.

**Lead validation note:** transfer SELECT/context omissions, latest20/latest50 windows and extraction mode dispatch independently inspected. SPA account-switch leak is a source hypothesis, not a reproduced runtime result; test8→hard-navigation signup test9 yielded clean history/UI101–102. Wording such as “the new user sees” below is conditional on provider lifecycle and must not be treated as a verified exploit. Essay brainstorming is omitted from Coach prompt, but Coach does receive drafts/reviews; only brainstorming context is the asserted missing bridge. Other table/path assertions still require targeted confirmation before repairs.

## 1. Table of Evidence: State, Tables, History, and Model Inclusion

| Feature / Domain | Save & Read Endpoints | DB Table(s) & Ownership Key | History Window | Model Context Injection | Source Discrepancies & Failure Modes |
|---|---|---|---|---|---|
| **Identity & Grade** | `PATCH /api/cc/profile/identity`<br>`GET /api/cc/profile` | `cc_student_profiles`<br>(PK `id`, FK `user_id`) | N/A (single record) | `studentName`, `grade`, `country`, `state`, `isFirstGen`, `isInternational` | `IdentityForm.tsx:92-97` debounce bug: rapid grade change fires `graduation_year` and cancels `grade_level` timer via `clearTimeout(timerRef.current)` (`L50`). |
| **Transfer Profile** | `POST /api/cc/transfer-profile`<br>`GET /api/cc/profile` | `cc_student_profiles`<br>(PK `id`, FK `user_id`) | N/A (single record) | **None** (`coach/message/route.ts:59-75` omits transfer columns from SELECT) | `transfer-profile/route.ts:11-20` updates school/term/credits but silently discards transfer GPA. CoachContext has 0 transfer fields. |
| **Course Planning** | `POST,GET,DELETE /api/cc/courses` | `cc_courses`<br>(FK `student_id`) | N/A (all rows) | **None** (`coach/message/route.ts` never queries `cc_courses`) | `courses/route.ts:53`: `DELETE` filters only by `id`, omitting `student_id` ownership check. Coach has zero knowledge of courses. |
| **School List & Status**| `GET /api/cc/school-list`<br>`PATCH /api/cc/applications/update` | `cc_student_schools`<br>(FK `student_id`, `school_id`) | N/A (all rows) | School names + `chancing_band` (`coach/message/route.ts:288-302`) | `application_status` is omitted from `coach/message/route.ts:290` query and `ApplicationSnapshot`. Coach cannot see application status. |
| **Essay Studio Brainstorm**| `POST /api/cc/essays/[id]/brainstorm`<br>`GET /api/cc/essays/[id]` | `cc_essays` (`brainstorm_transcript`), `cc_essay_interactions` | Unbounded (all turns in JSON array) | Full activities, honors, academics, parent PS draft/themes (`essay-helpers.ts:179`) | Completely isolated from Coach Kairos. Coach only reads `current_draft` and AI `revision_comments` (`coach/message/route.ts:161`). |
| **Counselor Feedback** | `GET,POST /api/cc/essays/[id]/counselor-feedback` | `cc_counselor_comments`<br>(FK `artifact_id`), `cc_essays` | Shipped-only comments | AI `revision_comments` only in Coach; **No human comments in Coach** | Draft comments hidden via `onlyShipped: true` (`counselor-feedback/route.ts:22`). Coach Kairos prompt never receives `cc_counselor_comments`. |
| **Activities & Resume**| `POST /api/cc/activities/save-parsed`<br>`GET /api/cc/profile/activities` | `cc_activities`, `cc_honors`<br>(FK `student_id`) | Positions 1-10 / 1-5 | Top 3 activities by `impact_score` only (`coach/message/route.ts:278`) | Uploaded resume file is parsed and discarded; raw binary/text is never persisted. Coach sees top 3 activities only, 0 honors. |
| **Recommenders** | `GET,POST /api/cc/recommenders` | `cc_recommenders`<br>(FK `student_id`) | All rows | **None** (`coach/message/route.ts` never queries `cc_recommenders`) | `recommenders/route.ts:42,56`: `context_notes` parsed from body but omitted from insert. GET uses `.single()` on profile query. |
| **Test Strategy** | `GET,POST /api/cc/test-strategy` | `cc_test_plan`<br>(FK `student_id`) | Latest row | `academic.test_strategy` string only (`cc_academic_profiles:92`) | `test-strategy/route.ts:56-80`: raw quiz answers discarded; only recommendation stored. `cc_test_plan` is never queried by Coach Kairos. |
| **Summer & Visits** | `GET,POST /api/cc/summer`<br>`GET,POST /api/cc/visits` | `cc_summer_experiences`, `cc_college_visits` | All rows | **None** (neither table queried in `coach/message/route.ts`) | Both persist correctly by `student_id`, but Coach prompt builder has zero awareness of visits or summer programs. |
| **Major Exploration** | `GET,POST /api/cc/major-quiz` | `cc_major_explorations`<br>(FK `student_id`) | Latest row | `preferences.intended_major` only (`cc_school_preferences`) | Suggested majors/careers in `cc_major_explorations` are never injected into CoachContext. |
| **Interview Reflection**| `GET,POST /api/cc/interview-reflection` | `interview_post_reflections`<br>(FK `user_id`) | All reflections | `hasInterviewSessions` boolean only (`interview_sessions:122`) | Uses `user_id` instead of `student_id`. `interview_post_reflections` and AI feedback are never queried by Coach Kairos. |
| **Coach Text History** | `POST /api/cc/coach/message`<br>`GET /api/cc/coach/history` | `cc_coach_conversations`<br>(FK `student_id`) | UI: 50 turns (`history:29`)<br>Model: 20 turns (`message:392`) | Recent 20 turns (`role`, `content`) + system prompt | Discrepancy: UI shows 50 messages, LLM prompt gets only 20. User turn insert failure (`message:417`) logs error but still streams LLM. |
| **Coach Voice Mode** | `GET /api/cc/coach/voice-prompt`<br>`POST /api/cc/coach/voice-turn` | `cc_coach_conversations`<br>(FK `student_id`, `mode='voice'`) | Agent seed: 8 turns (`voice-prompt:173`) | Shared system prompt + 8-turn resume seed | `voice-turn/route.ts:123` runs extraction with `mode='voice'`. `coach-extract.ts:42-48` skips intake, academic, and preferences! |
| **Coach Family Mode** | `POST /api/cc/coach/family-mode/message` | `cc_family_mode_turns`<br>(FK `student_id`) | 8 turns (`message:83`) | `familyModeSystemPrompt` + high-level summary | Completely separate table from `cc_coach_conversations`. No extraction pipeline runs. Token portal is read-only. |

## 2. Core Architectural Findings & Hypotheses

1. **Profile Debounce Race (Identity Data Loss):**
   In `src/components/cc/profile/IdentityForm.tsx:49-59`, `save` clears `timerRef.current` on every call. In `IdentityForm.tsx:92-97`, changing Grade triggers `update("grade_level", grade)` and immediately `update("graduation_year", gradYear)`. The second call cancels the first timer. `grade_level` is never sent to `PATCH /api/cc/profile/identity`.
2. **Cross-User Stale Client State on Re-login:**
   In `src/contexts/CoachKairosContext.tsx:92, 140-161`, `historyLoaded = useRef(false)`. On SPA logout/login without full window reload, `historyLoaded.current` remains `true` and `messages` state is never cleared. The new user sees the previous user's chat transcript. Furthermore, `localStorage` keys (`coach_kairos_language`, `coach_kairos_voice_enabled`) are not scoped to `user.id`.
3. **Extraction Mode-Gating Blindspot:**
   In `src/lib/cc/coach-extract.ts:42-58`, extraction routes strictly by `mode`: `"intake"`, `"academic"`, or `"school-builder"`.
   - Voice turns pass `mode="voice"` (`voice-turn/route.ts:123`), completely bypassing intake, academic, and school preferences extraction.
   - Post-intake corrections in text mode receive `mode="general"`, preventing profile or GPA updates from chat corrections.
4. **Window Asymmetry & Lost Saves:**
   - History window mismatch: `history/route.ts:29` serves 50 turns to client, but `coach/message/route.ts:392` injects only 20 turns into the LLM context.
   - User message write error (`coach/message/route.ts:417`) logs to console but does not abort streaming, resulting in unsaved user turns.
5. **Essay Studio vs. Coach Kairos Memory Isolation:**
   - Essay brainstorming (`cc_essays.brainstorm_transcript`) is never passed to Coach Kairos (`coach/message/route.ts:161` only selects `current_draft` and `revision_comments`).
   - Brainstorming LLM prompt (`essay-helpers.ts:57-63`) receives unbounded transcripts without sliding window truncation.

## 3. Bounded Synthetic Live Test Suite (Independent Protocol)

- **Test 1 (Debounce Drop):** Select Grade 12 in UI. Verify Network tab. *Expected defect:* Only `graduation_year` payload is sent in PATCH request; `grade_level` is absent.
- **Test 2 (Cross-User History Leak):** Login as test8, send distinct phrase `"SYNTH_TEST8_ALPHA"`. Log out and log in as test9 in same browser tab. *Expected defect:* If no hard reload occurs, test8's transcript remains visible in Coach drawer due to `historyLoaded.current`.
- **Test 3 (Voice Mode Extraction Failure):** In voice mode, state: *"My unweighted GPA is 3.95 and I want to study CS."* Check `cc_academic_profiles` and `cc_school_preferences`. *Expected defect:* Fields remain NULL because `mode='voice'` skips academic extraction.
- **Test 4 (Essay Studio Isolation):** Brainstorm 3 distinct essay themes in Essay Studio for test4. Open Coach Kairos on `/cc/essays/[id]` and ask: *"What themes did we just brainstorm?"* *Expected defect:* Coach responds with no knowledge of brainstorming notes.
- **Test 5 (School Status Omission):** Update application status for a school to "Accepted". Ask Coach Kairos: *"What is my status for [School]?"* *Expected defect:* Coach cannot answer because `application_status` is omitted from `ApplicationSnapshot`.
