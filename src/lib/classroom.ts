import { courses } from "@/data";
import type { Course, Module, Lesson } from "@/data/types";

/**
 * Generate class units from a course's modules.
 * One class per module, with all lesson IDs pre-populated.
 * First class is unlocked by default.
 */
export function generateClassesFromCourse(courseSlug: string) {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return [];

  return course.modules.map((mod, i) => ({
    title: `Class ${i + 1}: ${mod.title}`,
    description: mod.description,
    class_order: i + 1,
    module_id: mod.id,
    lesson_ids: mod.lessons.map((l) => l.id),
    status: i === 0 ? "unlocked" : ("locked" as "unlocked" | "locked"),
  }));
}

/**
 * Get all lessons for a class unit by looking up the module in course data.
 */
export function getClassLessons(courseSlug: string, moduleId: string): Lesson[] {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return [];
  const mod = course.modules.find((m) => m.id === moduleId);
  return mod?.lessons ?? [];
}

/**
 * Get a specific lesson by ID from course data.
 */
export function getLessonById(courseSlug: string, lessonId: string): Lesson | null {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return null;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

/**
 * Get module info by ID.
 */
export function getModuleById(courseSlug: string, moduleId: string): Module | null {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return null;
  return course.modules.find((m) => m.id === moduleId) ?? null;
}

/**
 * Get course by slug.
 */
export function getCourseBySlug(slug: string): Course | null {
  return courses.find((c) => c.slug === slug) ?? null;
}

/**
 * Generate a 6-char join code.
 */
export function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

/**
 * Auto-generate homework from a lesson's exercises.
 * Returns homework entries for lessons that have starterCode.
 */
export function autoGenerateHomework(courseSlug: string, lessonIds: string[]) {
  const homework: {
    title: string;
    description: string;
    starter_code: string | null;
    solution_code: string | null;
    language: string;
    source_lesson_id: string;
  }[] = [];

  for (const lessonId of lessonIds) {
    const lesson = getLessonById(courseSlug, lessonId);
    if (!lesson?.starterCode) continue;

    homework.push({
      title: `Exercise: ${lesson.title}`,
      description: `Complete the coding exercise for "${lesson.title}". Use the starter code provided and implement the solution.`,
      starter_code: lesson.starterCode,
      solution_code: lesson.solutionCode ?? null,
      language: "python",
      source_lesson_id: lesson.id,
    });
  }

  return homework;
}
