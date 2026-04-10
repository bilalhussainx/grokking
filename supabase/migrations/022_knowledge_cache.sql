-- Migration 022: Knowledge Cache
-- Background-indexed real-world data (interview patterns, job market, university stats).
-- Refreshed by cron/manual trigger via Tavily search + Gemini embeddings.

CREATE TABLE IF NOT EXISTS knowledge_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL CHECK (domain IN (
    'interview_patterns', 'job_market', 'university_stats', 'domain_knowledge'
  )),
  entity TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  embedding vector(768),
  indexed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Fast lookup by domain + entity
CREATE INDEX idx_kc_domain_entity
  ON knowledge_cache (domain, entity);

-- Expiration cleanup
CREATE INDEX idx_kc_expires
  ON knowledge_cache (expires_at)
  WHERE expires_at IS NOT NULL;

-- Vector search within domain
CREATE INDEX idx_kc_embedding
  ON knowledge_cache USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RPC: Search knowledge cache by domain + semantic similarity
CREATE OR REPLACE FUNCTION search_knowledge_cache(
  p_domain TEXT,
  p_entity TEXT DEFAULT NULL,
  p_embedding vector(768) DEFAULT NULL,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  domain TEXT,
  entity TEXT,
  content TEXT,
  source_url TEXT,
  metadata JSONB,
  similarity REAL,
  indexed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_embedding IS NOT NULL THEN
    -- Semantic search
    RETURN QUERY
    SELECT
      kc.id,
      kc.domain,
      kc.entity,
      kc.content,
      kc.source_url,
      kc.metadata,
      (1 - (kc.embedding <=> p_embedding))::REAL AS similarity,
      kc.indexed_at
    FROM knowledge_cache kc
    WHERE kc.domain = p_domain
      AND (p_entity IS NULL OR kc.entity = p_entity)
      AND (kc.expires_at IS NULL OR kc.expires_at > now())
    ORDER BY kc.embedding <=> p_embedding
    LIMIT p_limit;
  ELSE
    -- Exact match by entity
    RETURN QUERY
    SELECT
      kc.id,
      kc.domain,
      kc.entity,
      kc.content,
      kc.source_url,
      kc.metadata,
      1.0::REAL AS similarity,
      kc.indexed_at
    FROM knowledge_cache kc
    WHERE kc.domain = p_domain
      AND (p_entity IS NULL OR kc.entity = p_entity)
      AND (kc.expires_at IS NULL OR kc.expires_at > now())
    ORDER BY kc.indexed_at DESC
    LIMIT p_limit;
  END IF;
END;
$$;

-- Enable RLS (public read for cached knowledge, admin write)
ALTER TABLE knowledge_cache ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read the knowledge cache
CREATE POLICY "authenticated_read_knowledge_cache" ON knowledge_cache
  FOR SELECT USING (auth.role() = 'authenticated');
