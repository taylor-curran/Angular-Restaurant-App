import { defineConfig, devices } from '@playwright/test';

const app = process.env.APP ?? 'angular';
const isReact = app === 'react';

const baseURL = isReact
  ? process.env.REACT_BASE_URL ?? 'http://127.0.0.1:5173'
  : process.env.ANGULAR_BASE_URL ?? 'http://127.0.0.1:4200';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: isReact ? 'react' : 'angular',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  expect: {
    timeout: 15_000
  }
});
