import { MetadataRoute } from 'next';
import { ADMISSIONS_SUMMARY } from '@/lib/product-summary';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KairosLearn — AI College Counselor',
    short_name: 'KairosLearn',
    description: ADMISSIONS_SUMMARY,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF7EE',
    theme_color: '#FFF7EE',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icons/kairos-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/kairos-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/kairos-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
