-- Multi-step onboarding (2026-04-27): adds the "what's weighing on you?"
-- selections that pin the dashboard's hero modules. Reuses
-- language_picker_seen_at as the onboarding-complete sentinel.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS concerns JSONB DEFAULT '[]'::jsonb;
