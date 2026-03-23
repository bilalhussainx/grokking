-- Migration 005: Language Learning System
-- RAG Agent with Per-User Memory, Spaced Repetition, and Mistake Tracking

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. User Language Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_language_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,          -- BCP-47: 'es', 'fr', 'ur', etc.
  native_language TEXT NOT NULL,
  proficiency_level TEXT NOT NULL DEFAULT 'A1', -- CEFR: A1, A2, B1, B2, C1, C2
  current_module_id TEXT,
  preferred_persona_id TEXT,
  learning_goals TEXT[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  strong_areas TEXT[] DEFAULT '{}',
  total_practice_minutes INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_session_summary TEXT,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_language)
);

-- ============================================
-- 2. Vocabulary Mastery (SM-2 Spaced Repetition)
-- ============================================
CREATE TABLE IF NOT EXISTS vocab_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  target_language TEXT NOT NULL,
  times_correct INT DEFAULT 0,
  times_incorrect INT DEFAULT 0,
  mastery_level INT DEFAULT 0,           -- 0-5
  ease_factor FLOAT DEFAULT 2.5,         -- SM-2 ease factor
  interval_days INT DEFAULT 1,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word, target_language)
);

-- ============================================
-- 3. Mistake Patterns (with pgvector for RAG retrieval)
-- ============================================
CREATE TABLE IF NOT EXISTS mistake_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('grammar', 'pronunciation', 'vocabulary', 'cultural')),
  description TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  corrections TEXT[] DEFAULT '{}',
  frequency INT DEFAULT 1,
  embedding vector(768),                  -- nomic-embed-text via Ollama (matches existing 768-dim convention)
  resolved BOOLEAN DEFAULT FALSE,
  last_occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Session History
-- ============================================
CREATE TABLE IF NOT EXISTS language_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,
  persona_id TEXT NOT NULL,
  scenario TEXT,
  lesson_id TEXT,
  duration_seconds INT,
  transcript JSONB DEFAULT '[]',          -- [{role, text, timestamp}]
  mistakes_found JSONB DEFAULT '[]',
  new_vocab JSONB DEFAULT '[]',
  proficiency_delta FLOAT DEFAULT 0,
  agent_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Placement Test Results
-- ============================================
CREATE TABLE IF NOT EXISTS placement_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language TEXT NOT NULL,
  assessed_level TEXT NOT NULL,
  text_score FLOAT,
  voice_score FLOAT,
  details JSONB,                          -- per-question breakdown
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. Existing Tables Modified
-- ============================================
-- Add global native language to user_profiles (used as default for translation widget)
-- Per-language native_language in user_language_profiles overrides this when set.
-- Resolution: user_language_profiles.native_language is authoritative for that specific
-- language course. user_profiles.native_language is the global default used by the
-- translation widget and for initial course setup.
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS native_language TEXT DEFAULT 'en';

-- ============================================
-- 7. Row Level Security
-- ============================================
ALTER TABLE user_language_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can read own language profiles"
  ON user_language_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own language profiles"
  ON user_language_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own language profiles"
  ON user_language_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own vocab"
  ON vocab_mastery FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mistakes"
  ON mistake_patterns FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own sessions"
  ON language_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions"
  ON language_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own placement results"
  ON placement_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own placement results"
  ON placement_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. Indexes
-- ============================================
-- Use HNSW instead of IVFFlat (works well with small datasets, no minimum row requirement)
CREATE INDEX IF NOT EXISTS mistake_embedding_idx ON mistake_patterns
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS vocab_due_idx ON vocab_mastery
  (user_id, target_language, next_review_at);

CREATE INDEX IF NOT EXISTS lang_profile_idx ON user_language_profiles
  (user_id, target_language);

CREATE INDEX IF NOT EXISTS lang_session_idx ON language_sessions
  (user_id, target_language, created_at DESC);

-- ============================================
-- 9. RPC Functions
-- ============================================

-- SM-2 Spaced Repetition Update
CREATE OR REPLACE FUNCTION update_vocab_sm2(
  p_vocab_id UUID,
  p_quality INT  -- 0-5: 0=complete blackout, 5=perfect recall
)
RETURNS TABLE (
  new_mastery_level INT,
  new_interval_days INT,
  new_ease_factor FLOAT,
  next_review TIMESTAMPTZ
) AS $$
DECLARE
  v_record RECORD;
  v_new_mastery INT;
  v_new_interval INT;
  v_new_ease FLOAT;
BEGIN
  SELECT * INTO v_record FROM vocab_mastery WHERE id = p_vocab_id;
  
  IF v_record IS NULL THEN
    RETURN;
  END IF;
  
  v_new_mastery := v_record.mastery_level;
  v_new_interval := v_record.interval_days;
  v_new_ease := v_record.ease_factor;
  
  IF p_quality >= 3 THEN
    -- Correct response
    IF v_record.mastery_level = 0 THEN
      v_new_interval := 1;
    ELSIF v_record.mastery_level = 1 THEN
      v_new_interval := 6;
    ELSE
      v_new_interval := ROUND(v_record.interval_days * v_record.ease_factor);
    END IF;
    v_new_mastery := LEAST(5, v_record.mastery_level + 1);
  ELSE
    -- Incorrect response - reset
    v_new_mastery := 0;
    v_new_interval := 1;
  END IF;
  
  -- Update ease factor
  v_new_ease := GREATEST(1.3,
    v_record.ease_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02))
  );
  
  UPDATE vocab_mastery
  SET 
    mastery_level = v_new_mastery,
    interval_days = v_new_interval,
    ease_factor = v_new_ease,
    next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
    last_reviewed_at = NOW(),
    times_correct = times_correct + (CASE WHEN p_quality >= 3 THEN 1 ELSE 0 END),
    times_incorrect = times_incorrect + (CASE WHEN p_quality < 3 THEN 1 ELSE 0 END)
  WHERE id = p_vocab_id
  RETURNING mastery_level, interval_days, ease_factor, next_review_at
  INTO new_mastery_level, new_interval_days, new_ease_factor, next_review;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Due Vocabulary for Review
CREATE OR REPLACE FUNCTION get_due_vocab(
  p_user_id UUID,
  p_target_language TEXT,
  p_limit INT DEFAULT 15
)
RETURNS TABLE (
  id UUID,
  word TEXT,
  translation TEXT,
  mastery_level INT,
  times_correct INT,
  times_incorrect INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vm.id,
    vm.word,
    vm.translation,
    vm.mastery_level,
    vm.times_correct,
    vm.times_incorrect
  FROM vocab_mastery vm
  WHERE vm.user_id = p_user_id
    AND vm.target_language = p_target_language
    AND vm.next_review_at <= NOW()
  ORDER BY vm.next_review_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search Similar Mistakes (for RAG retrieval)
CREATE OR REPLACE FUNCTION search_similar_mistakes(
  p_user_id UUID,
  p_target_language TEXT,
  p_embedding vector(768),
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  description TEXT,
  examples TEXT[],
  corrections TEXT[],
  frequency INT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.id,
    mp.category,
    mp.description,
    mp.examples,
    mp.corrections,
    mp.frequency,
    (1 - (mp.embedding <=> p_embedding))::FLOAT AS similarity
  FROM mistake_patterns mp
  WHERE mp.user_id = p_user_id
    AND mp.target_language = p_target_language
    AND mp.resolved = FALSE
    AND mp.embedding IS NOT NULL
  ORDER BY mp.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Upsert Mistake Pattern (with embedding)
CREATE OR REPLACE FUNCTION upsert_mistake_pattern(
  p_user_id UUID,
  p_target_language TEXT,
  p_category TEXT,
  p_description TEXT,
  p_example TEXT,
  p_correction TEXT,
  p_embedding vector(768) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  -- Check for similar existing mistake (using description similarity as proxy)
  SELECT id INTO v_existing_id
  FROM mistake_patterns
  WHERE user_id = p_user_id
    AND target_language = p_target_language
    AND description = p_description
    AND resolved = FALSE
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    -- Update existing
    UPDATE mistake_patterns
    SET 
      frequency = frequency + 1,
      examples = array_append(examples, p_example),
      corrections = array_append(corrections, p_correction),
      last_occurred_at = NOW(),
      embedding = COALESCE(p_embedding, embedding)
    WHERE id = v_existing_id;
    RETURN v_existing_id;
  ELSE
    -- Insert new
    INSERT INTO mistake_patterns (
      user_id, target_language, category, description,
      examples, corrections, frequency, embedding
    ) VALUES (
      p_user_id, p_target_language, p_category, p_description,
      ARRAY[p_example], ARRAY[p_correction], 1, p_embedding
    )
    RETURNING id INTO v_new_id;
    RETURN v_new_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Recent Sessions Summary
CREATE OR REPLACE FUNCTION get_recent_sessions(
  p_user_id UUID,
  p_target_language TEXT,
  p_limit INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  persona_id TEXT,
  scenario TEXT,
  duration_seconds INT,
  agent_summary TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ls.id,
    ls.persona_id,
    ls.scenario,
    ls.duration_seconds,
    ls.agent_summary,
    ls.created_at
  FROM language_sessions ls
  WHERE ls.user_id = p_user_id
    AND ls.target_language = p_target_language
  ORDER BY ls.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Practice Stats
CREATE OR REPLACE FUNCTION update_practice_stats(
  p_user_id UUID,
  p_target_language TEXT,
  p_duration_seconds INT
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_language_profiles
  SET 
    total_practice_minutes = total_practice_minutes + (p_duration_seconds / 60),
    last_practiced_at = NOW(),
    streak_days = CASE 
      WHEN last_practiced_at IS NULL THEN 1
      WHEN last_practiced_at::DATE = CURRENT_DATE - 1 THEN streak_days + 1
      WHEN last_practiced_at::DATE = CURRENT_DATE THEN streak_days
      ELSE 1
    END
  WHERE user_id = p_user_id AND target_language = p_target_language;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
