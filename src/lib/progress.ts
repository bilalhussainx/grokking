const PROGRESS_KEY = "grokking-progress";

interface ProgressData {
  [courseSlug: string]: string[];
}

function readProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function getCompletedLessons(courseSlug: string): Set<string> {
  const data = readProgress();
  return new Set(data[courseSlug] ?? []);
}

export function markLessonComplete(
  courseSlug: string,
  lessonId: string
): Set<string> {
  const data = readProgress();
  const lessons = new Set(data[courseSlug] ?? []);
  lessons.add(lessonId);
  data[courseSlug] = Array.from(lessons);
  writeProgress(data);
  return lessons;
}

export function markLessonIncomplete(
  courseSlug: string,
  lessonId: string
): Set<string> {
  const data = readProgress();
  const lessons = new Set(data[courseSlug] ?? []);
  lessons.delete(lessonId);
  data[courseSlug] = Array.from(lessons);
  writeProgress(data);
  return lessons;
}

export function getCourseProgress(
  courseSlug: string,
  totalLessons: number
): number {
  if (totalLessons <= 0) return 0;
  const completed = getCompletedLessons(courseSlug);
  return Math.round((completed.size / totalLessons) * 100);
}
