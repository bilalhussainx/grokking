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

// Featured & fully-built courses — surfaced at the top so learners aren't overwhelmed
// by the 60+ catalog. Order matters: this is the display order on the catalog page.
const RECOMMENDED_SLUGS = [
  'coding-interview',
  'python-fundamentals',
  'system-design',
  'ai-ml-fundamentals',
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
  const recommendedSet = new Set<string>(RECOMMENDED_SLUGS);
  const recommendedCourses = RECOMMENDED_SLUGS
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const domainGroups: Record<string, typeof courses> = {};
  for (const c of courses) {
    if (recommendedSet.has(c.slug)) continue; // shown in the Recommended section instead
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
        {/* Clean header with stat badges */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Course Catalog
          </h1>
          <p className="text-white/50 text-base max-w-xl mb-6">
            {courses.length}+ courses with AI voice coaching. Browse by domain or start learning immediately.
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
              {courses.length}+ courses
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
              {totalLessons}+ lessons
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              {freeCourses} free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              AI voice coaching
            </span>
          </div>

          {/* SEO text — visually hidden but crawlable */}
          <p className="sr-only">
            Kairos.ai offers {courses.length}+ interactive online courses spanning Computer Science, Language Learning, Religious Studies, Philosophy, Finance & Business, Health & Wellness, and Political Strategy. With {totalLessons}+ lessons, learners can study everything from Python and system design to Islamic studies, Stoic philosophy, meditation, and investing. {freeCourses} courses are completely free with AI voice coaching.
          </p>
        </header>

        {/* Recommended — surfaces the flagship courses so learners aren't overwhelmed */}
        {recommendedCourses.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-white">Recommended for You</h2>
              <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                Start here
              </span>
            </div>
            <p className="text-white/50 text-sm mb-5 max-w-2xl">
              Four flagship courses with full interactive lessons, AI voice coaching, and hands-on exercises. New to the platform? Pick one and dive in.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {recommendedCourses.map((course) => {
                const lessonCount = getAllLessons(course).length;
                return (
                  <Link
                    key={course.id}
                    href={`/course/${course.slug}`}
                    className="group block"
                  >
                    <article className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.04] to-violet-500/[0.04] p-5 hover:border-amber-500/40 hover:from-amber-500/[0.08] hover:to-violet-500/[0.08] transition-all duration-200 h-full hover:-translate-y-0.5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl" role="img" aria-label={course.title}>
                          {course.icon}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            ★ Recommended
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              course.tier === 'pro'
                                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {course.tier === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-base mb-1.5 group-hover:text-amber-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-white/35 font-medium">
                        <span>{course.modules.length} modules</span>
                        <span className="text-white/10">&middot;</span>
                        <span>{lessonCount} lessons</span>
                        {course.level && (
                          <>
                            <span className="text-white/10">&middot;</span>
                            <span className="capitalize">{course.level}</span>
                          </>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Course sections grouped by domain */}
        {DOMAIN_ORDER.map((domain) => {
          const domainCourses = domainGroups[domain];
          if (!domainCourses || domainCourses.length === 0) return null;
          const label = DOMAIN_LABELS[domain] || domain;

          return (
            <section key={domain} className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold text-white">
                  {label}
                </h2>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                  {domainCourses.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainCourses.map((course) => {
                  const lessonCount = getAllLessons(course).length;
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      className="group block"
                    >
                      <article className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 h-full hover:-translate-y-0.5">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl" role="img" aria-label={course.title}>
                            {course.icon}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              course.tier === 'pro'
                                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {course.tier === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-[15px] mb-1.5 group-hover:text-violet-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-white/25 font-medium">
                          <span>{course.modules.length} modules</span>
                          <span className="text-white/10">&middot;</span>
                          <span>{lessonCount} lessons</span>
                          {course.level && (
                            <>
                              <span className="text-white/10">&middot;</span>
                              <span className="capitalize">{course.level}</span>
                            </>
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
