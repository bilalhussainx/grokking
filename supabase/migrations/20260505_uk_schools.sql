-- supabase/migrations/20260505_uk_schools.sql
-- Workstream M: extends cc_schools metadata for UK universities and
-- seeds 12 top UK institutions for the v1 UK module.
--
-- The Canada migration (20260504) already added country/province/
-- application_platform/osap_eligible. We add `region` (semantically
-- = "country within the UK" for E/S/W/NI; for non-UK rows it's NULL).

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS region TEXT;

CREATE INDEX IF NOT EXISTS cc_schools_country_region_idx ON cc_schools(country, region);

-- ── 12 UK universities ────────────────────────────────────────────────
-- Sources for 2026-27 cycle:
--   - https://www.ucas.com/undergraduate/applying-university/key-dates
--   - Each school's published international tuition for 2026-27
-- Idempotency: NOT EXISTS guard (cc_schools.name lacks UNIQUE constraint).

INSERT INTO cc_schools (name, country, province, region, application_platform, website, school_type, acceptance_rate, osap_eligible)
SELECT v.name, v.country, v.province, v.region, v.application_platform, v.website, v.school_type, v.acceptance_rate, v.osap_eligible
FROM (VALUES
  ('University of Oxford',                'UK', NULL, 'England',  'UCAS', 'https://www.ox.ac.uk',                 'public', 0.17, FALSE),
  ('University of Cambridge',             'UK', NULL, 'England',  'UCAS', 'https://www.cam.ac.uk',                'public', 0.21, FALSE),
  ('Imperial College London',             'UK', NULL, 'England',  'UCAS', 'https://www.imperial.ac.uk',           'public', 0.14, FALSE),
  ('London School of Economics and Political Science', 'UK', NULL, 'England', 'UCAS', 'https://www.lse.ac.uk',  'public', 0.09, FALSE),
  ('University College London',           'UK', NULL, 'England',  'UCAS', 'https://www.ucl.ac.uk',                'public', 0.32, FALSE),
  ('King''s College London',              'UK', NULL, 'England',  'UCAS', 'https://www.kcl.ac.uk',                'public', 0.13, FALSE),
  ('University of Edinburgh',             'UK', NULL, 'Scotland', 'UCAS', 'https://www.ed.ac.uk',                 'public', 0.40, FALSE),
  ('University of Manchester',            'UK', NULL, 'England',  'UCAS', 'https://www.manchester.ac.uk',         'public', 0.56, FALSE),
  ('University of Bristol',               'UK', NULL, 'England',  'UCAS', 'https://www.bristol.ac.uk',            'public', 0.68, FALSE),
  ('University of Warwick',               'UK', NULL, 'England',  'UCAS', 'https://warwick.ac.uk',                'public', 0.40, FALSE),
  ('Durham University',                   'UK', NULL, 'England',  'UCAS', 'https://www.durham.ac.uk',             'public', 0.40, FALSE),
  ('University of St Andrews',            'UK', NULL, 'Scotland', 'UCAS', 'https://www.st-andrews.ac.uk',         'public', 0.30, FALSE)
) AS v(name, country, province, region, application_platform, website, school_type, acceptance_rate, osap_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM cc_schools cs WHERE cs.name = v.name
);
