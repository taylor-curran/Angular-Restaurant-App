import { defineConfig } from '@playwright/test';

// Parity tests run the same scenario against the Angular reference (port 4200)
// and the React port (port 5173). Both projects must already be running, along
// with the json-server backend on port 8000.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 0,
  reporter: [['list']],
  use: {
    headless: true,
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'angular',
      use: { baseURL: 'http://localhost:4200' },
      metadata: { stack: 'angular' },
    },
    {
      name: 'react',
      use: { baseURL: 'http://localhost:5173' },
      metadata: { stack: 'react' },
    },
  ],
});
