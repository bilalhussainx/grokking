import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Samsara.ai — Learn Anything with AI',
    short_name: 'Samsara.ai',
    description: 'AI-powered learning platform with voice coaching. Master coding, philosophy, religion, finance, and more with personalized AI tutors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    icons: [],
  };
}
