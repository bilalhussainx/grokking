import { Metadata } from 'next';
import Link from 'next/link';
import { courses } from '@/data';
import { getAllLessons } from '@/data/types';
import { getAllLanguageCourses } from '@/data/languages';
import { JsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'All Courses — Free & Premium Online Learning',
  description:
    'Browse 60+ courses in Computer Science, Philosophy, Religious Studies, Finance, Health & Wellness, and Political Strategy. AI-powered coaching, interactive exercises, and voice tutors.',
  keywords: [
    'online courses',
    'learn coding free',
    'philosophy courses online',
    'Islamic studies course',
    'learn investing',
    'meditation course',
    'AI tutor',
    'coding interview prep',
    'best online courses',
    'learn Python online free',
    'system design course',
    'learn Buddhism online',
    'Christian theology course',
    'personal finance course',
    'cybersecurity course online',
    'machine learning course',
    'geopolitics course',
    'leadership course',
    'mental health course',
    'free online courses with certificates',
  ],
  openGraph: {
    title: 'Kairos.ai Courses — Learn Anything with AI',
    description:
      'Browse 60+ courses across 7 domains with AI voice coaching.',
    url: 'https://kairos.ai/courses',
  },
  alternates: { canonical: 'https://kairos.ai/courses' },
};

const DOMAIN_ORDER = [
  'computer-science',
  'religious-studies',
  'philosophy',
  'finance-business',
  'health-wellness',
  'political-strategy',
  'interview-prep',
] as const;

const DOMAIN_LABELS: Record<string, string> = {
  'computer-science': 'Computer Science & Engineering',
  'religious-studies': 'Religious Studies',
  'philosophy': 'Philosophy',
  'finance-business': 'Finance & Business',
  'health-wellness': 'Health & Wellness',
  'political-strategy': 'Political Strategy',
  'interview-prep': 'Interview Preparation',
};

function courseListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses.slice(0, 50).map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `https://kairos.ai/course/${course.slug}`,
        provider: { '@type': 'Organization', name: 'Kairos.ai' },
        isAccessibleForFree: course.tier === 'free',
      },
    })),
  };
}

export default function CoursesPage() {
  const domainGroups: Record<string, typeof courses> = {};
  for (const c of courses) {
    const domain = c.domain || 'general';
    if (!domainGroups[domain]) domainGroups[domain] = [];
    domainGroups[domain].push(c);
  }

  const totalLessons = courses.reduce(
    (sum, c) => sum + getAllLessons(c).length,
    0
  );
  const freeCourses = courses.filter((c) => c.tier === 'free').length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={courseListSchema()} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* GEO-optimized intro: first 200 words as a direct answer */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            All Courses on Kairos.ai — Free & Premium Online Learning
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            Kairos.ai offers {courses.length}+ interactive online courses
            spanning Computer Science, Language Learning, Religious Studies, Philosophy, Finance &
            Business, Health & Wellness, and Political Strategy. With{' '}
            {totalLessons}+ lessons across all courses, learners can study
            everything from Python programming and system design to Islamic
            studies, Stoic philosophy, meditation, and investing.{' '}
            {freeCourses} courses are completely free. Every course includes an
            AI voice coach that provides real-time explanations, hints on
            exercises, and personalized feedback. Courses are structured into
            modules with checkpoint quizzes, coding exercises, and capstone
            projects. Whether you are preparing for a coding interview,
            exploring world religions, building financial literacy, or
            developing leadership skills, Kairos.ai provides structured,
            evidence-based curricula designed to take you from beginner to
            advanced.
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            Browse the full catalog below, organized by domain. Each course
            page includes detailed module breakdowns, lesson previews, and the
            option to start learning immediately with AI coaching.
          </p>
        </header>

        {/* Course sections grouped by domain */}
        {DOMAIN_ORDER.map((domain) => {
          const domainCourses = domainGroups[domain];
          if (!domainCourses || domainCourses.length === 0) return null;
          const label = DOMAIN_LABELS[domain] || domain;

          return (
            <section key={domain} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-3">
                {label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainCourses.map((course) => {
                  const lessonCount = getAllLessons(course).length;
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      className="group block"
                    >
                      <article className="rounded-2xl border border-slate-700/30 bg-slate-800/30 p-5 hover:bg-slate-800/50 hover:border-blue-500/25 transition-all h-full">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl" role="img" aria-label={course.title}>
                            {course.icon}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              course.tier === 'pro'
                                ? 'bg-violet-500/10 text-violet-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {course.tier === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{course.modules.length} modules</span>
                          <span>{lessonCount} lessons</span>
                          {course.level && (
                            <span className="capitalize">{course.level}</span>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Language Learning Courses */}
        {(() => {
          const langCourses = getAllLanguageCourses();
          if (langCourses.length === 0) return null;

          const FLAGS: Record<string, string> = {
            es: "\u{1F1EA}\u{1F1F8}", fr: "\u{1F1EB}\u{1F1F7}", hi: "\u{1F1EE}\u{1F1F3}",
            zh: "\u{1F1E8}\u{1F1F3}", en: "\u{1F1EC}\u{1F1E7}", ur: "\u{1F1F5}\u{1F1F0}",
          };

          return (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-3">
                Language Learning
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {langCourses.map((course) => {
                  const lessonCount = course.modules.reduce(
                    (sum, m) => sum + m.lessons.length, 0
                  );
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      className="group block"
                    >
                      <article className="rounded-2xl border border-emerald-500/20 bg-slate-800/30 p-5 hover:bg-slate-800/50 hover:border-emerald-500/40 transition-all h-full">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">
                            {FLAGS[course.language] || course.icon || "\u{1F310}"}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                            {course.proficiencyLevel}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{course.modules.length} modules</span>
                          <span>{lessonCount} lessons</span>
                          <span>{course.estimatedHours}h</span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Catch any courses without a recognized domain */}
        {(() => {
          const recognized = new Set(DOMAIN_ORDER as unknown as string[]);
          const otherCourses = courses.filter(
            (c) => !recognized.has(c.domain || '')
          );
          if (otherCourses.length === 0) return null;
          return (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-3">
                More Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherCourses.map((course) => {
                  const lessonCount = getAllLessons(course).length;
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      className="group block"
                    >
                      <article className="rounded-2xl border border-slate-700/30 bg-slate-800/30 p-5 hover:bg-slate-800/50 hover:border-blue-500/25 transition-all h-full">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{course.icon}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              course.tier === 'pro'
                                ? 'bg-violet-500/10 text-violet-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {course.tier === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{course.modules.length} modules</span>
                          <span>{lessonCount} lessons</span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}
