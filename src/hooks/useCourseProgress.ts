"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCompletedLessons } from "@/lib/progress";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";

/**
 * Fetches progress for all courses. Returns a map of courseSlug → percentage (0-100).
 * Only fetches when user is logged in.
 */
export function useCourseProgress(): Record<string, number> {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchAll() {
      const result: Record<string, number> = {};

      // Fetch in parallel, batches of 6 to avoid overwhelming the API
      for (let i = 0; i < courses.length; i += 6) {
        const batch = courses.slice(i, i + 6);
        const promises = batch.map(async (course) => {
          const total = getAllLessons(course).length;
          if (total === 0) return;
          const completed = await getCompletedLessons(course.slug);
          result[course.slug] = Math.round((completed.size / total) * 100);
        });
        await Promise.all(promises);
      }

      if (!cancelled) {
        setProgress(result);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [user]);

  return progress;
}
