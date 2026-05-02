import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KairosLearn — Learn Anything with AI',
    short_name: 'KairosLearn',
    description: 'AI-powered learning platform with voice coaching. Master coding, philosophy, religion, finance, and more with personalized AI tutors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
