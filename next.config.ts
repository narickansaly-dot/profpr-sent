import type { NextConfig } from "next";
import { ENTETES_SECURITE } from "./src/lib/securite/csp";

// Version du déploiement : nomme les caches du service worker (un nouveau déploiement remplace les anciens).
// Fixée une seule fois : tous les processus du build partagent la même valeur.
// Format accepté par le service worker : minuscules et chiffres, 16 caractères au plus.
const versionBrute = process.env.NEXT_PUBLIC_VERSION_APP || (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 8);
process.env.NEXT_PUBLIC_VERSION_APP = versionBrute.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) || Date.now().toString(36);

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_VERSION_APP: process.env.NEXT_PUBLIC_VERSION_APP },
  // Le JSON d'un cours complet pèse environ 250 Ko : la limite par défaut (1 Mo) est trop juste pour l'import depuis l'interface.
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...ENTETES_SECURITE,
          ...((process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://')
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }] : []),
        ],
      },
      {
        // Le jeton du parent est dans l'URL : il ne doit fuiter ni par Referer ni par un cache.
        source: '/accord-parental/:jeton*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
