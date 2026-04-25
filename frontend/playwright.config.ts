import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  /* CI上でテストが見つからないのを防ぐため、パスを正確に指定 */
  testMatch: '**/*.spec.ts',
  
  /* 失敗した時だけリトライし、証拠（動画）を残す */
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});