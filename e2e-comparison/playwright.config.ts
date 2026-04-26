import { defineConfig } from '@playwright/test';

// Same dual-project layout as the repo `parity` suite: start Angular (4200), React
// (5173), and json-server (8000) before running. Tests assert Angular as reference
// and expect React to diverge where the audit recorded a gap.
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 12_000 },
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'angular', use: { baseURL: 'http://localhost:4200' } },
    { name: 'react', use: { baseURL: 'http://localhost:5173' } },
  ],
});
