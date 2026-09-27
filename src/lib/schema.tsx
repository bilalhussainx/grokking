// Generates schema.org JSON-LD for courses and lessons

import { Course, Lesson, Module } from '@/data/types';

const BASE_URL = 'https://kairoslearn.com';

// Organization schema (used on every page)
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KairosLearn',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'AI college counselor for every student — intake, school list, essays, interviews, and financial aid.',
    sameAs: [],
  };
}

// WebSite schema (no site search: the course catalogue is retired)
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KairosLearn',
    url: BASE_URL,
  };
}

// Course schema (for course landing pages)
export function courseSchema(course: Course) {
  const moduleCount = course.modules.length;
  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${BASE_URL}/course/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'KairosLearn',
      url: BASE_URL,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `${moduleCount} modules, ${lessonCount} lessons`,
    },
    teaches: course.modules.map(m => m.title).join(', '),
    numberOfCredits: lessonCount,
    isAccessibleForFree: course.tier === 'free',
    inLanguage: 'en',
    ...(course.domain && { about: { '@type': 'Thing', name: course.domain.replace(/-/g, ' ') } }),
  };
}

// Lesson schema (for individual lesson pages)
export function lessonSchema(course: Course, lesson: Lesson, module: Module) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: `${lesson.title} — part of ${course.title} on KairosLearn`,
    url: `${BASE_URL}/course/${course.slug}/${lesson.slug}`,
    isPartOf: {
      '@type': 'Course',
      name: course.title,
      url: `${BASE_URL}/course/${course.slug}`,
    },
    learningResourceType: lesson.starterCode ? 'interactive exercise' : 'lesson',
    inLanguage: 'en',
    provider: { '@type': 'Organization', name: 'KairosLearn' },
  };
}

// BreadcrumbList schema
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ schema (for course pages that have checkpoint questions)
export function faqSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

// Helper to render JSON-LD as script tag
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
