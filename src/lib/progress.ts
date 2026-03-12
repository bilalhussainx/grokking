export async function getCompletedLessons(courseSlug: string): Promise<Set<string>> {
  try {
    const res = await fetch(`/api/progress?course=${encodeURIComponent(courseSlug)}`);
    if (!res.ok) return new Set();
    const { lessons } = await res.json();
    return new Set(lessons);
  } catch {
    return new Set();
  }
}

export async function markLessonComplete(
  courseSlug: string,
  lessonId: string
): Promise<Set<string>> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, lessonId, complete: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[progress] markComplete failed:", res.status, data.error, data.detail);
      return new Set();
    }
    return new Set(data.lessons);
  } catch (err) {
    console.error("[progress] markComplete error:", err);
    return new Set();
  }
}

export async function markLessonIncomplete(
  courseSlug: string,
  lessonId: string
): Promise<Set<string>> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, lessonId, complete: false }),
    });
    if (!res.ok) return new Set();
    const { lessons } = await res.json();
    return new Set(lessons);
  } catch {
    return new Set();
  }
}

export async function getCourseProgress(
  courseSlug: string,
  totalLessons: number
): Promise<number> {
  if (totalLessons <= 0) return 0;
  const completed = await getCompletedLessons(courseSlug);
  return Math.round((completed.size / totalLessons) * 100);
}
