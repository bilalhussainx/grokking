import Link from "next/link";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav Bar */}
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Grokking
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Master coding interviews &amp; system design
          </p>
        </div>
      </nav>

      {/* Course Catalog */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Course Catalog
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No courses available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => {
              const allLessons = getAllLessons(course);
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
                >
                  <div className="mb-4 text-4xl">{course.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>{course.modules.length} modules</span>
                    <span>{allLessons.length} lessons</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
