-- supabase/migrations/20260502_backfill_preferred_language.sql
-- Backfill preferred_language from home_language for existing users.
-- Onboarding writes home_language only; the text-coach API path historically
-- read preferred_language, so users who completed onboarding before
-- 2026-05-02 had no language directive in their coach prompts and got
-- English replies.
UPDATE cc_student_profiles
SET preferred_language = home_language
WHERE preferred_language IS NULL
  AND home_language IS NOT NULL;
