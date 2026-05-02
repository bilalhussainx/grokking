-- Backfill cc_student_profiles.intake_completed_at for users who completed
-- the new multi-step onboarding before commit 07103e2 shipped. The old
-- /api/cc/onboarding/complete only set language_picker_seen_at; the coach
-- mode-detector keys off intake_completed_at, so onboarded users were
-- treated as "still needs intake" and the coach asked for their name
-- and grade on every first turn (cross-persona regression — see
-- AUD-P1-002 in docs/reports/2026-05-02-openclaw-audit-result.md).
--
-- Idempotent: only updates rows where intake_completed_at is currently
-- null but language_picker_seen_at is set.

UPDATE cc_student_profiles
SET intake_completed_at = language_picker_seen_at
WHERE language_picker_seen_at IS NOT NULL
  AND intake_completed_at IS NULL;
