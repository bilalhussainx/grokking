-- 20260425_first_gen_international.sql
-- Section 4: First-gen granularity + canonical international fields
-- Additive. cc_student_profiles already has: is_first_gen, is_international, citizenship_status, country.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS parents_education TEXT,
  ADD COLUMN IF NOT EXISTS home_country TEXT,
  ADD COLUMN IF NOT EXISTS home_country_code TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

COMMENT ON COLUMN cc_student_profiles.parents_education IS
  'Highest parent education: no_college | some_college | associates | bachelors | graduate. NULL = unknown.';
COMMENT ON COLUMN cc_student_profiles.home_country IS
  'Human-readable country name (e.g. "Pakistan"). Canonical going forward. country column kept for intake legacy.';
COMMENT ON COLUMN cc_student_profiles.home_country_code IS
  'ISO 3166-1 alpha-2 (e.g. "PK"). Canonical going forward.';
COMMENT ON COLUMN cc_student_profiles.preferred_language IS
  'BCP-47 language tag for UI/coach. Defaults to en. Will drive Urdu (ur) support in Section 6.';

-- Backfill home_country_code from existing country column where possible.
-- country already holds ISO-2 codes ("US", "CA", "PK", ...) per intake-questions.parseLocation.
UPDATE cc_student_profiles
SET home_country_code = country
WHERE home_country_code IS NULL
  AND country IS NOT NULL
  AND length(country) = 2;
