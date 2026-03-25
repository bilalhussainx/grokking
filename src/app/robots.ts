import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/settings/', '/auth/'],
      },
    ],
    sitemap: 'https://kairos.ai/sitemap.xml',
  };
}
