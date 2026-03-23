-- Migration 003: Conversation Memory with pgvector for RAG
-- Stores conversation embeddings for semantic search and course recommendations

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Conversation memories table
CREATE TABLE IF NOT EXISTS conversation_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT,
  lesson_slug TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  summary TEXT, -- AI-generated summary for quick retrieval
  embedding vector(768), -- Gemini text-embedding-004 produces 768-dim vectors
  topics TEXT[] DEFAULT '{}', -- extracted topic tags
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast retrieval
CREATE INDEX idx_memories_user ON conversation_memories(user_id);
CREATE INDEX idx_memories_course ON conversation_memories(user_id, course_slug);
CREATE INDEX idx_memories_created ON conversation_memories(created_at DESC);

-- Vector similarity search index (IVFFlat for good performance at scale)
CREATE INDEX idx_memories_embedding ON conversation_memories
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- User learning profile (aggregated from conversations)
CREATE TABLE IF NOT EXISTS learning_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  completed_topics TEXT[] DEFAULT '{}',
  preferred_style TEXT DEFAULT 'balanced', -- 'visual', 'hands-on', 'theoretical', 'balanced'
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Course recommendations cache
CREATE TABLE IF NOT EXISTS course_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  score REAL NOT NULL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_slug)
);

CREATE INDEX idx_recommendations_user ON course_recommendations(user_id, score DESC);

-- RPC: Semantic search for similar memories
CREATE OR REPLACE FUNCTION search_memories(
  p_user_id UUID,
  p_embedding vector(768),
  p_limit INT DEFAULT 5,
  p_course_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  summary TEXT,
  course_slug TEXT,
  lesson_slug TEXT,
  role TEXT,
  topics TEXT[],
  similarity REAL,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cm.id,
    cm.content,
    cm.summary,
    cm.course_slug,
    cm.lesson_slug,
    cm.role,
    cm.topics,
    (1 - (cm.embedding <=> p_embedding))::REAL AS similarity,
    cm.created_at
  FROM conversation_memories cm
  WHERE cm.user_id = p_user_id
    AND cm.embedding IS NOT NULL
    AND (p_course_slug IS NULL OR cm.course_slug = p_course_slug)
  ORDER BY cm.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$;

-- RPC: Store a memory with embedding
CREATE OR REPLACE FUNCTION store_memory(
  p_user_id UUID,
  p_course_slug TEXT,
  p_lesson_slug TEXT,
  p_role TEXT,
  p_content TEXT,
  p_summary TEXT DEFAULT NULL,
  p_embedding vector(768) DEFAULT NULL,
  p_topics TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO conversation_memories (user_id, course_slug, lesson_slug, role, content, summary, embedding, topics)
  VALUES (p_user_id, p_course_slug, p_lesson_slug, p_role, p_content, p_summary, p_embedding, p_topics)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- RPC: Update learning profile
CREATE OR REPLACE FUNCTION update_learning_profile(
  p_user_id UUID,
  p_strengths TEXT[] DEFAULT NULL,
  p_weaknesses TEXT[] DEFAULT NULL,
  p_completed_topics TEXT[] DEFAULT NULL,
  p_preferred_style TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO learning_profiles (user_id, strengths, weaknesses, completed_topics, preferred_style, last_updated)
  VALUES (
    p_user_id,
    COALESCE(p_strengths, '{}'),
    COALESCE(p_weaknesses, '{}'),
    COALESCE(p_completed_topics, '{}'),
    COALESCE(p_preferred_style, 'balanced'),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    strengths = CASE WHEN p_strengths IS NOT NULL THEN p_strengths ELSE learning_profiles.strengths END,
    weaknesses = CASE WHEN p_weaknesses IS NOT NULL THEN p_weaknesses ELSE learning_profiles.weaknesses END,
    completed_topics = CASE WHEN p_completed_topics IS NOT NULL
      THEN (SELECT ARRAY(SELECT DISTINCT unnest(learning_profiles.completed_topics || p_completed_topics)))
      ELSE learning_profiles.completed_topics END,
    preferred_style = CASE WHEN p_preferred_style IS NOT NULL THEN p_preferred_style ELSE learning_profiles.preferred_style END,
    last_updated = now();
END;
$$;

-- Enable RLS
ALTER TABLE conversation_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own data
CREATE POLICY "users_own_memories" ON conversation_memories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_profile" ON learning_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_recommendations" ON course_recommendations
  FOR ALL USING (auth.uid() = user_id);
