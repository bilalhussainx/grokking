-- Migration 020: User Knowledge Graph
-- Temporal facts about users, written by any AI agent, readable by all.
-- Facts have validity windows — old facts expire via valid_to.

CREATE TABLE IF NOT EXISTS user_knowledge_graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object TEXT NOT NULL,
  confidence FLOAT DEFAULT 1.0 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  source_agent TEXT NOT NULL CHECK (source_agent IN (
    'coach', 'interviewer', 'language_tutor', 'career_coach', 'university_coach'
  )),
  evidence TEXT,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup of current facts for a user
CREATE INDEX idx_ukg_user_current
  ON user_knowledge_graph (user_id, valid_to)
  WHERE valid_to IS NULL;

-- Fast lookup by predicate type (e.g., all "weak_at" facts for a user)
CREATE INDEX idx_ukg_user_predicate
  ON user_knowledge_graph (user_id, predicate)
  WHERE valid_to IS NULL;

-- RPC: Get all current (non-expired) facts for a user
CREATE OR REPLACE FUNCTION get_current_facts(
  p_user_id UUID,
  p_predicate TEXT DEFAULT NULL,
  p_source_agent TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  subject TEXT,
  predicate TEXT,
  object TEXT,
  confidence FLOAT,
  source_agent TEXT,
  evidence TEXT,
  valid_from TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ukg.id,
    ukg.subject,
    ukg.predicate,
    ukg.object,
    ukg.confidence,
    ukg.source_agent,
    ukg.evidence,
    ukg.valid_from
  FROM user_knowledge_graph ukg
  WHERE ukg.user_id = p_user_id
    AND ukg.valid_to IS NULL
    AND (p_predicate IS NULL OR ukg.predicate = p_predicate)
    AND (p_source_agent IS NULL OR ukg.source_agent = p_source_agent)
  ORDER BY ukg.confidence DESC, ukg.valid_from DESC
  LIMIT p_limit;
END;
$$;

-- RPC: Upsert a fact (update confidence if same triple exists, or insert new)
CREATE OR REPLACE FUNCTION upsert_fact(
  p_user_id UUID,
  p_subject TEXT,
  p_predicate TEXT,
  p_object TEXT,
  p_confidence FLOAT DEFAULT 1.0,
  p_source_agent TEXT DEFAULT 'coach',
  p_evidence TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  -- Check if an active (non-expired) fact with the same triple exists
  SELECT ukg.id INTO v_existing_id
  FROM user_knowledge_graph ukg
  WHERE ukg.user_id = p_user_id
    AND ukg.subject = p_subject
    AND ukg.predicate = p_predicate
    AND ukg.object = p_object
    AND ukg.valid_to IS NULL
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update confidence and evidence on the existing fact
    UPDATE user_knowledge_graph
    SET confidence = p_confidence,
        evidence = COALESCE(p_evidence, evidence),
        source_agent = p_source_agent
    WHERE id = v_existing_id;
    RETURN v_existing_id;
  ELSE
    -- Insert new fact
    INSERT INTO user_knowledge_graph (
      user_id, subject, predicate, object, confidence, source_agent, evidence
    )
    VALUES (
      p_user_id, p_subject, p_predicate, p_object, p_confidence, p_source_agent, p_evidence
    )
    RETURNING id INTO v_new_id;
    RETURN v_new_id;
  END IF;
END;
$$;

-- RPC: Invalidate a fact (set valid_to = now)
CREATE OR REPLACE FUNCTION invalidate_fact(
  p_fact_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_knowledge_graph
  SET valid_to = now()
  WHERE id = p_fact_id AND valid_to IS NULL;
END;
$$;

-- Enable RLS
ALTER TABLE user_knowledge_graph ENABLE ROW LEVEL SECURITY;

-- Users can read their own facts; agents write via admin client (service role)
CREATE POLICY "users_read_own_facts" ON user_knowledge_graph
  FOR SELECT USING (auth.uid() = user_id);
