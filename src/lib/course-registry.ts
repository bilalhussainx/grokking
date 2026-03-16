// Course Registry — merges hardcoded courses with generated courses from Supabase

import { courses as hardcodedCourses } from "@/data";
import type { Course } from "@/data/types";

// Client-side cache
let generatedCoursesCache: Course[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export function getHardcodedCourses(): Course[] {
  return hardcodedCourses;
}

export async function getGeneratedCourses(): Promise<Course[]> {
  const now = Date.now();
  if (generatedCoursesCache.length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return generatedCoursesCache;
  }

  try {
    const res = await fetch("/api/courses/generated", { cache: "no-store" });
    if (!res.ok) return generatedCoursesCache;
    const data = await res.json();
    generatedCoursesCache = data.courses || [];
    cacheTimestamp = now;
    return generatedCoursesCache;
  } catch {
    return generatedCoursesCache;
  }
}

export async function getAllCourses(): Promise<Course[]> {
  const generated = await getGeneratedCourses();
  return [...hardcodedCourses, ...generated];
}

export function findCourseBySlug(
  allCourses: Course[],
  slug: string
): Course | undefined {
  return allCourses.find((c) => c.slug === slug);
}

export function invalidateCache() {
  cacheTimestamp = 0;
  generatedCoursesCache = [];
}
