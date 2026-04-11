-- Migration 026: Career Pathways
-- Per-user career goal tracking. Fed by skills-radar, knowledge graph, and
-- interview performance to drive the career coach + dashboard.

CREATE TABLE IF NOT EXISTS career_pathways (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
  target_role TEXT NOT NULL,
  target_companies TEXT[] DEFAULT '{}',
  target_timeline TEXT,
  required_skills JSONB DEFAULT '[]',
  recommended_courses TEXT[] DEFAULT '{}',
  completed_milestones TEXT[] DEFAULT '{}',
  next_action TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'achieved', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cp_user ON career_pathways (user_id);
CREATE INDEX IF NOT EXISTS idx_cp_user_status ON career_pathways (user_id, status);

-- Trigger: bump updated_at on row changes
CREATE OR REPLACE FUNCTION touch_career_pathway_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cp_updated_at ON career_pathways;
CREATE TRIGGER trg_cp_updated_at
  BEFORE UPDATE ON career_pathways
  FOR EACH ROW EXECUTE FUNCTION touch_career_pathway_updated_at();

-- RLS: users can only see their own pathways
ALTER TABLE career_pathways ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cp_select_own ON career_pathways;
CREATE POLICY cp_select_own ON career_pathways
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS cp_insert_own ON career_pathways;
CREATE POLICY cp_insert_own ON career_pathways
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS cp_update_own ON career_pathways;
CREATE POLICY cp_update_own ON career_pathways
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS cp_delete_own ON career_pathways;
CREATE POLICY cp_delete_own ON career_pathways
  FOR DELETE USING (auth.uid() = user_id);
