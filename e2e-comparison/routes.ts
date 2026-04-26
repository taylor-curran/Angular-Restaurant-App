import type { Page, Route } from '@playwright/test';
import { mockDishes, mockLeaders, mockPromotions } from './api-mock';

const API = 'http://localhost:8000';

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Mocks the JSON Server API so both Angular and React load the same data without a running backend.
 */
export async function installApiMock(page: Page) {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (!url.startsWith(API)) {
      return route.continue();
    }

    const u = new URL(url);
    const path = u.pathname;
    const method = route.request().method();

    if (path === '/dishes' && method === 'GET') {
      const featured = u.searchParams.get('featured');
      if (featured === 'true') {
        return json(route, mockDishes.filter((d) => d.featured));
      }
      return json(route, [...mockDishes]);
    }

    const dishMatch = path.match(/^\/dishes\/([^/]+)$/);
    if (dishMatch && method === 'GET') {
      const d = mockDishes.find((x) => x._id === dishMatch[1]);
      if (!d) {
        return json(route, {}, 404);
      }
      return json(route, d);
    }

    if (dishMatch && method === 'PUT') {
      const raw = route.request().postData();
      const body = (raw ? (JSON.parse(raw) as Record<string, unknown>) : {}) as Record<string, unknown>;
      return json(route, { ...body, _id: dishMatch[1] });
    }

    if (path === '/leaders' && method === 'GET') {
      const featured = u.searchParams.get('featured');
      if (featured === 'true') {
        return json(route, mockLeaders.filter((l) => l.featured));
      }
      return json(route, [...mockLeaders]);
    }

    if (path === '/promotions' && method === 'GET') {
      const featured = u.searchParams.get('featured');
      if (featured === 'true') {
        return json(route, mockPromotions.filter((p) => p.featured));
      }
      return json(route, [...mockPromotions]);
    }

    if (path === '/feedback' && method === 'POST') {
      const raw = route.request().postData();
      let body: unknown = {};
      if (raw) {
        try {
          body = JSON.parse(raw) as unknown;
        } catch {
          body = { raw };
        }
      }
      return json(route, body, 201);
    }

    // Images and unknown API paths: let through (404) or empty
    if (path.startsWith('/images/')) {
      return route.fulfill({ status: 404, body: 'Not mocked' });
    }

    return json(route, { error: 'unmocked', path, method }, 404);
  });
}
