-- Migration 027: Language Learning Profiles
-- Per-user, per-language profile for the language tutor. Tracks proficiency,
-- vocab mastery (with spaced-repetition scheduling), grammar errors, and
-- session continuity (last summary + session count).
--
-- Spec: 2026-04-10-intelligent-coaching-system-design.md sub-project 4

CREATE TABLE IF NOT EXISTS language_learning_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL,                       -- e.g. "es", "hi", "pa"

  declared_level TEXT,                          -- A1/A2/B1/B2/C1/C2 user-stated
  assessed_level TEXT,                          -- system observation
  assessed_confidence FLOAT DEFAULT 0.0,        -- 0..1, gated change threshold

  -- Vocab buckets. Each item: { word, translation, introduced_at, last_seen_at, next_review_at, exposure_count }
  vocab_introduced JSONB DEFAULT '[]',
  vocab_mastered   JSONB DEFAULT '[]',
  vocab_struggled  JSONB DEFAULT '[]',

  -- Grammar errors. Each item: { pattern, example, count, last_seen_at }
  grammar_errors   JSONB DEFAULT '[]',

  last_session_summary TEXT,
  last_session_at TIMESTAMPTZ,
  total_sessions INTEGER DEFAULT 0,

  -- Aggregate metrics for adaptive difficulty
  rolling_correctness FLOAT DEFAULT 0.0,        -- 0..1, EMA of correctness
  rolling_complexity FLOAT DEFAULT 0.0,         -- 0..1, EMA of sentence complexity

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE (user_id, language)
);

CREATE INDEX IF NOT EXISTS idx_llp_user ON language_learning_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_llp_user_language ON language_learning_profiles (user_id, language);

-- Trigger: bump updated_at on row changes
CREATE OR REPLACE FUNCTION touch_language_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_llp_updated_at ON language_learning_profiles;
CREATE TRIGGER trg_llp_updated_at
  BEFORE UPDATE ON language_learning_profiles
  FOR EACH ROW EXECUTE FUNCTION touch_language_profile_updated_at();

-- RLS: users can only see/manage their own profiles
ALTER TABLE language_learning_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS llp_select_own ON language_learning_profiles;
CREATE POLICY llp_select_own ON language_learning_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS llp_insert_own ON language_learning_profiles;
CREATE POLICY llp_insert_own ON language_learning_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS llp_update_own ON language_learning_profiles;
CREATE POLICY llp_update_own ON language_learning_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS llp_delete_own ON language_learning_profiles;
CREATE POLICY llp_delete_own ON language_learning_profiles
  FOR DELETE USING (auth.uid() = user_id);
