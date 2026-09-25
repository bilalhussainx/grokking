# Agency collaboration and specialist agents — proposal, not implementation

Status: candidate design for founder review after Track 1. No live behavior, migration, provider, deployment, or pricing change is implied. Read alongside the live audit and agency-source-independent-review.md.

## The complete service journey

1. Student explores a counselor profile with agency affiliation, expertise, availability, service scope and prices maintained by that counselor. No invented reviews or success rates.
2. Student sends an interest request to the chosen counselor. One request thread contains the introductory message and response. Duplicate requests join the existing thread; they do not generate repeated alerts.
3. Counselor accepts the relationship by issuing a single-use invitation addressed to that student. Show agency, intended counselor, expiry and service scope before redemption. Validate the intended counselor belongs to the agency on both issue and redemption.
4. Redemption creates one relationship transactionally. Returning to the link shows the existing relationship. Dashboard permanently identifies the agency, primary counselor, assigned graduate and who can access shared materials. Signup/onboarding preserves the invitation destination.
5. Head counselor assigns students and review tasks to agency graduates. Assignment includes owner, due date, deliverable and whether head approval is required. The receiving member sees only permitted students/tasks.
6. Student submits a document version for review. Assigned reviewer works from that immutable submitted version, leaves private notes or proposed feedback, and returns the task to the head when approval is required.
7. Head publishes the feedback or requests reviewer changes. Student sees only published feedback. Student uploads a revised version and resubmits; prior versions and decisions remain accessible.
8. Ending the engagement removes active access according to the agreed retention policy and leaves the student with an export of their own materials. Do not silently retain agency access indefinitely.

## Three workspaces with different priorities

- Student home: this week's next actions, upcoming verified deadlines, my counselor, reviews waiting for me, and my documents. Grade and application stage select the useful tasks; missing data is an invitation to add it, not a completion claim.
- Assigned counselor home: assigned students, due reviews, unanswered student requests and tasks awaiting head decisions. One actionable queue with filters, not a stream of every student event.
- Head home: incoming requests, unassigned students, overdue work, approval queue and workload by staff member. Head can delegate from a student record or a review task and see who owns the next action.

## Documents and saved artifacts

Use one student workspace organized by applications, academic records, activities, financial-aid materials and correspondence. Every item has an owner, category, school/application link when relevant, version history, sharing scope and review state.

Distinguish an uploaded file, a student-authored essay, a sourced research note, a counselor feedback artifact and an AI planning artifact. They can appear in the same workspace without pretending they have the same provenance or editing rules.

Provide search, school/category/status filters and a clear current version. Bulk actions must expose the affected students and documents before changing access. Private files require authorization before upload, list, preview, download and deletion; knowing a document or essay identifier must not grant access.

Review states: draft → submitted → assigned → in review → awaiting head approval (when required) → changes requested / approved → revised and resubmitted. Store the version reviewed with every decision. A counselor's approval means that version was reviewed; it does not imply submission to a university.

Current gaps: the live Attach button has no handler; the source inventory found essays but no general file workspace; existing comment creation must verify essay/student/agency ownership together. Repair those behaviors before presenting file management as available.

## Chat without notification overload

Keep one relationship inbox, with optional document/task context attached to a message. The conversation remains searchable; it is not an alternative file store.

- Unread state is per member and thread, based on the last read message. Opening a thread updates only that member's state.
- Group routine messages and edits by student/thread. Multiple messages from one student produce one inbox item with an unread count.
- Notify the currently responsible counselor. Head receives escalations and approval requests rather than every assigned counselor conversation.
- Default routine external notifications to a chosen digest; allow quiet hours, per-thread mute and assignment-aware preferences. In-app history remains available while notifications are muted.
- Urgent flags need an explicit reason and a real deadline or service-level rule. A student's repeated messages do not automatically raise urgency.
- An accepted invitation, assignment, requested review and published feedback are discrete workflow events. Delivery retries must not duplicate the event or notification.
- Before sending, show exactly who receives the message. Internal agency notes and unpublished graduate feedback must be visibly separate from student messages.

## Specialist agents as proposed capabilities

These are bounded roles with tools and evidence requirements, not promises that specialized knowledge is already installed.

| Role | Useful output | Evidence and human boundary |
|---|---|---|
| Student planning coordinator | Prioritized next actions from grade, region, goals and outstanding tasks | Explain which profile/task data it used; ask for missing essentials; counselor can revise the plan |
| School requirements researcher | Program-specific checklist and deadline differences | Official source URL, retrieved date, entry cycle and program; flag conflicts and stale records |
| Course and pathway adviser | Prerequisite gaps and questions for the school counselor | Country/province/curriculum-specific requirements; no unsupported equivalency claims |
| Opportunity and aid researcher | Eligible opportunities with exclusions and estimated preparation work | Verified sponsor source and current dates; distinguish eligibility from an award prediction |
| Essay interviewer and critic | Questions, structure, evidence gaps and critique in the student's words | Never write or rewrite essay prose; test this invariant across tools, exports and delegated agents |
| Application completeness reviewer | Missing or inconsistent fields/documents across a student application | Cite the actual record/version; do not submit applications or represent a checklist as official acceptance |
| Agency review assistant | Summary of changes since last submitted version and draft reviewer checklist | Private to the assigned reviewer; human approval required before student-visible feedback |
| Deadline and workload assistant | Conflicts, overdue work and suggested task reassignment | Ground alerts in recorded deadlines and ownership; do not invent urgency or silently change staff assignments |

## Shared knowledge and tool contract

Knowledge records carry source, retrieval date, applicable cycle, country, institution, program and scope. A claim without sufficient evidence is labeled unknown or withheld. Reconcile conflicting sources explicitly; do not convert missing prices to zero or derived scores into admission probabilities.

Every agent reads only records the requesting user can access. Treat uploaded content and retrieved pages as data, never as authority to change permissions or execute instructions. Separate private agency notes, student records and public institutional knowledge.

Planning, searching, summarizing and drafting structured tasks can be automatic within consent. Publishing feedback, contacting people, changing access, submitting applications, payments and destructive operations require the corresponding human authority and concrete reviewable content.

Store a compact action log: actor, tool, relevant record/version, cited sources, result and approval where required. Use idempotent writes for retries. Surface partial failures to the user rather than marking work complete when a tool call fails.

## Verification required before these features are called ready

- Ten distinct synthetic students exercise stage-aware onboarding and separate records; transfer and Ontario follow their own pathways.
- A founder-owned test counselor receives an interest request, issues a student-bound code and sees the same relationship after redemption and reload.
- Head assigns one student to a synthetic graduate; that member can access the assigned work but another member/unassigned student cannot.
- Approval-required feedback stays invisible until head publication; review-state changes cannot bypass that gate.
- Upload, preview, download, version submission, feedback and resubmission complete with two users and persist after reload.
- Unauthorized essay/document identifiers are rejected at every read and mutation endpoint, without exposing another student's content.
- A burst of synthetic messages yields the intended single grouped notification; mute, digest and reassignment behave as specified.
- Specialist outputs include valid sources when making external claims and reject requests for generated admissions essay prose.

Implementation order should be approved with Gate 1: repair identity/ownership and false-success defects, establish the shared app shell, complete relationship and assignment flows, add private files/review, then quiet messaging and grounded specialist tools. Homepage and each later surface retain the explicit approval gates from codex-new-session-prompt.md.
# Memory and context extension — founder addition 2026-09-25

Proposal only; not implemented or greenlit. The recent-login Coach test passes, but course/transfer/brainstorm context gaps and differing history windows mean transcript storage is insufficient.

- Keep original conversations and versioned feature records scoped to the authenticated student. Resolve current facts from those records at each turn, with source record ID, timestamp and permissions.
- Use a compact student context summary plus retrieval of relevant older exchanges. Preserve provenance and uncertainty; never claim permanent recall merely because messages are stored.
- Treat explicit student corrections as superseding prior values. Store proposed inferred facts separately until confirmed when consequential (eligibility, citizenship, academic results, deadlines). Residence is not citizenship.
- Bridge EssayStudio notes, canvas, selected outline and published human feedback into Coach only for the relevant student/essay and authorized role. Draft counselor feedback remains private until head publication. Retrieval must not generate essay prose.
- Each feature save emits a version change so dependent dashboard/Coach views refresh. A failed save or extraction must be visible and retryable without duplicating rows. An AI acknowledgement is not a successful-save signal.
- A “What Kairos remembers” view lets students inspect/correct facts and see source/date. Chat can cite an internal saved item separately from an external official admissions source.
- Separate short-term dialogue, confirmed profile facts, student plans, school requirements and private agency notes. Define retention/deletion and revoke access when relationships end.
- Acceptance: new login recalls the corrected schedule; facts outside the20-message window retrieved; new course/brainstorm/status immediately available; no stale transcript after account switch; source save failures surfaced; removed counselor denied; no private draft leakage; no essay prose generated.
