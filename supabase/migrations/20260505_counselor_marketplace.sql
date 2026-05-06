-- ──────────────────────────────────────────────────────────────────────
-- Counselor & Agency Marketplace — Phase 1 schema
--
-- Adds the counselor/agency layer on top of the existing student-facing
-- platform. AI Coach Kairos is unaffected; this is purely additive. See
-- docs/COUNSELOR_MARKETPLACE.md for the full phasing + porting story.
--
-- Tables created:
--   cc_agencies                       — counseling agencies / firms
--   cc_counselors                     — individual counselor profiles
--   cc_counselor_services             — service catalog per counselor
--   cc_counselor_engagements          — booked work (paid or proposed)
--   cc_counselor_admissions_proof     — verified past admit outcomes
--   cc_counselor_session_comments     — inline comments on student docs
--   cc_counselor_session_rooms        — live-session room state
--
-- Phase 2/3/4 add Stripe Connect fields, Liveblocks doc state, and the
-- chancing-report shape on top of these tables — no rename required.
-- ──────────────────────────────────────────────────────────────────────

-- ─── 1. Agencies ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cc_agencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  website_url     TEXT,
  logo_url        TEXT,
  description     TEXT,
  country         TEXT DEFAULT 'US',
  founded_year    INT,
  -- Marketing-surface aggregates kept here so the agency page doesn't
  -- have to recompute against admissions_proof every render. Updated by
  -- a trigger or nightly job in Phase 4.
  total_acceptances INT DEFAULT 0,
  verified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cc_agencies_slug_idx ON cc_agencies(slug);

-- ─── 2. Counselors ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cc_counselors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id             UUID REFERENCES cc_agencies(id) ON DELETE SET NULL,
  slug                  TEXT NOT NULL UNIQUE,
  display_name          TEXT NOT NULL,
  headline              TEXT,
  bio                   TEXT,
  photo_url             TEXT,
  years_experience      INT,
  specialties           TEXT[] DEFAULT '{}',
  languages             TEXT[] DEFAULT '{en}',
  hourly_rate_usd       NUMERIC(8,2),
  accepts_new_students  BOOLEAN DEFAULT TRUE,
  verified              BOOLEAN DEFAULT FALSE,
  -- Aggregates rolled up from engagements + reviews. Cheap to read on
  -- the profile page; updated by triggers or nightly batch.
  total_sessions        INT DEFAULT 0,
  average_rating        NUMERIC(3,2),
  total_reviews         INT DEFAULT 0,
  -- Stripe Connect — populated in Phase 2 onboarding flow.
  stripe_account_id     TEXT,
  payout_status         TEXT DEFAULT 'pending',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cc_counselors_agency_idx ON cc_counselors(agency_id);
CREATE INDEX IF NOT EXISTS cc_counselors_user_idx   ON cc_counselors(user_id);
CREATE INDEX IF NOT EXISTS cc_counselors_slug_idx   ON cc_counselors(slug);
CREATE INDEX IF NOT EXISTS cc_counselors_specialties_gin ON cc_counselors USING GIN (specialties);

-- ─── 3. Counselor services (catalog) ──────────────────────────────────
DO $$ BEGIN
  CREATE TYPE counselor_service_type AS ENUM (
    'essay_review_single',
    'essay_review_package',
    'common_app_full',
    'supplement_full_school',
    'interview_prep_session',
    'application_audit',
    'chancing_consultation',
    'activity_strategy_g10',
    'activity_strategy_g11'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cc_counselor_services (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id      UUID NOT NULL REFERENCES cc_counselors(id) ON DELETE CASCADE,
  service_type      counselor_service_type NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  price_usd         NUMERIC(8,2) NOT NULL,
  turnaround_hours  INT,
  -- Per-service scope: e.g. {"max_essays": 5, "schools": ["Stanford","MIT"]}
  -- Schema is open by service_type so we don't lock it down too early.
  scope_jsonb       JSONB DEFAULT '{}'::jsonb,
  active            BOOLEAN DEFAULT TRUE,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cc_counselor_services_counselor_idx
  ON cc_counselor_services(counselor_id, active);

-- ─── 4. Engagements (booked work) ─────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE counselor_engagement_status AS ENUM (
    'proposed',
    'paid_pending_start',
    'in_progress',
    'awaiting_student',
    'completed',
    'cancelled',
    'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cc_counselor_engagements (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id              UUID NOT NULL REFERENCES cc_counselors(id) ON DELETE RESTRICT,
  student_id                UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  service_id                UUID REFERENCES cc_counselor_services(id) ON DELETE SET NULL,
  status                    counselor_engagement_status NOT NULL DEFAULT 'proposed',
  -- Concrete scope for this engagement: which essays / schools / activities
  -- are in play. Filled at booking + edited as scope shifts.
  scope_jsonb               JSONB DEFAULT '{}'::jsonb,
  price_usd_paid            NUMERIC(8,2),
  -- Stripe — populated in Phase 2.
  stripe_payment_intent_id  TEXT,
  stripe_transfer_id        TEXT,
  proposed_at               TIMESTAMPTZ DEFAULT NOW(),
  paid_at                   TIMESTAMPTZ,
  started_at                TIMESTAMPTZ,
  completed_at              TIMESTAMPTZ,
  -- Single review per engagement. A counselor can be re-booked for new
  -- engagements, each producing its own review row. Rollup lives on
  -- cc_counselors.average_rating.
  student_rating            INT CHECK (student_rating BETWEEN 1 AND 5),
  student_review_text       TEXT,
  reviewed_at               TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS cc_engagements_counselor_idx
  ON cc_counselor_engagements(counselor_id, status);
CREATE INDEX IF NOT EXISTS cc_engagements_student_idx
  ON cc_counselor_engagements(student_id, status);

-- ─── 5. Admissions proof (the agency's track record) ──────────────────
DO $$ BEGIN
  CREATE TYPE counselor_proof_decision AS ENUM (
    'admitted',
    'waitlisted',
    'denied'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cc_counselor_admissions_proof (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Either counselor-attributed or agency-attributed (or both); at least
  -- one must be set. Agency-only rows let an agency post overall track
  -- record before assigning credit to specific counselors.
  counselor_id        UUID REFERENCES cc_counselors(id) ON DELETE CASCADE,
  agency_id           UUID REFERENCES cc_agencies(id) ON DELETE CASCADE,
  -- Anonymized student identifier — public-safe label like "Class of 2025
  -- — Pakistani-American CS applicant". NEVER the real name.
  student_alias       TEXT NOT NULL,
  graduation_year     INT,
  school_name         TEXT NOT NULL,
  decision            counselor_proof_decision NOT NULL,
  decision_type       TEXT,                 -- 'ED' / 'EA' / 'RD' / 'REA' / 'rolling'
  scholarship_usd     NUMERIC(10,2),
  -- Admin-verified flag — proof claims must be reviewed before they show
  -- on the public profile to prevent agencies from posting fake records.
  verified_by_admin   BOOLEAN DEFAULT FALSE,
  evidence_url        TEXT,                 -- redacted decision letter, etc.
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  -- Soft constraint enforced at app layer too: at least one of (counselor_id,
  -- agency_id) must be present.
  CONSTRAINT proof_attribution_required CHECK (
    counselor_id IS NOT NULL OR agency_id IS NOT NULL
  )
);
CREATE INDEX IF NOT EXISTS cc_proof_counselor_idx
  ON cc_counselor_admissions_proof(counselor_id) WHERE counselor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS cc_proof_agency_idx
  ON cc_counselor_admissions_proof(agency_id) WHERE agency_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS cc_proof_school_idx
  ON cc_counselor_admissions_proof(school_name);

-- ─── 6. Session comments (live-session inline feedback) ───────────────
DO $$ BEGIN
  CREATE TYPE counselor_comment_severity AS ENUM (
    'positive',
    'suggestion',
    'issue'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cc_counselor_session_comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id     UUID NOT NULL REFERENCES cc_counselor_engagements(id) ON DELETE CASCADE,
  -- Anchored to one of: an essay, an activity, an interview, or free-form
  -- (all anchors null). Application-layer enforces at-most-one anchor.
  essay_id          UUID REFERENCES cc_essays(id) ON DELETE CASCADE,
  activity_id       UUID REFERENCES cc_activities(id) ON DELETE CASCADE,
  author_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_role       TEXT NOT NULL CHECK (author_role IN ('counselor', 'student')),
  -- Selection range within the anchored doc — character offsets in the
  -- doc's current_draft. Null when the comment is on the doc as a whole.
  selection_start   INT,
  selection_end     INT,
  selected_text     TEXT,
  body              TEXT NOT NULL,
  severity          counselor_comment_severity DEFAULT 'suggestion',
  -- Coach-Kairos-voice integration (Phase 3): when the counselor dictates
  -- a note, the raw transcript lands here and ai_summarized=true means
  -- the body field is the LLM's distilled version of the transcript.
  voice_transcript  TEXT,
  ai_summarized     BOOLEAN DEFAULT FALSE,
  resolved          BOOLEAN DEFAULT FALSE,
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cc_comments_engagement_idx
  ON cc_counselor_session_comments(engagement_id);
CREATE INDEX IF NOT EXISTS cc_comments_essay_idx
  ON cc_counselor_session_comments(essay_id) WHERE essay_id IS NOT NULL;

-- ─── 7. Session rooms (Phase 3 live collaboration) ────────────────────
DO $$ BEGIN
  CREATE TYPE counselor_room_state AS ENUM ('lobby', 'live', 'ended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cc_counselor_session_rooms (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id       UUID NOT NULL UNIQUE REFERENCES cc_counselor_engagements(id) ON DELETE CASCADE,
  state               counselor_room_state NOT NULL DEFAULT 'lobby',
  started_at          TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,
  recording_consent   BOOLEAN DEFAULT FALSE,
  -- Phase 3 will add: liveblocks_room_id, deepgram_session_token,
  -- recording_url. Left out now to keep the migration focused.
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS POLICIES ─────────────────────────────────────────────────────
-- Public-readable: agencies, counselors, services, verified proof.
-- Owner-readable: engagements (counselor + their student), session
-- comments (counselor + their student via engagement).

ALTER TABLE cc_agencies                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselors                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselor_services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselor_engagements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselor_admissions_proof   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselor_session_comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_counselor_session_rooms      ENABLE ROW LEVEL SECURITY;

-- Agencies: public read.
DO $$ BEGIN
  CREATE POLICY cc_agencies_public_read ON cc_agencies FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Counselors: public read.
DO $$ BEGIN
  CREATE POLICY cc_counselors_public_read ON cc_counselors FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Counselors can update only their own row.
DO $$ BEGIN
  CREATE POLICY cc_counselors_self_update ON cc_counselors
    FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Services: public read for active services, owner manages own.
DO $$ BEGIN
  CREATE POLICY cc_services_public_read ON cc_counselor_services
    FOR SELECT USING (active);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY cc_services_owner_all ON cc_counselor_services
    FOR ALL USING (counselor_id IN (
      SELECT id FROM cc_counselors WHERE user_id = auth.uid()
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Engagements: visible to the counselor (via cc_counselors.user_id) and
-- to the student (via cc_student_profiles.user_id).
DO $$ BEGIN
  CREATE POLICY cc_engagements_party_read ON cc_counselor_engagements
    FOR SELECT USING (
      counselor_id IN (SELECT id FROM cc_counselors        WHERE user_id = auth.uid())
      OR
      student_id   IN (SELECT id FROM cc_student_profiles  WHERE user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admissions proof: public read ONLY for verified rows. Counselors / agency
-- staff can read their own unverified rows for the dashboard's review queue,
-- but those are gated by app-layer admin-only mutations (no INSERT policy
-- here — Phase 4 ships the admin tooling).
DO $$ BEGIN
  CREATE POLICY cc_proof_public_read_verified ON cc_counselor_admissions_proof
    FOR SELECT USING (verified_by_admin = TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Session comments: visible to engagement participants only.
DO $$ BEGIN
  CREATE POLICY cc_comments_party_read ON cc_counselor_session_comments
    FOR SELECT USING (
      engagement_id IN (
        SELECT e.id FROM cc_counselor_engagements e
        WHERE e.counselor_id IN (SELECT id FROM cc_counselors        WHERE user_id = auth.uid())
           OR e.student_id   IN (SELECT id FROM cc_student_profiles  WHERE user_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Session rooms: same scope as engagements.
DO $$ BEGIN
  CREATE POLICY cc_rooms_party_read ON cc_counselor_session_rooms
    FOR SELECT USING (
      engagement_id IN (
        SELECT e.id FROM cc_counselor_engagements e
        WHERE e.counselor_id IN (SELECT id FROM cc_counselors        WHERE user_id = auth.uid())
           OR e.student_id   IN (SELECT id FROM cc_student_profiles  WHERE user_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
