import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:3000', locale: 'fr-FR' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true },
});
