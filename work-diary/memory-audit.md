# Student context and Coach memory — audit matrix

2026-09-25. Added by founder to the original session prompt. This is a feature-by-feature audit, not a declaration that all persistence/authorization paths pass. Source-only means current local code, possibly different from deployment. Live cases use founder-owned synthetic users only.

## Results by feature

| Feature | Saved context / source target | Live persistence evidence | General Coach retrieval / remaining gap |
|---|---|---|---|
| Identity/region | cc_student_profiles via profile/identity | test8 CA/Ontario/Grade11 survives reload and later login091/103–104 | Region read095; citizenship must not be inferred. Rapid grade/year debounce risk source-only, not reproduced. |
| Transfer profile | transfer-profile writes student profile | test7 school,32credits,Fall2027 saved; GPA3.50 absent090 | Coach wrongly reports those three saved fields missing. SELECT/prompt omit transfer fields. Later-login not retested. |
| Courses | cc_courses via courses | test1 save/reload018/new-login GET200 retain QA Robotics elective; count initially0, later login correctly1 | Not queried by Coach; stale-count cause not established. Admin DELETE ownership gap source-only. |
| Schools/application states | cc_student_schools | tests2/4/5/6/8 save/reload; stage dashboards track statuses; test8 Waterloo recalled after new login104 | School names/bands included, application status omitted from Coach SELECT. Other status recall not passed. |
| Essay brainstorming | cc_essays.brainstorm_transcript and interaction records | test4 reload and new-login106–109;8turns retained, draft empty | Studio gets transcript, but falsely denies prior-session memory then recalls on neutral follow-up. General Coach omits brainstorming. |
| Essay canvas/outline | essay canvas/outline fields | test4 canvas_fragments[],outline_json=null; UI bullet directions not proof of selection save | Second-essay transcript isolation passes123; selected-outline persistence remains untested. Generic parsed bullets may mislead. |
| Draft/revision | cc_essays and cc_essay_drafts | existing qa-s1 draft187words and prior review survive new login116 | General Coach includes active owned draft/AI review. No new prose written; full revision history untested; second blank essay isolation checked123. |
| Human feedback | cc_counselor_comments + essay review state | graduate draft hidden from student; shipped API delivery after head publication; qa-s1 notes visible/resubmit/head approve116–117 | Human comments absent from general Coach. Brainstorm UI hides published feedback. Final student new-login GET200/approved/comments2 and visible Approved label verified118. |
| Activities/resume | parsed entries→cc_activities/cc_honors; original file not retained in parse route | Synthetic1095B PDF parse200; save, description edit, reload and new-login GET200 pass121 | Coach sees count1 but cannot name/read saved activity122. Source selects activity_name while schema/record uses organization; likely cause, not confirmed DB error. No original-file download control. |
| Honors | cc_honors via profile/import | Synthetic honor import, description edit, reload/new-login GET200 pass121 | Coach cannot read honor122; source omits honors. Separate profile keystroke-save race not reproduced. |
| Test strategy | cc_test_plan | test2 result survives reload and new-login GET200; quiz answers reset | Coach explicitly cannot read recommendation120. Separate academic.test_strategy does not bridge saved plan. Correction untested. |
| Summer | cc_summer_experiences | test2 save/reload/new-login GET200 retain QA summer robotics | Coach explicitly cannot read log120; correction untested. |
| Visits | cc_college_visits | test2 synthetic Michigan visit save/reload/new-login GET200 | Coach explicitly cannot read log120; correction untested. |
| Majors | cc_major_explorations | test1 generation200 and later-login GET200 retain engineering results | Coach uses separate intended_major preference, not quiz output. |
| Recommenders | cc_recommenders | test3 POST200/ID, GET200empty/reloadempty045–046: FAIL | Omitted from Coach; context_notes dropped in source; ownership filters missing on PATCH/DELETE. No emails sent. |
| Interview reflection | interview_post_reflections keyed user_id | test5 synthetic reflection/feedback save/reload072 and later-login GET200 | Content omitted; Coach only checks interview session existence. |
| Aid/net-price/CSS | calculator computes transient estimates; CSS guide static | /cc/net-price404077 | Profile affordability/aid flags included, calculator output omitted. No saved-estimate/file claim. |
| Waitlist/LOCI | waitlist_management can save draft; generation transient until explicit save | MIT waitlist matches status076; no LOCI generated/sent | Waitlist record/status omitted from Coach. Saved-letter runtime not tested; authorship/fact risks remain source-only. |
| Supplements | cc_essays keyed supplement/school | Surface/source audit; no all-transition or per-program applicability pass | Counts/by-school phases and owned active draft/AI review included; brainstorming omission still applies. |
| Coach text | cc_coach_conversations keyed student_id | test8 correction + logout/login recall passes099–104. test9 starts empty101–102. | UI50/model20 messages. No indefinite memory/retrieval proof. One stored reply needed reload; browser-busy confound recorded. |
| Voice | shared conversation rows, mode voice; profile voice setting | Not audio-tested | Source seeds8turns; extraction mode skips intake/academic/preference branches; background failure not clearly surfaced. |
| Family/parent | cc_family_mode_turns/invites separate from student Coach | Not token/privacy-tested | Source family prompt receives high-level summary and8turn history; not automatically merged into student Coach. |
| Agency files/tasks/chat | Essays/comments exist; generic vault/DM/digest absent in inspected implementation | Roster/member access and review state tested110–117; no file/chat workflow available to pass | No agent memory of a complete agency workflow should be promised. Private drafts must remain excluded from student context. |

## Distinguishing storage from recall
- Test8 seed: Cedar Lantern robotics, Tuesday2hours corrected to Saturday mornings3hours, Ontario-only commuter preference. After logout→test9→logout→test8, Coach recalls corrected details and Waterloo. History200count8; profile stillCA/Ontario/11. This tests recent history only.
- Test4 seed: Amber Compass repair club, failed light sensor, asking a teammate, curiosity over appearing perfect. Reload and new login restore notes. First returning-session question gets a false no-previous-memory answer. Neutral follow-up gets all four details without supplied answers. Persistence PASS; reliable conversational recall FAIL.
- General Coach on that same essay cannot access brainstorming. Local Coach query includes current_draft/revision_comments but not brainstorm_transcript or human counselor comments.
- Student read isolation: test10 own history200empty; test4 essay/feedback404; qa-s1 counselor file403. Graduate sees only assigned test9; unassigned qa-s1 file403. These do not clear write/multi-agency/removal boundaries.
- Save/extraction errors can be logged while response generation continues. Successful text generation is not evidence the conversation or inferred profile update was saved.
- Second test4 essay123 starts clean and neutral recall returns no project from the first essay. >20-message recall, voice/family, corrections and further transitions remain explicit gaps.

## Source evidence and next design
See memory-source-review.md and memory-feature-source-final.md for exact files/lines; both are CODE ONLY. Lead independently inspected coach/message profile/essay/activity/school/history selections, extraction dispatch, essay transcript context, course DELETE and recommender mutation filters. No destructive foreign-record probes were run. Different ownership keys are a normalization concern, not by themselves a privacy exploit.

Proposed memory contract in agency-agent-design-proposal.md: authoritative feature records refreshed per turn; scoped relevant-history retrieval; compact versioned summaries; source record/timestamp/provenance; explicit corrections supersede prior facts; consequential inferences stay unconfirmed; visible save/retry state; published-feedback-only student context; delete/export behavior and isolation evals. Not implemented or greenlit.
