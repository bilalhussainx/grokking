-- =============================================================================
-- Grokking Platform — Full Database Migration
-- =============================================================================
-- Tables: user_profiles, live_sessions, session_participants, session_messages,
--         session_snapshots, documents, document_comments,
--         writing_pipeline_runs, pipeline_stages
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. USER PROFILES
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 1B. INVITE CODES (for teacher registration)
-- =============================================================================
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin')),
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_unused ON invite_codes(code) WHERE used_by IS NULL;

-- =============================================================================
-- 2. LIVE SESSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL DEFAULT 'coding' CHECK (session_type IN ('coding', 'writing', 'review')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'ended')),
  join_code TEXT NOT NULL UNIQUE,
  course_slug TEXT,
  lesson_slug TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_sessions_teacher ON live_sessions(teacher_id);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);
CREATE INDEX idx_live_sessions_join_code ON live_sessions(join_code);
CREATE INDEX idx_live_sessions_created_at ON live_sessions(created_at DESC);

-- =============================================================================
-- 3. SESSION PARTICIPANTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'observer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_session_participants_session ON session_participants(session_id);
CREATE INDEX idx_session_participants_user ON session_participants(user_id);
CREATE INDEX idx_session_participants_active ON session_participants(session_id, is_active);

-- =============================================================================
-- 4. SESSION MESSAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS session_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'code_share', 'question', 'answer', 'system', 'ai_response')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_messages_session ON session_messages(session_id);
CREATE INDEX idx_session_messages_created ON session_messages(session_id, created_at);
CREATE INDEX idx_session_messages_type ON session_messages(session_id, message_type);

-- =============================================================================
-- 5. SESSION SNAPSHOTS (code/editor state)
-- =============================================================================
CREATE TABLE IF NOT EXISTS session_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL DEFAULT 'code' CHECK (snapshot_type IN ('code', 'document', 'whiteboard')),
  content TEXT NOT NULL DEFAULT '',
  language TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_snapshots_session ON session_snapshots(session_id);
CREATE INDEX idx_session_snapshots_user ON session_snapshots(session_id, user_id);

-- =============================================================================
-- 6. DOCUMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES live_sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  doc_type TEXT NOT NULL DEFAULT 'essay' CHECK (doc_type IN ('essay', 'report', 'creative', 'technical', 'free')),
  content JSONB NOT NULL DEFAULT '{"type": "doc", "content": [{"type": "paragraph"}]}',
  plain_text TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_session ON documents(session_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_updated ON documents(updated_at DESC);

-- =============================================================================
-- 7. DOCUMENT COMMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS document_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  author_type TEXT NOT NULL DEFAULT 'human' CHECK (author_type IN ('human', 'ai')),
  author_name TEXT,
  content TEXT NOT NULL,
  selection_from INTEGER,
  selection_to INTEGER,
  category TEXT CHECK (category IN ('grammar', 'clarity', 'flow', 'content', 'style', 'structure')),
  severity TEXT CHECK (severity IN ('suggestion', 'warning', 'error')),
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_document_comments_doc ON document_comments(document_id);
CREATE INDEX idx_document_comments_unresolved ON document_comments(document_id, resolved) WHERE resolved = false;

-- =============================================================================
-- 8. WRITING PIPELINE RUNS
-- =============================================================================
CREATE TABLE IF NOT EXISTS writing_pipeline_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  initiated_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  pipeline_type TEXT NOT NULL DEFAULT 'essay',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'awaiting_approval', 'completed', 'failed')),
  current_stage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pipeline_runs_document ON writing_pipeline_runs(document_id);
CREATE INDEX idx_pipeline_runs_status ON writing_pipeline_runs(status);

-- =============================================================================
-- 9. PIPELINE STAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES writing_pipeline_runs(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL CHECK (stage_name IN ('outline', 'research', 'draft', 'refine', 'final')),
  stage_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'awaiting_approval', 'approved', 'completed', 'rejected')),
  ai_output JSONB NOT NULL DEFAULT '{}',
  teacher_feedback TEXT,
  approved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(run_id, stage_name)
);

CREATE INDEX idx_pipeline_stages_run ON pipeline_stages(run_id);
CREATE INDEX idx_pipeline_stages_status ON pipeline_stages(run_id, status);
CREATE INDEX idx_pipeline_stages_order ON pipeline_stages(run_id, stage_order);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

-- INVITE CODES policies
CREATE POLICY "Anyone can check invite codes during signup"
  ON invite_codes FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create invite codes"
  ON invite_codes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Invite codes can be claimed during signup"
  ON invite_codes FOR UPDATE
  USING (used_by IS NULL);

-- USER PROFILES policies
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- LIVE SESSIONS policies
CREATE POLICY "Anyone can view sessions they participate in"
  ON live_sessions FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Teachers can create sessions"
  ON live_sessions FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own sessions"
  ON live_sessions FOR UPDATE
  USING (teacher_id = auth.uid());

-- SESSION PARTICIPANTS policies
CREATE POLICY "Participants can view session members"
  ON session_participants FOR SELECT
  USING (
    session_id IN (SELECT session_id FROM session_participants sp WHERE sp.user_id = auth.uid())
  );

CREATE POLICY "Users can join sessions"
  ON session_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own participation"
  ON session_participants FOR UPDATE
  USING (user_id = auth.uid());

-- SESSION MESSAGES policies
CREATE POLICY "Participants can view session messages"
  ON session_messages FOR SELECT
  USING (
    session_id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can send messages"
  ON session_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND session_id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

-- SESSION SNAPSHOTS policies
CREATE POLICY "Participants can view snapshots"
  ON session_snapshots FOR SELECT
  USING (
    session_id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can create snapshots"
  ON session_snapshots FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND session_id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

-- DOCUMENTS policies
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can view session documents"
  ON documents FOR SELECT
  USING (
    session_id IN (SELECT session_id FROM session_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create documents"
  ON documents FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (owner_id = auth.uid());

-- DOCUMENT COMMENTS policies
CREATE POLICY "Users can view comments on accessible documents"
  ON document_comments FOR SELECT
  USING (
    document_id IN (
      SELECT id FROM documents WHERE owner_id = auth.uid()
      UNION
      SELECT d.id FROM documents d JOIN session_participants sp ON d.session_id = sp.session_id WHERE sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add comments"
  ON document_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid() OR author_type = 'ai'
  );

CREATE POLICY "Users can resolve own document comments"
  ON document_comments FOR UPDATE
  USING (
    document_id IN (SELECT id FROM documents WHERE owner_id = auth.uid())
  );

-- WRITING PIPELINE RUNS policies
CREATE POLICY "Users can view own pipeline runs"
  ON writing_pipeline_runs FOR SELECT
  USING (
    initiated_by = auth.uid()
    OR document_id IN (SELECT id FROM documents WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can create pipeline runs"
  ON writing_pipeline_runs FOR INSERT
  WITH CHECK (initiated_by = auth.uid());

CREATE POLICY "Users can update own pipeline runs"
  ON writing_pipeline_runs FOR UPDATE
  USING (initiated_by = auth.uid());

-- PIPELINE STAGES policies
CREATE POLICY "Users can view stages of accessible runs"
  ON pipeline_stages FOR SELECT
  USING (
    run_id IN (
      SELECT id FROM writing_pipeline_runs WHERE initiated_by = auth.uid()
      UNION
      SELECT wpr.id FROM writing_pipeline_runs wpr JOIN documents d ON wpr.document_id = d.id WHERE d.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stages for own runs"
  ON pipeline_stages FOR INSERT
  WITH CHECK (
    run_id IN (SELECT id FROM writing_pipeline_runs WHERE initiated_by = auth.uid())
  );

CREATE POLICY "Users can update stages for own runs"
  ON pipeline_stages FOR UPDATE
  USING (
    run_id IN (SELECT id FROM writing_pipeline_runs WHERE initiated_by = auth.uid())
  );

-- =============================================================================
-- REALTIME PUBLICATION
-- =============================================================================
-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE session_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE document_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE writing_pipeline_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE pipeline_stages;

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON live_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON writing_pipeline_runs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
