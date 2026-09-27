import { MetadataRoute } from 'next';
import { ADMISSIONS_SUMMARY } from '@/lib/product-summary';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KairosLearn — AI College Counselor',
    short_name: 'KairosLearn',
    description: ADMISSIONS_SUMMARY,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
