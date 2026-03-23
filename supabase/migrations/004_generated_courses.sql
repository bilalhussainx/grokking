-- Migration 004: Generated Courses
-- Stores dynamically generated course content from institution syllabi

CREATE TABLE IF NOT EXISTS generated_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('free', 'pro')),
  source_url TEXT,
  source_name TEXT,
  course_data JSONB NOT NULL DEFAULT '{"modules":[]}',
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'failed', 'draft')),
  created_by UUID REFERENCES auth.users(id),
  is_curated BOOLEAN DEFAULT false,
  generation_log TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gen_courses_slug ON generated_courses(slug);
CREATE INDEX idx_gen_courses_status ON generated_courses(status);
CREATE INDEX idx_gen_courses_curated ON generated_courses(is_curated, status);
CREATE INDEX idx_gen_courses_creator ON generated_courses(created_by);

ALTER TABLE generated_courses ENABLE ROW LEVEL SECURITY;

-- Curated+ready courses visible to all authenticated users
-- User-generated courses visible to creator
-- Admins see everything
CREATE POLICY "view_generated_courses" ON generated_courses
  FOR SELECT USING (
    (is_curated = true AND status = 'ready')
    OR auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "insert_generated_courses" ON generated_courses
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "update_generated_courses" ON generated_courses
  FOR UPDATE USING (
    auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
