-- Section 2: $0/full financial aid affordability option

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS affordability_value TEXT DEFAULT 'under_10k'
    CHECK (affordability_value IN ('zero','under_10k','10k_20k','20k_30k','30k_50k','50k_plus')),
  ADD COLUMN IF NOT EXISTS needs_full_aid BOOLEAN GENERATED ALWAYS AS
    (affordability_value = 'zero') STORED;

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS need_blind_international BOOLEAN DEFAULT FALSE;

UPDATE cc_schools SET need_blind_international = TRUE
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
