-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Course embeddings for semantic search and recommendations
CREATE TABLE IF NOT EXISTS course_embeddings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL DEFAULT 'general',
  level TEXT NOT NULL DEFAULT 'beginner',
  module_titles TEXT[],
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS course_embeddings_vector_idx
  ON course_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- Full-text search index for hybrid search
CREATE INDEX IF NOT EXISTS course_embeddings_fts_idx
  ON course_embeddings USING gin (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- RPC function: find courses by vector similarity
CREATE OR REPLACE FUNCTION match_courses(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  description TEXT,
  domain TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.title,
    ce.description,
    ce.domain,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM course_embeddings ce
  WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
