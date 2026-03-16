-- Phase 5: Misconception Clustering
-- Wrong answer/submission embeddings + discovered misconception clusters

-- Wrong answer/submission embeddings
CREATE TABLE IF NOT EXISTS submission_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('code', 'quiz')),
  submission_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submission_embeddings_vector_idx
  ON submission_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS submission_embeddings_lesson_idx
  ON submission_embeddings (lesson_id, is_correct);

-- Discovered misconception clusters
CREATE TABLE IF NOT EXISTS misconception_clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centroid vector(768),
  label TEXT NOT NULL,
  description TEXT,
  course_id TEXT,
  lesson_id TEXT,
  occurrence_count INTEGER DEFAULT 1,
  resolution_rate FLOAT DEFAULT 0,
  remediation_content TEXT,
  example_submissions TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RPC: Find similar misconceptions for a new submission
CREATE OR REPLACE FUNCTION match_misconceptions(
  query_embedding vector(768),
  p_lesson_id TEXT,
  match_count INT DEFAULT 3,
  match_threshold FLOAT DEFAULT 0.75
)
RETURNS TABLE (
  id UUID,
  label TEXT,
  description TEXT,
  remediation_content TEXT,
  similarity FLOAT,
  occurrence_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id,
    mc.label,
    mc.description,
    mc.remediation_content,
    1 - (mc.centroid <=> query_embedding) AS similarity,
    mc.occurrence_count
  FROM misconception_clusters mc
  WHERE (mc.lesson_id = p_lesson_id OR mc.lesson_id IS NULL)
    AND 1 - (mc.centroid <=> query_embedding) > match_threshold
  ORDER BY mc.centroid <=> query_embedding
  LIMIT match_count;
END;
$$;
