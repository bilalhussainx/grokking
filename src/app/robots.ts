import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/settings/', '/credentials'],
      },
    ],
    sitemap: 'https://kairoslearn.com/sitemap.xml',
  };
}
