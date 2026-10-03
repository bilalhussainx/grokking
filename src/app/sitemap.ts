import { MetadataRoute } from 'next';

const BASE_URL = 'https://kairoslearn.com';

// Public pages of the admissions product. Each has a page under src/app.
const PAGES: Array<[path: string, changeFrequency: 'weekly' | 'monthly' | 'yearly', priority: number]> = [
  ['', 'weekly', 1.0],
  ['/pricing', 'monthly', 0.8],
  ['/product/counselor', 'monthly', 0.7],
  ['/product/essays', 'monthly', 0.7],
  ['/product/schools', 'monthly', 0.7],
  ['/find-counselor', 'weekly', 0.7],
  ['/about', 'monthly', 0.6],
  ['/faq', 'monthly', 0.6],
  ['/integrity', 'yearly', 0.4],
  ['/signup', 'yearly', 0.4],
  ['/privacy', 'yearly', 0.3],
  ['/terms', 'yearly', 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(([path, changeFrequency, priority]) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
