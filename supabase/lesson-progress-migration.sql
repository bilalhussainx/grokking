-- =============================================================================
-- Lesson Progress table for tracking completed lessons per user
-- =============================================================================

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_slug, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_course ON lesson_progress(user_id, course_slug);
