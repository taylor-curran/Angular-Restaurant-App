import { test, expect, Page } from '@playwright/test';

// Helper that fills a form whose inputs have either a visible label or an
// `aria-label`; the React port uses MUI v9 (sometimes the label-for binding
// differs from Angular Material), so we fall back to the input name match.
async function fillByLabelOrAria(page: Page, name: string, value: string, fieldName: string) {
  const byLabel = page.getByLabel(new RegExp(name, 'i')).first();
  if ((await byLabel.count()) > 0) {
    try {
      await byLabel.fill(value, { timeout: 2000 });
      return;
    } catch {
      // Fall through to aria-label / name-attr fallback.
    }
  }
  const byAria = page.locator(`input[aria-label="${fieldName}"]`).first();
  if ((await byAria.count()) > 0) {
    await byAria.fill(value);
    return;
  }
  const byNameAttr = page.locator(`input[name="${fieldName}"], input[formcontrolname="${fieldName}"]`).first();
  await byNameAttr.fill(value);
}

interface FeedbackInput {
  firstname: string;
  lastname: string;
  telnum: string;
  email: string;
}
async function fillFeedbackForm(page: Page, v: FeedbackInput) {
  await fillByLabelOrAria(page, 'First ?Name', v.firstname, 'firstname');
  await fillByLabelOrAria(page, 'Last ?Name', v.lastname, 'lastname');
  await fillByLabelOrAria(page, 'Phone Number', v.telnum, 'telnum');
  await fillByLabelOrAria(page, 'Email Address', v.email, 'email');
}

// Captures every fetch the page makes to the json-server backend (port 8000).
async function withApiTrace<T>(page: Page, action: () => Promise<T>) {
  const apiCalls: { method: string; url: string }[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('localhost:8000') || /\/(dishes|leaders|promotions|feedback)(\/|\?|$)/.test(url)) {
      apiCalls.push({ method: req.method(), url: new URL(url).pathname + (new URL(url).search || '') });
    }
  });
  const result = await action();
  return { apiCalls, result };
}

test.describe('Routes mounted', () => {
  for (const path of ['/home', '/menu', '/about', '/contactus', '/dishdetail/0']) {
    test(`GET ${path} responds 200`, async ({ page, baseURL }) => {
      const res = await page.goto(`${baseURL}${path}`);
      expect(res?.status()).toBeLessThan(400);
    });
  }
});

test.describe('Header and footer (parity-visible chrome)', () => {
  test('navigation links exist for every route', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/home`);
    for (const path of ['/home', '/about', '/menu', '/contactus']) {
      const link = page.locator(`a[href$="${path}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('brand label "L\'Artisan Culinaire" is shown', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/home`);
    await expect(page.getByText("L'Artisan Culinaire").first()).toBeVisible();
  });
});

test.describe('Menu route renders dishes from the API', () => {
  // The Angular menu template references methods that the component never
  // defines (`filteredDishes`, `clearFilters`, `getFeaturedDishesCount`, …).
  // As a result the *ngIf="filteredDishes && filteredDishes.length > 0" gate
  // never opens and the page stays on the loading spinner. We assert the
  // contract that both stacks honor — the GET /dishes request is emitted —
  // and only assert the visible dish names on the React port (which fixes
  // the pre-existing template bug).
  test('issues GET /dishes', async ({ page, baseURL }) => {
    const { apiCalls } = await withApiTrace(page, async () => {
      await page.goto(`${baseURL}/menu`);
      await page.waitForTimeout(2000);
    });
    expect(apiCalls.some((c) => c.method === 'GET' && /\/dishes($|\?)/.test(c.url))).toBe(true);
  });

  test('shows every dish name from /dishes', async ({ page, baseURL }, testInfo) => {
    test.skip(
      testInfo.project.name === 'angular',
      'Angular menu template references undefined component members; dishes never render. ' +
        'See dishservice GET-only assertion above for the parity check that holds on both stacks.',
    );
    await page.goto(`${baseURL}/menu`);
    await expect(page.getByText(/UTHAPPIZZA/i).first()).toBeVisible();
    for (const name of ['UTHAPPIZZA', 'ZUCCHIPAKODA', 'VADONUT', 'ELAICHEESE CAKE']) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });
});

test.describe('DishDetail route renders dish and comments from the API', () => {
  test('GET /dishes/0 populates the dish card and reviews', async ({ page, baseURL }) => {
    const { apiCalls } = await withApiTrace(page, async () => {
      await page.goto(`${baseURL}/dishdetail/0`);
      await expect(page.getByText('UTHAPPIZZA').first()).toBeVisible();
    });
    expect(
      apiCalls.some((c) => c.method === 'GET' && /\/dishes\/0(\?|$)/.test(c.url)),
    ).toBe(true);
    await expect(page.getByText(/John Lemon/).first()).toBeVisible();
  });
});

test.describe('About route renders leaders', () => {
  test('GET /leaders populates the leadership grid', async ({ page, baseURL }) => {
    const { apiCalls } = await withApiTrace(page, async () => {
      await page.goto(`${baseURL}/about`);
      await expect(page.getByText('Peter Pan').first()).toBeVisible();
    });
    expect(apiCalls.some((c) => c.method === 'GET' && /\/leaders(\?|$)/.test(c.url))).toBe(true);
    for (const name of ['Peter Pan', 'Dhanasekaran Witherspoon', 'Agumbe Tang', 'Alberto Somayya']) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });
});

test.describe('Home route renders featured items', () => {
  test('issues GET /dishes?featured, /promotions?featured, /leaders?featured', async ({ page, baseURL }) => {
    const { apiCalls } = await withApiTrace(page, async () => {
      await page.goto(`${baseURL}/home`);
      await expect(page.getByText(/UTHAPPIZZA/).first()).toBeVisible();
    });
    expect(apiCalls.some((c) => /\/dishes\?featured=true/.test(c.url))).toBe(true);
    expect(apiCalls.some((c) => /\/promotions\?featured=true/.test(c.url))).toBe(true);
    expect(apiCalls.some((c) => /\/leaders\?featured=true/.test(c.url))).toBe(true);
  });
});

test.describe('Contact form posts to /feedback', () => {
  test('valid submit issues POST /feedback with the same JSON body shape', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/contactus`);

    const captured: { method: string; url: string; body: unknown }[] = [];
    await page.route('**/feedback', async (route) => {
      const req = route.request();
      captured.push({
        method: req.method(),
        url: new URL(req.url()).pathname,
        body: req.postDataJSON?.() ?? null,
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await fillFeedbackForm(page, {
      firstname: 'Ada',
      lastname: 'Lovelace',
      telnum: '12345',
      email: 'ada@example.com',
    });
    const submit = page.getByRole('button', { name: /Send Feedback/i });
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect.poll(() => captured.length).toBeGreaterThan(0);
    const call = captured[0];
    expect(call.method).toBe('POST');
    expect(call.url).toBe('/feedback');
    expect(call.body).toMatchObject({
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
    });
    // Phone number can be sent as either string or number depending on stack.
    expect(String((call.body as Record<string, unknown>).telnum)).toBe('12345');
  });

  test('submit stays disabled until form is valid', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/contactus`);
    const submit = page.getByRole('button', { name: /Send Feedback/i });
    await expect(submit).toBeDisabled();
    await fillFeedbackForm(page, {
      firstname: 'A',
      lastname: 'B',
      telnum: 'abc',
      email: 'not-email',
    });
    await expect(submit).toBeDisabled();
  });
});
