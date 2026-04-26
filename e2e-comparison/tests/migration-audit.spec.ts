import { test, expect } from '@playwright/test';
import { installApiMock } from '../fixtures/api-mock-handlers';

const isReact = process.env.APP === 'react';

test.beforeEach(async ({ page }) => {
  if (!isReact) {
    await installApiMock(page);
  }
});

test.describe('Document title and shell', () => {
  test('home: document title contains ConFusion (Angular app)', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/ConFusion/);
  });

  test('header shows brand L’Artisan Culinaire', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText("L'Artisan Culinaire", { exact: true }).first()).toBeVisible();
  });
});

test.describe('Global navigation (all pages)', () => {
  test('header: primary link to Home is visible and labeled Home', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
  });

  test('header: link to About uses route /about', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="/about"]').first()).toBeVisible();
  });

  test('header: link to Menu uses route /menu', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="/menu"]').first()).toBeVisible();
  });

  test('header: link to Contact uses route /contactus', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="/contactus"]').first()).toBeVisible();
  });

  test('search overlay: field label for menu search is present after opening search', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Search our menu...')).toBeVisible();
  });

  test('footer: quick link label About Us (footer wording)', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('About Us', { exact: true })).toBeVisible();
  });

  test('footer: brand tagline under restaurant name', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByText('Where culinary artistry meets timeless elegance', { exact: true })
    ).toBeVisible();
  });
});

test.describe('Page: /home', () => {
  test('hero heading: Welcome to Culinary Excellence', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Welcome to Culinary Excellence' })).toBeVisible();
  });

  test('hero CTA: Explore Our Menu (Material button)', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /explore our menu/i })).toBeVisible();
  });

  test('content: Michelin Star Experience hero badge', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Michelin Star Experience', { exact: true })).toBeVisible();
  });

  test('content: Our Philosophy section title', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Our Philosophy' })).toBeVisible();
  });

  test('content: What Our Guests Say (testimonials block)', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'What Our Guests Say' })).toBeVisible();
  });

  test('content: stat grid includes 25+ Years of Excellence in hero', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('25+', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Years of Excellence', { exact: true }).first()).toBeVisible();
  });
});

test.describe('Page: /menu', () => {
  test('section title: Our Culinary Masterpieces', async ({ page }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Our Culinary Masterpieces' })).toBeVisible();
  });

  test('filter UI: Filter by Category heading', async ({ page }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Filter by Category' })).toBeVisible();
  });

  test('CTA: Ready to Experience Our Menu block at page bottom', async ({ page }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Ready to Experience Our Menu?' })).toBeVisible();
  });

  test('CTA: Contact Us button in menu footer strip', async ({ page }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /contact us/i }).first()).toBeVisible();
  });
});

test.describe('Page: /dishdetail/0', () => {
  test('dish title: UTHAPPIZZA in dish header', async ({ page }) => {
    await page.goto('/dishdetail/0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'UTHAPPIZZA' })).toBeVisible();
  });

  test('content: About This Dish section (section heading h3)', async ({ page }) => {
    await page.goto('/dishdetail/0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'About This Dish' })).toBeVisible();
  });

  test('content: Customer Reviews with John Lemon', async ({ page }) => {
    await page.goto('/dishdetail/0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Customer Reviews/)).toBeVisible();
    await expect(page.getByText('John Lemon', { exact: true })).toBeVisible();
  });

  test('navigation: Back to Menu button', async ({ page }) => {
    await page.goto('/dishdetail/0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /back to menu/i })).toBeVisible();
  });

  test('form: Share Your Experience review form section', async ({ page }) => {
    await page.goto('/dishdetail/0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Share Your Experience', { exact: false })).toBeVisible();
  });
});

test.describe('Page: /about', () => {
  test('hero: Our Story and A Culinary Journey', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Our Story', { exact: true })).toBeVisible();
    await expect(page.getByText('A Culinary Journey', { exact: true })).toBeVisible();
  });

  test('content: Our Heritage (history section title)', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Our Heritage' })).toBeVisible();
  });

  test('content: Meet Our Team and Culinary Leadership', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Meet Our Team', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Culinary Leadership' })).toBeVisible();
  });

  test('CTA: View Our Menu button on about page', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /view our menu/i })).toBeVisible();
  });
});

test.describe('Page: /contactus', () => {
  test('hero: Let us start a conversation (h1 text)', async ({ page }) => {
    await page.goto('/contactus', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: "Let's Start a Conversation" })
    ).toBeVisible();
  });

  test('form: First Name is a Material label', async ({ page }) => {
    await page.goto('/contactus', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('First Name', { exact: true }).first()).toBeVisible();
  });

  test('form: slide toggle copy for follow-up permission', async ({ page }) => {
    await page.goto('/contactus', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByText('May we contact you for follow-up?', { exact: true })
    ).toBeVisible();
  });

  test('form: primary submit is Send Feedback', async ({ page }) => {
    await page.goto('/contactus', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /send feedback/i })).toBeVisible();
  });
});
