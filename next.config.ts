import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le JSON d'un cours complet pèse environ 250 Ko : la limite par défaut (1 Mo) est trop juste pour l'import depuis l'interface.
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
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
