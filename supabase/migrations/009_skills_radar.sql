-- Skills taxonomy (populated from course content analysis)
CREATE TABLE IF NOT EXISTS skills_taxonomy (
  skill_id TEXT PRIMARY KEY,
  skill_name TEXT NOT NULL,
  skill_type TEXT CHECK (skill_type IN ('technical', 'soft', 'tool')),
  category TEXT,
  description TEXT,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course-to-skill mapping
CREATE TABLE IF NOT EXISTS course_skill_map (
  course_id TEXT NOT NULL,
  lesson_id TEXT,
  skill_id TEXT REFERENCES skills_taxonomy(skill_id),
  relevance FLOAT DEFAULT 1.0,
  PRIMARY KEY (course_id, skill_id)
);

-- User skills portfolio (earned through course completion)
CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID NOT NULL,
  skill_id TEXT REFERENCES skills_taxonomy(skill_id),
  proficiency FLOAT DEFAULT 0.0,
  earned_at TIMESTAMPTZ DEFAULT now(),
  source_course TEXT,
  source_lesson TEXT,
  PRIMARY KEY (user_id, skill_id)
);

-- Career roles with required skills
CREATE TABLE IF NOT EXISTS career_roles (
  role_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  avg_salary_usd INTEGER,
  growth_outlook TEXT,
  required_skills JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cached job posting data
CREATE TABLE IF NOT EXISTS job_postings_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_query TEXT NOT NULL,
  title TEXT,
  company TEXT,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  skills_mentioned TEXT[],
  source TEXT DEFAULT 'manual',
  fetched_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '7 days'
);

CREATE INDEX IF NOT EXISTS skills_taxonomy_vector_idx
  ON skills_taxonomy USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);
