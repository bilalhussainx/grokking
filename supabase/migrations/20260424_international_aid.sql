-- Section 3: International aid transparency + need-blind/full-need filter

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS meets_full_need_international BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pct_international_students_receiving_aid NUMERIC,
  ADD COLUMN IF NOT EXISTS avg_aid_package_international NUMERIC,
  ADD COLUMN IF NOT EXISTS css_profile_required BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS fafsa_required_international BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS international_aid_notes TEXT,
  ADD COLUMN IF NOT EXISTS aid_policy_verified_date DATE;

-- Upgrade the 8 need-blind schools from Section 2 to also flag meets-full-need
UPDATE cc_schools SET
  meets_full_need_international = TRUE,
  international_aid_notes = 'Need-blind for international students. Meets 100% of demonstrated financial need for all admitted students regardless of citizenship.',
  aid_policy_verified_date = '2026-04-22'
WHERE ipeds_id IN (
  166027, -- Harvard
  166683, -- MIT
  130794, -- Yale
  186131, -- Princeton
  182670, -- Dartmouth
  164465, -- Amherst
  168342, -- Williams
  160977  -- Bowdoin
);

-- Seed 8 need-aware-but-meets-full-need schools
UPDATE cc_schools SET
  meets_full_need_international = TRUE,
  need_blind_international = FALSE,
  international_aid_notes = 'Meets full demonstrated need but is need-aware for international students — your financial aid request may reduce admission chances at this school.',
  aid_policy_verified_date = '2026-04-22'
WHERE ipeds_id IN (
  190150, -- Columbia University
  215062, -- University of Pennsylvania
  198419, -- Duke University
  221999, -- Vanderbilt University
  227757, -- Rice University
  121257, -- Pomona College
  168218, -- Wellesley College
  230038  -- Middlebury College
);
