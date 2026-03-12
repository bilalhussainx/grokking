-- =============================================================================
-- Classroom System — Structured Classes with Gated Progression
-- =============================================================================

-- 1. CLASSROOMS — A teacher's instance of a course
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL,
  course_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  join_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classrooms_join_code ON classrooms(join_code);

-- 2. ENROLLMENTS — Students enrolled in a classroom
CREATE TABLE IF NOT EXISTS classroom_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
  UNIQUE(classroom_id, student_id)
);

CREATE INDEX idx_enrollments_classroom ON classroom_enrollments(classroom_id);
CREATE INDEX idx_enrollments_student ON classroom_enrollments(student_id);

-- 3. CLASSES — Individual class units within a classroom (maps to course modules)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  class_order INTEGER NOT NULL,
  module_id TEXT,
  lesson_ids TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  unlocked_at TIMESTAMPTZ,
  session_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_classroom ON classes(classroom_id);
CREATE INDEX idx_classes_order ON classes(classroom_id, class_order);

-- 4. CLASS HOMEWORK — Persisted homework tied to a class
CREATE TABLE IF NOT EXISTS class_homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT,
  language TEXT DEFAULT 'python',
  source_lesson_id TEXT,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_class_homework_class ON class_homework(class_id);

-- 5. HOMEWORK SUBMISSIONS — Student work
CREATE TABLE IF NOT EXISTS homework_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES class_homework(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  ai_grade JSONB,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at TIMESTAMPTZ,
  teacher_feedback TEXT,
  UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX idx_submissions_student ON homework_submissions(student_id);

-- 6. CLASS PROGRESS — Per-student progress through classes
CREATE TABLE IF NOT EXISTS class_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(class_id, student_id)
);

CREATE INDEX idx_progress_class ON class_progress(class_id);
CREATE INDEX idx_progress_student ON class_progress(student_id);

-- 7. Link live_sessions to classroom system
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS class_id UUID;
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS classroom_id UUID;
