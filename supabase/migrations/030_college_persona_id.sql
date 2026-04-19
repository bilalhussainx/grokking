-- 030_college_persona_id.sql
-- Add college_persona_id to interview tables for CC interview prep tracking

ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS college_persona_id TEXT;
ALTER TABLE interview_performance ADD COLUMN IF NOT EXISTS college_persona_id TEXT;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_college
  ON interview_sessions (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';

CREATE INDEX IF NOT EXISTS idx_interview_performance_college
  ON interview_performance (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';
