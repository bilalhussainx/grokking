import Link from "next/link";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              G
            </div>
            <span className="text-xl font-bold tracking-tight">Grokking</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-[var(--muted-foreground)]">
              Interactive Learning Platform
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Free &amp; Open Source
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Master{" "}
              <span className="gradient-text">Coding Interviews</span>
              <br />
              &amp; System Design
            </h1>
            <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
              Interactive courses with hands-on Python exercises and an in-browser IDE.
              Learn 16 coding patterns and design 10+ real-world systems — everything you
              need to ace your technical interviews.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={courses.length > 0 ? `/course/${courses[0].slug}` : "#courses"}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                Start Learning
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold transition-all hover:bg-[var(--card-hover)] hover:-translate-y-0.5"
              >
                Browse Courses
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-2xl opacity-0 animate-fade-in-up animate-delay-200">
            {[
              { value: "130+", label: "Lessons" },
              { value: "16", label: "Coding Patterns" },
              { value: "10+", label: "System Designs" },
              { value: "80+", label: "Practice Problems" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[var(--border)] bg-[var(--muted)]/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 sm:grid-cols-3 opacity-0 animate-fade-in-up animate-delay-100">
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                ),
                title: "In-Browser IDE",
                description: "Write and run Python code directly in your browser. No setup required.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                ),
                title: "Pattern-Based Learning",
                description: "Learn reusable patterns that solve entire categories of problems, not just individual questions.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
                title: "Track Your Progress",
                description: "Mark lessons complete and track your progress. Pick up right where you left off.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 opacity-0 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Choose a course to start your learning journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 opacity-0 animate-fade-in-up animate-delay-200">
            {courses.map((course) => {
              const allLessons = getAllLessons(course);
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  className="card-gradient-border group rounded-2xl bg-[var(--card)] p-8 transition-all"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl shadow-lg shadow-blue-600/20">
                    {course.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mb-5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                      </svg>
                      {course.modules.length} modules
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      {allLessons.length} lessons
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Course
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--muted)]/30">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">
                G
              </div>
              Grokking
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Built for learning. Not affiliated with Educative, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
