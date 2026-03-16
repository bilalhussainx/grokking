-- Lesson-level embeddings for cross-domain bridge discovery and semantic search
CREATE TABLE IF NOT EXISTS lesson_embeddings (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  course_domain TEXT,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_preview TEXT,
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_embeddings_vector_idx
  ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Cross-domain concept bridges (auto-discovered via embedding similarity)
CREATE TABLE IF NOT EXISTS concept_bridges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_a_id TEXT NOT NULL,
  lesson_a_course TEXT NOT NULL,
  lesson_a_domain TEXT NOT NULL,
  lesson_b_id TEXT NOT NULL,
  lesson_b_course TEXT NOT NULL,
  lesson_b_domain TEXT NOT NULL,
  similarity FLOAT NOT NULL,
  bridge_label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS concept_bridges_lesson_a_idx ON concept_bridges (lesson_a_id);
CREATE INDEX IF NOT EXISTS concept_bridges_lesson_b_idx ON concept_bridges (lesson_b_id);

-- RPC: find bridges for a lesson
CREATE OR REPLACE FUNCTION get_concept_bridges(p_lesson_id TEXT, p_limit INT DEFAULT 3)
RETURNS TABLE (
  bridge_id UUID,
  connected_lesson_id TEXT,
  connected_course TEXT,
  connected_domain TEXT,
  connected_title TEXT,
  similarity FLOAT,
  bridge_label TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cb.id,
    CASE WHEN cb.lesson_a_id = p_lesson_id THEN cb.lesson_b_id ELSE cb.lesson_a_id END,
    CASE WHEN cb.lesson_a_id = p_lesson_id THEN cb.lesson_b_course ELSE cb.lesson_a_course END,
    CASE WHEN cb.lesson_a_id = p_lesson_id THEN cb.lesson_b_domain ELSE cb.lesson_a_domain END,
    le.title,
    cb.similarity,
    cb.bridge_label
  FROM concept_bridges cb
  LEFT JOIN lesson_embeddings le ON le.id = (
    CASE WHEN cb.lesson_a_id = p_lesson_id THEN cb.lesson_b_id ELSE cb.lesson_a_id END
  )
  WHERE cb.lesson_a_id = p_lesson_id OR cb.lesson_b_id = p_lesson_id
  ORDER BY cb.similarity DESC
  LIMIT p_limit;
END;
$$;
