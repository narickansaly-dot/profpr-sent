import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'App lycée',
    short_name: 'App lycée',
    description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
    lang: 'fr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f5ff',
    theme_color: '#4f46e5',
    icons: [
      { src: '/icones/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icones/512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icones/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
