export interface Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;        // Markdown content
  starterCode?: string;   // For IDE exercises
  solutionCode?: string;  // Solution to reveal
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  modules: Module[];
}

export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap(m => m.lessons);
}

export function findLesson(course: Course, lessonSlug: string): {
  lesson: Lesson;
  module: Module;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
} | null {
  const allLessons = getAllLessons(course);
  const index = allLessons.findIndex(l => l.slug === lessonSlug);
  if (index === -1) return null;
  const lesson = allLessons[index];
  const module = course.modules.find(m => m.lessons.some(l => l.id === lesson.id))!;
  return {
    lesson,
    module,
    prevLesson: index > 0 ? allLessons[index - 1] : null,
    nextLesson: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}

export function toSidebarModules(course: Course) {
  return course.modules.map(m => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map(l => ({ id: l.id, title: l.title, slug: l.slug })),
  }));
}
