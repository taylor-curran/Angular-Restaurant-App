import { test, expect } from '@playwright/test';

// Waits for json-server + client hydration (Angular 6 is slower than Vite).
async function gotoReady(page: import('@playwright/test').Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
}

test.describe('Migration audit: Angular reference vs React (expect React failures in CI)', () => {
  // --- Home ---
  test('home_guest_testimonial_sarah_johnson', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByText('Sarah Johnson').first()).toBeVisible();
  });

  test('home_what_our_guests_say_section', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByRole('heading', { name: /What Our Guests Say/i })).toBeVisible();
  });

  test('home_excellence_in_numbers_section', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByRole('heading', { name: /Excellence in Numbers/i })).toBeVisible();
  });

  test('home_hero_stats_50k_happy_guests', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByText('50,000+').first()).toBeVisible();
  });

  test('home_philosophy_feature_tags', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByText('Local Sourcing').first()).toBeVisible();
  });

  test('home_cta_open_7_days', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page.getByText(/Open 7 Days/i).first()).toBeVisible();
  });

  // --- Menu: legacy Angular template does not render dish grid; migration should not show dishes for strict UI parity
  test('menu_no_dish_name_in_grid_strict_parity_uthappizza', async ({ page }) => {
    await gotoReady(page, '/menu');
    await expect(page.getByText('UTHAPPIZZA', { exact: true })).toHaveCount(0);
  });

  test('menu_filter_by_category_section', async ({ page }) => {
    await gotoReady(page, '/menu');
    await expect(page.getByRole('heading', { name: /Filter by Category/i })).toBeVisible();
  });

  test('menu_stats_available_dishes_label', async ({ page }) => {
    await gotoReady(page, '/menu');
    await expect(page.getByText('Available Dishes').first()).toBeVisible();
  });

  // --- About ---
  test('about_scroll_discover_our_legacy', async ({ page }) => {
    await gotoReady(page, '/about');
    await expect(page.getByText('Discover Our Legacy').first()).toBeVisible();
  });

  test('about_excellence_in_numbers_michelin_stars', async ({ page }) => {
    await gotoReady(page, '/about');
    await expect(page.getByText('Michelin Stars').first()).toBeVisible();
  });

  test('about_philosophy_fresh_ingredients', async ({ page }) => {
    await gotoReady(page, '/about');
    await expect(page.getByRole('heading', { name: 'Fresh Ingredients' })).toBeVisible();
  });

  test('about_philosophy_feature_tag_local_sourcing', async ({ page }) => {
    await gotoReady(page, '/about');
    await expect(page.getByText('Local Sourcing', { exact: true }).first()).toBeVisible();
  });

  // --- Contact: section copy ---
  test('contact_hero_subtitle_choose_method', async ({ page }) => {
    await gotoReady(page, '/contactus');
    await expect(
      page.getByText(/Choose the method that works best for you/i).first(),
    ).toBeVisible();
  });

  test('contact_card_badge_visit_us', async ({ page }) => {
    await gotoReady(page, '/contactus');
    await expect(page.getByText('Visit Us').first()).toBeVisible();
  });

  // --- Contact: feedback form placeholder (Angular) ---
  test('contact_feedback_textarea_placeholder', async ({ page }) => {
    await gotoReady(page, '/contactus');
    const ph = page.getByPlaceholder(
      /We'd love to hear about your dining experience/i,
    );
    await expect(ph.first()).toBeVisible();
  });

  // --- Header: mobile menu hamburger (Angular template only) ---
  test('header_mobile_hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await gotoReady(page, '/home');
    await expect(page.locator('button.mobile-menu-toggle')).toBeVisible();
  });

  // --- Header: reservation notification badge (Angular) ---
  test('header_reservation_notification_badge', async ({ page }) => {
    await gotoReady(page, '/home');
    const badge = page.locator('span.notification-badge');
    await expect(badge).toBeVisible();
  });

  // --- Header: search close control when search open (Angular) ---
  test('header_search_close_x_when_search_open', async ({ page }) => {
    await gotoReady(page, '/home');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('button.close-search, .close-search').first()).toBeVisible();
  });

  // --- Dish detail: legacy Angular shows price without a leading $ in the meta row ---
  test('dishdetail_price_plain_numeric_in_header', async ({ page }) => {
    await gotoReady(page, '/dishdetail/0');
    await expect(page.getByText(/^4\.99$/, { exact: true }).first()).toBeVisible();
  });
});

test.describe('Shared behavior (should pass on both) — no CSV row', () => {
  test('document_title', async ({ page }) => {
    await gotoReady(page, '/home');
    await expect(page).toHaveTitle(/ConFusion/i);
  });
});
