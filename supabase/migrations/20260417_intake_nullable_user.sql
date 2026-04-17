-- Allow cc_student_profiles.user_id to be NULL for anonymous intake flow.
-- Seed profiles are created during intake with user_id = NULL,
-- then linked to a real user on signup via /api/cc/intake/link.
ALTER TABLE cc_student_profiles ALTER COLUMN user_id DROP NOT NULL;
