import { test, expect } from '@playwright/test';
import { installApiMock } from '../routes';

test.beforeEach(async ({ page }) => {
  await installApiMock(page);
});

async function go(page: import('@playwright/test').Page, projectName: string, path: string) {
  const port = projectName === 'angular' ? 4200 : 5173;
  if (projectName === 'react') {
    await page.goto(`http://127.0.0.1:${port}${path}`);
    await page.addStyleTag({
      content: `.mobile-menu:not(.active) { display: none !important; pointer-events: none !important; }`,
    });
    if (path.includes('home') || path === '/' || path === '') {
      await page.getByRole('heading', { name: /Welcome to Culinary Excellence/i }).waitFor({ timeout: 20000 });
      // Home loads featured block async; wait so parity assertions see cards or loading cleared
      await page.getByText('Featured Highlights', { exact: false }).or(page.getByText(/Uthappizza/i)).first()
        .waitFor({ state: 'visible', timeout: 20000 });
    } else if (path.includes('menu')) {
      await page.getByRole('heading', { name: /Our Culinary Masterpieces/i }).waitFor({ timeout: 20000 });
    } else if (path.includes('dishdetail')) {
      await page.getByRole('heading', { name: /uthappizza/i }).waitFor({ timeout: 20000 });
    } else if (path.includes('about')) {
      await page.getByRole('heading', { name: /Our Story/i }).waitFor({ timeout: 20000 });
    } else if (path.includes('contactus')) {
      await page.getByRole('heading', { name: /We Value Your Opinion/i }).waitFor({ timeout: 20000 });
    }
    await page.waitForTimeout(400);
  } else {
    await page.goto(`http://127.0.0.1:${port}${path}`);
    await page.waitForTimeout(2500);
  }
}

/* --- Document title --- */
test('document title: Angular is ConFusion; React harness is distinct from production HTML title', async ({
  page,
}, testInfo) => {
  const port = testInfo.project.name === 'angular' ? 4200 : 5173;
  await page.goto(`http://127.0.0.1:${port}/home/`);
  if (testInfo.project.name === 'react') {
    await page.addStyleTag({
      content: `.mobile-menu:not(.active) { display: none !important; pointer-events: none !important; }`,
    });
  }
  if (testInfo.project.name === 'angular') {
    await expect(page).toHaveTitle(/ConFusion/);
  } else {
    await expect(page).toHaveTitle(/conFusion E2E harness/i);
  }
});

/* --- Home page --- */
test('home: hero description full sentence about master chefs (Angular)', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage shortens hero description');
  await go(page, testInfo.project.name, '/home/');
  await expect(
    page.getByText(/master chefs create unforgettable moments through the art of fine dining/i),
  ).toBeVisible();
});

test('home: featured section badge Signature Offerings', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits section badge copy');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('Signature Offerings').first()).toBeVisible();
});

test('home: featured section subtitle', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits section description');
  await go(page, testInfo.project.name, '/home/');
  await expect(
    page.getByText(/Discover our signature offerings and culinary masterpieces that define our legacy/i),
  ).toBeVisible();
});

test('home: dish card uses live label from API (Hot) not static Chef’s Special', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React hardcodes featured dish badge');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('Hot', { exact: true }).first()).toBeVisible();
});

test('home: dish card shows 5.0 rating and Reviews copy', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React Home featured dish omits rating row');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('5.0').first()).toBeVisible();
  await expect(page.getByText(/Reviews/i).first()).toBeVisible();
});

test('home: promotion card CTA Book Now in overlay', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React promotion card has no Book Now overlay');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('Book Now').first()).toBeVisible();
});

test('home: leader card CTA Meet Chef in overlay', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React leader card has no Meet Chef overlay');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('Meet Chef').first()).toBeVisible();
});

test('home: hero stats 25+ Years of Excellence', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits hero stat row');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByText('25+').first()).toBeVisible();
  await expect(page.getByText('Years of Excellence').first()).toBeVisible();
});

test('home: philosophy section present', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits philosophy section');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByRole('heading', { name: /Our Philosophy/i })).toBeVisible();
  await expect(page.getByText('Seasonal Excellence').first()).toBeVisible();
});

test('home: testimonials section present', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits testimonials');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByRole('heading', { name: /What Our Guests Say/i })).toBeVisible();
  await expect(page.getByText('Sarah Johnson').first()).toBeVisible();
});

test('home: excellence in numbers six stat cards', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits Excellence in Numbers');
  await go(page, testInfo.project.name, '/home/');
  await expect(page.getByRole('heading', { name: /Excellence in Numbers/i })).toBeVisible();
  await expect(page.getByText('50,000+').first()).toBeVisible();
  await expect(page.getByText('Culinary Awards').first()).toBeVisible();
});

test('home: CTA section Ready for an Unforgettable Experience', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React HomePage omits CTA block');
  await go(page, testInfo.project.name, '/home/');
  await expect(
    page.getByRole('heading', { name: /Ready for an Unforgettable Experience/i }),
  ).toBeVisible();
  await expect(page.getByText('Open 7 Days').first()).toBeVisible();
});

/* --- Menu / dish navigation chrome --- */
test('dish detail: previous control is icon FAB with tooltip (Angular)', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React uses text links for prev/next');
  await go(page, testInfo.project.name, '/dishdetail/0/');
  await expect(
    page.locator('button[matTooltip="Previous Dish"], button[matTooltip="Previous dish"]'),
  ).toBeVisible();
});

/* --- About page --- */
test('about: hero stat pills 13+ Years', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits hero stat pills');
  await go(page, testInfo.project.name, '/about/');
  await expect(page.getByText('13+').first()).toBeVisible();
  await expect(page.getByText('15K+').first()).toBeVisible();
});

test('about: Our Heritage history section with 2010 timeline', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits heritage timeline');
  await go(page, testInfo.project.name, '/about/');
  await expect(page.getByRole('heading', { name: /Our Heritage/i })).toBeVisible();
  await expect(page.getByText('2010 - The Beginning').first()).toBeVisible();
});

test('about: stats grid shows 2010 in Established column', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits stats card in heritage row');
  await go(page, testInfo.project.name, '/about/');
  const establishedRow = page.locator('.luxury-stats-card .stat-item').filter({
    has: page.locator('.stat-label:has-text("Established")'),
  });
  await expect(establishedRow.locator('.stat-number')).toHaveText('2010');
});

test('about: quote section Chef Pierre Dubois', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits quote block');
  await go(page, testInfo.project.name, '/about/');
  await expect(page.getByText('Chef Pierre Dubois').first()).toBeVisible();
});

test('about: philosophy three pillars Fresh Ingredients', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits philosophy copy block');
  await go(page, testInfo.project.name, '/about/');
  await expect(page.getByRole('heading', { name: /Our Philosophy/i })).toBeVisible();
  await expect(page.getByText('Fresh Ingredients').first()).toBeVisible();
});

test('about: CTA section Experience Culinary Excellence', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React AboutPage omits CTA section');
  await go(page, testInfo.project.name, '/about/');
  await expect(
    page.getByRole('heading', { name: /Experience Culinary Excellence/i }),
  ).toBeVisible();
});

/* --- Contact page --- */
test('contact: hero row stats 24/7 Support and < 2h Response', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React ContactPage omits hero stat row');
  await go(page, testInfo.project.name, '/contactus/');
  await expect(page.getByText('24/7').first()).toBeVisible();
  await expect(page.getByText(/< 2h/i).first()).toBeVisible();
});

test('contact: Get In Touch cards Our Location and Phone +852', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React ContactPage omits contact info cards');
  await go(page, testInfo.project.name, '/contactus/');
  await expect(page.getByText('Our Location').first()).toBeVisible();
  await expect(page.getByText(/\+852 1234 5678/).first()).toBeVisible();
});

test('contact: business hours list Monday 11:00 AM', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React ContactPage omits hours card');
  await go(page, testInfo.project.name, '/contactus/');
  await expect(page.getByText(/Monday - Friday/i).first()).toBeVisible();
  await expect(page.getByText(/11:00 AM/).first()).toBeVisible();
});

test('contact: form section We Value description paragraph', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React ContactPage omits section description');
  await go(page, testInfo.project.name, '/contactus/');
  await expect(
    page.getByText(/Help us improve by sharing your dining experience/i),
  ).toBeVisible();
});

test('contact: progress steps Personal Info / Contact Details / Your Message', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React ContactPage omits progress indicator');
  await go(page, testInfo.project.name, '/contactus/');
  await expect(page.getByText('Personal Info').first()).toBeVisible();
  await expect(page.getByText('Contact Details').first()).toBeVisible();
  await expect(page.getByText('Your Message').first()).toBeVisible();
});

/* --- Header --- */
test('header: mobile menu Make Reservation and Call Us buttons', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React mobile menu omits CTA row');
  await go(page, testInfo.project.name, '/home/');
  await page.setViewportSize({ width: 480, height: 800 });
  await page.locator('button.mobile-menu-toggle').click();
  await expect(page.getByText('Make Reservation').first()).toBeVisible();
  await expect(page.getByText('Call Us').first()).toBeVisible();
});

test('header: search uses Material form field with mat-suffix search icon', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React search is plain input without mat-form-field');
  await go(page, testInfo.project.name, '/home/');
  await page.getByRole('button', { name: 'Search' }).first().click();
  await expect(page.locator('mat-form-field.search-field')).toBeVisible();
  await expect(page.locator('mat-icon.mat-suffix, mat-icon[matSuffix]').first()).toBeVisible();
});

test('dish detail: Special Features block when dish has label', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React detail page omits Special Features / label section');
  await go(page, testInfo.project.name, '/dishdetail/0/');
  await expect(page.getByRole('heading', { name: /Special Features/i })).toBeVisible();
  await expect(page.getByText('Hot', { exact: true }).first()).toBeVisible();
});

/* --- Dish detail: structure --- */
test('dish detail: price shown in header and About This Dish section', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React dish detail omits price line and section headings');
  await go(page, testInfo.project.name, '/dishdetail/0/');
  await expect(page.getByText('4.99', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /About This Dish/i })).toBeVisible();
});

test('dish detail: comment list shows Material star icons per review', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React review list uses text rating; Angular uses mat-icon stars');
  await go(page, testInfo.project.name, '/dishdetail/0/');
  const matStars = page.locator('.comment-item .stars mat-icon, .comment-rating mat-icon');
  await expect(matStars.first()).toBeVisible();
});

test('dish detail: preview shows author and star icons', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React preview is minimal');
  await go(page, testInfo.project.name, '/dishdetail/0/');
  await page.getByLabel(/your name/i).fill('Test User');
  await page.getByLabel(/your review/i).fill('Nice dish.');
  if (testInfo.project.name === 'angular') {
    await page.locator('button[matTooltip="Toggle Preview"], button.preview-toggle').first().click();
  } else {
    await page.getByRole('button', { name: /show preview/i }).click();
  }
  await expect(page.getByText('Test User').first()).toBeVisible();
  await expect(page.locator('.preview-rating .mat-icon, .preview-rating mat-icon, .fa-star').first()).toBeVisible();
});

/* --- Contact success: agree and contact type in summary --- */
test('contact: success shows Contact Permission and contact method', async ({ page }, testInfo) => {
  test.fail(testInfo.project.name === 'react', 'React success summary omits permission rows');
  await go(page, testInfo.project.name, '/contactus/');
  await page.getByLabel(/first name/i).fill('Ada');
  await page.getByLabel(/last name/i).fill('Lovelace');
  await page.getByLabel(/phone number/i).fill('12345678');
  await page.getByLabel(/email address/i).fill('ada@example.com');
  if (testInfo.project.name === 'angular') {
    await page.locator('mat-slide-toggle[formcontrolname="agree"] .mat-slide-toggle-label').click();
  } else {
    await page.getByRole('checkbox', { name: /follow-up/i }).check();
  }
  if (testInfo.project.name === 'angular') {
    await page.locator('mat-select[formcontrolname="contacttype"]').click();
    await page.getByRole('option', { name: 'Email' }).click();
    await page.keyboard.press('Escape');
  } else {
    await page.getByLabel(/Preferred Contact Method/i).selectOption('Email');
  }
  await page
    .getByLabel(/your feedback|Tell us about your experience/i)
    .or(page.getByRole('textbox', { name: /feedback/i }))
    .first()
    .fill('Great meal.');
  await page.getByRole('button', { name: /send feedback/i }).click();
  await expect(page.getByText(/Thank You/i).first()).toBeVisible({ timeout: 20000 });
  await expect(
    page.getByText('Contact Permission', { exact: false }).or(page.getByText(/Contact Permission/i)),
  ).toBeVisible();
  await expect(
    page.getByText('Contact Method', { exact: false }).or(page.getByText(/Contact Method/i)),
  ).toBeVisible();
});
