-- Migration 021: Agent Memories
-- Per-agent conversation memories with pgvector embeddings.
-- Replaces conversation_memories for new agents while keeping backward compat.

CREATE TABLE IF NOT EXISTS agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'coach', 'interviewer', 'language_tutor', 'career_coach', 'university_coach'
  )),
  session_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup: recent memories for a user + agent type
CREATE INDEX idx_am_user_agent
  ON agent_memories (user_id, agent_type, created_at DESC);

-- Fast lookup: by session
CREATE INDEX idx_am_session
  ON agent_memories (session_id)
  WHERE session_id IS NOT NULL;

-- Vector similarity search (HNSW for better recall at scale vs ivfflat)
CREATE INDEX idx_am_embedding
  ON agent_memories USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RPC: Semantic search within agent memories
CREATE OR REPLACE FUNCTION search_agent_memories(
  p_user_id UUID,
  p_agent_type TEXT,
  p_embedding vector(768),
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  summary TEXT,
  metadata JSONB,
  similarity REAL,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    am.id,
    am.role,
    am.content,
    am.summary,
    am.metadata,
    (1 - (am.embedding <=> p_embedding))::REAL AS similarity,
    am.created_at
  FROM agent_memories am
  WHERE am.user_id = p_user_id
    AND am.agent_type = p_agent_type
    AND am.embedding IS NOT NULL
  ORDER BY am.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$;

-- RPC: Store an agent memory
CREATE OR REPLACE FUNCTION store_agent_memory(
  p_user_id UUID,
  p_agent_type TEXT,
  p_session_id UUID DEFAULT NULL,
  p_role TEXT DEFAULT 'user',
  p_content TEXT DEFAULT '',
  p_summary TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_embedding vector(768) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO agent_memories (
    user_id, agent_type, session_id, role, content, summary, metadata, embedding
  )
  VALUES (
    p_user_id, p_agent_type, p_session_id, p_role, p_content, p_summary, p_metadata, p_embedding
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Enable RLS
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_agent_memories" ON agent_memories
  FOR SELECT USING (auth.uid() = user_id);
