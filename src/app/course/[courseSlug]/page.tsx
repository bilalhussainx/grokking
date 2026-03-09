"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";

export default function CourseOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const courseSlug = params.courseSlug as string;

  const course = courses.find((c) => c.slug === courseSlug);

  useEffect(() => {
    if (course) {
      const allLessons = getAllLessons(course);
      if (allLessons.length > 0) {
        router.replace(`/course/${courseSlug}/${allLessons[0].slug}`);
      }
    }
  }, [course, courseSlug, router]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Redirecting to first lesson...
      </p>
    </div>
  );
}
