# Counselor & Agency Marketplace — Roadmap

**Branch:** `feat/counselor-marketplace`
**Status:** Phase 1 in progress (data model + onboarding + discovery)
**Inspiration:** `C:\Users\bilal\projects\educator-app` — its essay-collab WebSocket pattern is the spine of Phase 3.

---

## Why this is a separate branch

Today the platform is **AI-only** (Coach Kairos). This branch adds a **paid human counselor layer** on top — agencies, individual counselors, real-time review sessions, escrow payments, admit-history proof. The product surface roughly doubles. A separate branch makes the scope visible at a glance and lets us ship the existing AI flow without waiting for the marketplace to be production-ready.

Coach Kairos is **not replaced**. The two layers are designed to coexist:

| Surface | AI Coach Kairos (existing) | Human Counselor (this branch) |
|---|---|---|
| When | 24/7, free tier + Pro | Booked, paid per service or package |
| What | Brainstorms, drafts, reviews, suggests | Final read, scoring, fit advice, accountability |
| Voice | Deepgram bundled, student-facing | Deepgram bundled, **counselor-facing note-taking** that converts to inline comments on the student's docs |

The student experience is layered: AI coach is the always-on partner, the human counselor is the senior reader you book when stakes are high (Common App submit week, supplement crunch, interview week, decisions in).

---

## Architecture port map (educator-app → grokking)

| educator-app component | grokking equivalent | Reuse strategy |
|---|---|---|
| Socket.IO server (`server.js`, `essayCollabWebSocket.js` ~760 LOC) | New Next.js API route + a Socket.IO server adapter | **Reuse** the message vocabulary verbatim (`join_essay_session`, `essay_content_sync`, `comment_added`, `essay_chat_message`, `user_presence_update`). Drop the trading / leetcode / terminal namespaces — only `/ws/collaboration` is relevant here. |
| Liveblocks shared editor | Liveblocks (same SDK, drop-in) | **Reuse** — Liveblocks is backend-agnostic. |
| Agora video tokens | Drop entirely | **Replace** with Coach Kairos voice agent (Deepgram WebSocket — already in this repo). Counselor speaks; transcript becomes inline comment drafts. |
| `enhancedAICommentController.js` AI-comment generator | Adapt for counselor-side review | **Reuse** the comment shape (`{ selection_start, selection_end, content, severity, resolved }`). Wire a "AI-suggest comment" button next to the counselor's manual comment composer. |
| `paymentService.js` Stripe Connect (escrow) | Stripe Connect on top of existing Stripe billing | **New** — current Stripe is consumer-side subscription only. Marketplace needs Connect for counselor payouts + escrow on engagement booking. |
| `user_profiles.is_mentor` + filtering search | Dedicated `cc_counselors` table joined to `cc_agencies` | **New shape** — separate tables because counselors have agency affiliation, services, admit history, payout splits. The educator-app's flat profile model doesn't fit. |
| Past sessions / reviews | `cc_counselor_admissions_proof` + reviews table | **Net-new** — educator-app didn't track admit outcomes, this is core to marketplace trust. |

---

## Data model (Phase 1)

```
cc_agencies
  id (PK), slug (unique), name, website_url, logo_url, verified BOOLEAN,
  description, country, founded_year, total_acceptances, created_at

cc_counselors
  id (PK), user_id (FK auth.users), agency_id (FK cc_agencies, nullable for solo),
  display_name, slug (unique), headline, bio, photo_url,
  years_experience, specialties TEXT[], languages TEXT[],
  hourly_rate_usd, accepts_new_students BOOLEAN, verified BOOLEAN,
  total_sessions, average_rating, total_reviews,
  stripe_account_id (Stripe Connect), payout_status,
  created_at, updated_at

cc_counselor_services
  id (PK), counselor_id (FK), service_type ENUM (
    'essay_review_single',
    'essay_review_package',
    'common_app_full',
    'supplement_full_school',
    'interview_prep_session',
    'application_audit',
    'chancing_consultation',
    'activity_strategy_g10',
    'activity_strategy_g11'
  ),
  title, description, price_usd, turnaround_hours,
  scope_jsonb (per-service: which essays, which schools, etc.),
  active BOOLEAN, sort_order

cc_counselor_engagements
  id (PK), counselor_id (FK), student_id (FK cc_student_profiles),
  service_id (FK cc_counselor_services),
  status ENUM ('proposed', 'paid_pending_start', 'in_progress', 'awaiting_student', 'completed', 'cancelled', 'refunded'),
  scope_jsonb (which specific essays / schools this engagement covers),
  price_usd_paid, stripe_payment_intent_id, stripe_transfer_id,
  proposed_at, paid_at, started_at, completed_at,
  student_rating, student_review_text

cc_counselor_admissions_proof
  id (PK), counselor_id (FK) OR agency_id (FK), student_alias,
  graduation_year, school_name, decision ('admitted'|'waitlisted'|'denied'),
  decision_type ('ED'|'EA'|'RD'|'REA'|'rolling'),
  scholarship_usd, verified_by_admin BOOLEAN, evidence_url,
  created_at

cc_counselor_session_comments
  id (PK), engagement_id (FK), essay_id (FK cc_essays, nullable),
  activity_id (FK cc_activities, nullable),
  author_id (auth.users), author_role ENUM ('counselor', 'student'),
  selection_start INT, selection_end INT, selected_text TEXT,
  body TEXT, severity ENUM ('positive', 'suggestion', 'issue'),
  voice_transcript TEXT, ai_summarized BOOLEAN,
  resolved BOOLEAN, resolved_at, created_at

cc_counselor_session_rooms
  id (PK), engagement_id (FK), state ENUM ('lobby', 'live', 'ended'),
  started_at, ended_at,
  recording_consent BOOLEAN
```

RLS: counselors see their own engagements, students see their own engagements, admin sees all.

---

## Phasing

### Phase 1 — Foundation _(this branch, in progress)_
- Migration for the data model above
- `/counselor/onboard` flow (claims a counselor profile, optionally joins an agency)
- `/agencies/[slug]` agency landing page (counselors list + admissions proof)
- `/counselors/[slug]` counselor profile (services, reviews, admit history)
- `/find-counselor` student discovery (search by name, school target, service type)
- Role-aware nav: counselor accounts see counselor sidebar; students see existing sidebar
- AI Coach Kairos remains untouched — this is purely additive

**Out of scope for Phase 1:** booking, payment, live session, comments. Those are stubs.

### Phase 2 — Booking + Stripe Connect
- Stripe Connect onboarding for counselors (`/counselor/payouts`)
- Service catalog editor (`/counselor/services`)
- Student booking flow with Stripe escrow
- Engagement lifecycle states drive UI on both sides
- Refund / dispute path with admin override

### Phase 3 — Live Session Room (the educator-app port)
- Socket.IO server adapter mounted via Next.js API route
- Message vocabulary ported verbatim from `essayCollabWebSocket.js`
- Counselor view: read-only essay panel + inline comment composer + Coach Kairos voice that converts the counselor's spoken notes into draft comments anchored to the selection
- Student view: live comment stream with "ask follow-up" reply box
- Liveblocks for shared cursors + presence
- Session recording with consent

### Phase 4 — Chancing + Proof
- Chancing engine (uses cc_schools.acceptance_rate + student GPA/SAT to compute reach/match/safety with confidence interval)
- Counselor-issued chancing report (PDF export)
- Agency uploads admissions proof (anonymized — student alias + decision + year)
- Admin review queue for verifying proof (so we don't have fake "100% Ivy admit" claims)

### Phase 5 — Discovery polish + activity coaching
- "Suggested counselors for your profile" surface on dashboard
- Activity-strategy services for grade 10 students (the user's "starting from 10th graders" ask)
- Counselor-curated activity ideas tagged by spike area

---

## What the Phase 1 deliverable looks like

- New tables visible in Supabase (~6 tables, RLS ready)
- New routes:
  - `/counselor/onboard`
  - `/counselor/dashboard` (shell)
  - `/agencies/[slug]`
  - `/counselors/[slug]`
  - `/find-counselor`
- Role detection in the existing nav (sidebar swaps based on `cc_counselors.user_id` lookup)
- The AI coach is unchanged — no risk to the existing flow

Once Phase 1 is reviewed and merged, Phases 2-4 can branch off it independently and land in any order.
