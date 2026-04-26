# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: migration-diff.spec.ts >> Angular baseline behavior checks >> menu route shows menu page title
- Location: tests/migration-diff.spec.ts:38:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Our Culinary Masterpieces' })
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByRole('heading', { name: 'Our Culinary Masterpieces' })

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "conFusion — React scaffold" [level=1] [ref=e4]
  - paragraph [ref=e5]: Bare Vite + React + TypeScript shell. Nothing has been ported yet. Pick your own router, UI kit, forms, state, and test runner.
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test.describe('Angular baseline behavior checks', () => {
  4  |   test('home page shows full hero title text', async ({ page }, testInfo) => {
  5  |     await page.goto('/home');
  6  |     await page.waitForTimeout(2500);
  7  |     await expect(
  8  |       page.getByRole('heading', { name: 'Welcome to Culinary Excellence' }),
  9  |     ).toBeVisible();
  10 |     await page.screenshot({
  11 |       path: `screenshots/${testInfo.project.name}-home-hero-title.png`,
  12 |       fullPage: true,
  13 |     });
  14 |   });
  15 | 
  16 |   test('home page shows Featured Highlights section title', async ({
  17 |     page,
  18 |   }, testInfo) => {
  19 |     await page.goto('/home');
  20 |     await page.waitForTimeout(2500);
  21 |     await expect(page.getByRole('heading', { name: 'Featured Highlights' })).toBeVisible();
  22 |     await page.screenshot({
  23 |       path: `screenshots/${testInfo.project.name}-home-featured-highlights.png`,
  24 |       fullPage: true,
  25 |     });
  26 |   });
  27 | 
  28 |   test('header contains About navigation link', async ({ page }, testInfo) => {
  29 |     await page.goto('/home');
  30 |     await page.waitForTimeout(1000);
  31 |     await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
  32 |     await page.screenshot({
  33 |       path: `screenshots/${testInfo.project.name}-header-about-nav.png`,
  34 |       fullPage: true,
  35 |     });
  36 |   });
  37 | 
  38 |   test('menu route shows menu page title', async ({ page }, testInfo) => {
  39 |     await page.goto('/menu');
  40 |     await page.waitForTimeout(2500);
  41 |     await expect(
  42 |       page.getByRole('heading', { name: 'Our Culinary Masterpieces' }),
> 43 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  44 |     await page.screenshot({
  45 |       path: `screenshots/${testInfo.project.name}-menu-page-title.png`,
  46 |       fullPage: true,
  47 |     });
  48 |   });
  49 | });
  50 | 
```