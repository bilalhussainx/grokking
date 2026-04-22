-- Pakistani Percentage GPA Conversion (Section 1)
-- Store the student's original, untranslated grade alongside the canonical
-- 4.0 value that lives in gpa_unweighted. This lets the UI render "87%
-- (converted to 3.48)" without losing the raw entry and lets Coach Kairos
-- answer questions like "what was my original grade?"
ALTER TABLE cc_academic_profiles
  ADD COLUMN IF NOT EXISTS gpa_raw_value NUMERIC,
  ADD COLUMN IF NOT EXISTS gpa_raw_display TEXT;
