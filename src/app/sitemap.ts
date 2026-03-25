import { MetadataRoute } from 'next';
import { courses } from '@/data';
import { getAllLessons } from '@/data/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kairos.ai';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/talk`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  // Course pages
  const coursePages = courses.map(course => ({
    url: `${baseUrl}/course/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: course.featured ? 0.9 : 0.7,
  }));

  // Lesson pages (every individual lesson is indexable)
  const lessonPages = courses.flatMap(course =>
    getAllLessons(course).map(lesson => ({
      url: `${baseUrl}/course/${course.slug}/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // Exercise pages
  const exercisePages = courses.flatMap(course =>
    getAllLessons(course)
      .filter(lesson => lesson.starterCode && lesson.solutionCode)
      .map(lesson => ({
        url: `${baseUrl}/course/${course.slug}/${lesson.slug}/exercise`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
  );

  return [...staticPages, ...coursePages, ...lessonPages, ...exercisePages];
}
