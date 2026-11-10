import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  globalTeardown: './e2e/nettoyage.ts',
  use: { baseURL: 'http://localhost:3000', locale: 'fr-FR' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
  ],
  // Build de production : pas de compilation à la volée ni de Fast Refresh, qui rechargent la page pendant la saisie.
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 180_000,
    // L'e-mail du parent ne se construit que depuis l'origine configurée (jamais depuis les en-têtes) : le build de production en a besoin.
    env: { NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' },
  },
});
