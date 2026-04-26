import { expect, test } from '@playwright/test';

test.describe('Angular baseline behavior checks', () => {
  test('home page shows full hero title text', async ({ page }, testInfo) => {
    await page.goto('/home');
    await page.waitForTimeout(2500);
    await expect(
      page.getByRole('heading', { name: 'Welcome to Culinary Excellence' }),
    ).toBeVisible();
    await page.screenshot({
      path: `screenshots/${testInfo.project.name}-home-hero-title.png`,
      fullPage: true,
    });
  });

  test('home page shows Featured Highlights section title', async ({
    page,
  }, testInfo) => {
    await page.goto('/home');
    await page.waitForTimeout(2500);
    await expect(page.getByRole('heading', { name: 'Featured Highlights' })).toBeVisible();
    await page.screenshot({
      path: `screenshots/${testInfo.project.name}-home-featured-highlights.png`,
      fullPage: true,
    });
  });

  test('header contains About navigation link', async ({ page }, testInfo) => {
    await page.goto('/home');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
    await page.screenshot({
      path: `screenshots/${testInfo.project.name}-header-about-nav.png`,
      fullPage: true,
    });
  });

  test('menu route shows menu page title', async ({ page }, testInfo) => {
    await page.goto('/menu');
    await page.waitForTimeout(2500);
    await expect(
      page.getByRole('heading', { name: 'Our Culinary Masterpieces' }),
    ).toBeVisible();
    await page.screenshot({
      path: `screenshots/${testInfo.project.name}-menu-page-title.png`,
      fullPage: true,
    });
  });
});
