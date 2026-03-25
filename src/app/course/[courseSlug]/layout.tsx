import { Metadata } from 'next';
import { courses } from '@/data';
import { getLanguageCourse } from '@/data/languages';
import { JsonLd, breadcrumbSchema, courseSchema } from '@/lib/schema';

type Props = { params: Promise<{ courseSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = courses.find(c => c.slug === courseSlug);

  // Check language courses if not found in hardcoded courses
  if (!course) {
    const langCourse = getLanguageCourse(courseSlug);
    if (langCourse) {
      return {
        title: langCourse.title,
        description: langCourse.description,
      };
    }
    return { title: 'Course | Kairos.ai' };
  }

  const moduleCount = course.modules.length;
  const lessonCount = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const domainLabel = course.domain?.replace(/-/g, ' ') || 'Education';

  return {
    title: course.title,
    description: `${course.description} ${moduleCount} modules, ${lessonCount} lessons with AI coaching.`,
    keywords: [
      course.title, domainLabel, 'online course', 'AI coaching',
      ...course.modules.map(m => m.title),
    ],
    openGraph: {
      title: `${course.title} | Kairos.ai`,
      description: course.description,
      url: `https://kairos.ai/course/${course.slug}`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} | Kairos.ai`,
      description: course.description,
    },
    alternates: { canonical: `https://kairos.ai/course/${course.slug}` },
  };
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = courses.find((c) => c.slug === courseSlug);

  if (!course) {
    return <>{children}</>;
  }

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://kairos.ai' },
    { name: 'Courses', url: 'https://kairos.ai/courses' },
    { name: course.title, url: `https://kairos.ai/course/${course.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={courseSchema(course)} />
      {children}
    </>
  );
}
