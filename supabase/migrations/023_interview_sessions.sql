-- 023_interview_sessions.sql
-- Stateful interview sessions with performance tracking

-- Interview sessions — one per interview attempt
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_persona_id TEXT NOT NULL DEFAULT 'generic',
  category TEXT NOT NULL DEFAULT 'tech' CHECK (category IN ('tech', 'college')),
  interview_type TEXT NOT NULL DEFAULT 'technical',
  preset TEXT,
  language TEXT NOT NULL DEFAULT 'en',

  -- Session state
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_phase INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,

  -- Structured data
  question_plan JSONB NOT NULL DEFAULT '{}',
  session_structure JSONB,
  conversation_history JSONB NOT NULL DEFAULT '[]',
  code_submissions JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  total_turns INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user
  ON interview_sessions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_active
  ON interview_sessions (user_id, status) WHERE status = 'active';

-- RLS
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_sessions_user_policy ON interview_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Interview performance — one per completed session
CREATE TABLE IF NOT EXISTS interview_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES interview_sessions(id),
  company_persona_id TEXT NOT NULL DEFAULT 'generic',
  category TEXT NOT NULL DEFAULT 'tech',
  interview_type TEXT NOT NULL DEFAULT 'technical',

  -- Scores (1-10 scale)
  overall_score FLOAT NOT NULL,
  communication_score FLOAT NOT NULL DEFAULT 0,
  technical_depth_score FLOAT NOT NULL DEFAULT 0,
  problem_solving_score FLOAT NOT NULL DEFAULT 0,
  code_quality_score FLOAT NOT NULL DEFAULT 0,

  -- Feedback
  strengths TEXT[] NOT NULL DEFAULT '{}',
  improvements TEXT[] NOT NULL DEFAULT '{}',
  question_scores JSONB NOT NULL DEFAULT '[]',

  -- Topics for learning loop
  topics_strong TEXT[] NOT NULL DEFAULT '{}',
  topics_weak TEXT[] NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_performance_user
  ON interview_performance (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_performance_company
  ON interview_performance (user_id, company_persona_id, created_at DESC);

ALTER TABLE interview_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_performance_user_policy ON interview_performance
  FOR ALL USING (auth.uid() = user_id);
