-- Add columns used by school search, browse, and timeline APIs
-- that were missing from the original cc_schools schema.

ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS school_type TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS test_policy TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS regular_deadline TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS early_deadline TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS ceeb_code TEXT;
ALTER TABLE cc_schools ADD COLUMN IF NOT EXISTS enrollment INT;
