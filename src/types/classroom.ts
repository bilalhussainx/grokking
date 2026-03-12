export interface Classroom {
  id: string;
  teacher_id: string;
  course_slug: string;
  title: string;
  description: string | null;
  join_code: string;
  status: "draft" | "active" | "archived";
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // joined fields
  classes?: ClassUnit[];
  enrollment_count?: number;
  teacher_name?: string;
}

export interface ClassUnit {
  id: string;
  classroom_id: string;
  title: string;
  description: string | null;
  class_order: number;
  module_id: string | null;
  lesson_ids: string[];
  status: "locked" | "unlocked" | "in_progress" | "completed";
  unlocked_at: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  homework?: ClassHomework[];
  progress?: ClassProgress[];
}

export interface ClassroomEnrollment {
  id: string;
  classroom_id: string;
  student_id: string;
  enrolled_at: string;
  status: "active" | "dropped" | "completed";
  // joined
  student_name?: string;
  student_email?: string;
}

export interface ClassHomework {
  id: string;
  class_id: string;
  title: string;
  description: string;
  starter_code: string | null;
  solution_code: string | null;
  language: string;
  source_lesson_id: string | null;
  due_at: string | null;
  created_at: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  code: string;
  output: string | null;
  ai_grade: AIGradeResult | null;
  status: "submitted" | "graded" | "returned";
  submitted_at: string;
  graded_at: string | null;
  teacher_feedback: string | null;
}

export interface AIGradeResult {
  score: number;        // 0-100
  passed: boolean;
  feedback: string;
  hints: string[];
  test_results?: { input: string; expected: string; actual: string; passed: boolean }[];
}

export interface ClassProgress {
  id: string;
  class_id: string;
  student_id: string;
  status: "not_started" | "in_progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
}
