-- Feature 2: Application Deadline Calendar
-- Extends cc_student_schools with deadline + component-completion fields.
-- Idempotent so re-running is safe.

ALTER TABLE cc_student_schools
  ADD COLUMN IF NOT EXISTS deadline_ea DATE,
  ADD COLUMN IF NOT EXISTS deadline_ed DATE,
  ADD COLUMN IF NOT EXISTS deadline_edii DATE,
  ADD COLUMN IF NOT EXISTS deadline_rea DATE,
  ADD COLUMN IF NOT EXISTS deadline_rd DATE,
  ADD COLUMN IF NOT EXISTS deadline_financial_aid DATE,
  ADD COLUMN IF NOT EXISTS deadline_css_profile DATE,
  ADD COLUMN IF NOT EXISTS deadline_fafsa DATE,
  ADD COLUMN IF NOT EXISTS common_app_filled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS essays_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS supplements_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS recs_submitted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS transcript_submitted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS test_scores_submitted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS financial_aid_filed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS portal_url TEXT,
  ADD COLUMN IF NOT EXISTS portal_login_note TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index helps the dashboard widget that shows next 5 deadlines.
CREATE INDEX IF NOT EXISTS cc_student_schools_deadline_rd_idx
  ON cc_student_schools(student_id, deadline_rd) WHERE deadline_rd IS NOT NULL;
