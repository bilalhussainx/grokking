-- supabase/migrations/20260504_canadian_schools.sql
-- Adds country + provincial metadata to cc_schools, backfills existing
-- US rows, and seeds 12 Canadian universities for the v1 Canada module.

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS application_platform TEXT,
  ADD COLUMN IF NOT EXISTS osap_eligible BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS cc_schools_country_idx ON cc_schools(country);

-- Backfill: any existing row without country set is US (safe — nothing
-- non-US has been seeded yet).
UPDATE cc_schools SET country = 'US' WHERE country IS NULL OR country = '';

-- ── 12 Canadian universities ──────────────────────────────────────────
-- Sources for 2026-27 cycle:
--   - https://www.ouac.on.ca/ for Ontario application platform deadlines
--   - https://you.ubc.ca/applying-ubc/dates-deadlines/
--   - https://mcgill.ca/undergraduate-admissions/apply
--   - https://uwaterloo.ca/future-students/admissions/dates-deadlines
--
-- Idempotency: the cc_schools table doesn't ship with a UNIQUE
-- constraint on `name` (other migrations may key on id), so we use
-- a NOT EXISTS guard per-school instead of ON CONFLICT.

INSERT INTO cc_schools (name, country, province, application_platform, website, school_type, acceptance_rate, osap_eligible)
SELECT v.name, v.country, v.province, v.application_platform, v.website, v.school_type, v.acceptance_rate, v.osap_eligible
FROM (VALUES
  ('University of Toronto',     'CA', 'ON', 'OUAC',         'https://future.utoronto.ca',                              'public', 0.43, TRUE),
  ('University of British Columbia', 'CA', 'BC', 'UBC_direct', 'https://you.ubc.ca',                                    'public', 0.52, FALSE),
  ('McGill University',         'CA', 'QC', 'McGill_direct','https://www.mcgill.ca/undergraduate-admissions/',         'public', 0.46, FALSE),
  ('University of Waterloo',    'CA', 'ON', 'OUAC',         'https://uwaterloo.ca',                                     'public', 0.53, TRUE),
  ('Queen''s University',       'CA', 'ON', 'OUAC',         'https://www.queensu.ca',                                   'public', 0.42, TRUE),
  ('Western University',        'CA', 'ON', 'OUAC',         'https://www.uwo.ca',                                       'public', 0.58, TRUE),
  ('McMaster University',       'CA', 'ON', 'OUAC',         'https://www.mcmaster.ca',                                  'public', 0.59, TRUE),
  ('University of Alberta',     'CA', 'AB', 'ApplyAlberta', 'https://www.ualberta.ca',                                  'public', 0.58, FALSE),
  ('University of Ottawa',      'CA', 'ON', 'OUAC',         'https://www.uottawa.ca',                                   'public', 0.65, TRUE),
  ('Simon Fraser University',   'CA', 'BC', 'SFU_direct',   'https://www.sfu.ca',                                       'public', 0.66, FALSE),
  ('Toronto Metropolitan University', 'CA', 'ON', 'OUAC',   'https://www.torontomu.ca',                                 'public', 0.67, TRUE),
  ('York University',           'CA', 'ON', 'OUAC',         'https://www.yorku.ca',                                     'public', 0.71, TRUE)
) AS v(name, country, province, application_platform, website, school_type, acceptance_rate, osap_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM cc_schools cs WHERE cs.name = v.name
);
