-- Cached external content with embeddings
CREATE TABLE IF NOT EXISTS external_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('arxiv', 'github', 'stackoverflow', 'news')),
  external_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  tags TEXT[],
  embedding vector(768),
  fetched_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '7 days',
  UNIQUE(source, external_id)
);

CREATE INDEX IF NOT EXISTS external_content_vector_idx
  ON external_content USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS external_content_source_idx
  ON external_content (source, fetched_at DESC);

-- User trend notifications (which trends were shown to which users)
CREATE TABLE IF NOT EXISTS user_trend_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID REFERENCES external_content(id),
  related_course TEXT,
  related_lesson TEXT,
  similarity FLOAT,
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RPC: Find external content matching a user's completed lessons
CREATE OR REPLACE FUNCTION match_trends_for_user(
  p_user_id UUID,
  p_match_count INT DEFAULT 5,
  p_match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  content_id UUID,
  source TEXT,
  title TEXT,
  description TEXT,
  url TEXT,
  published_at TIMESTAMPTZ,
  related_course TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (ec.id)
    ec.id AS content_id,
    ec.source,
    ec.title,
    ec.description,
    ec.url,
    ec.published_at,
    le.course_id AS related_course,
    1 - (ec.embedding <=> le.embedding) AS similarity
  FROM external_content ec
  CROSS JOIN LATERAL (
    SELECT le2.course_id, le2.embedding
    FROM lesson_embeddings le2
    INNER JOIN lesson_progress lp ON lp.lesson_id = le2.id AND lp.user_id = p_user_id
    ORDER BY le2.embedding <=> ec.embedding
    LIMIT 1
  ) le
  WHERE ec.expires_at > now()
    AND 1 - (ec.embedding <=> le.embedding) > p_match_threshold
    AND ec.id NOT IN (
      SELECT utn.content_id FROM user_trend_notifications utn
      WHERE utn.user_id = p_user_id AND utn.seen = TRUE
    )
  ORDER BY ec.id, similarity DESC
  LIMIT p_match_count;
END;
$$;
