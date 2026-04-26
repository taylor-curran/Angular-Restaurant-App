import type { Page } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const dish0 = {
  _id: '0',
  name: 'Uthappizza',
  image: 'images/uthappizza.png',
  category: 'mains',
  featured: true,
  label: 'Hot',
  price: 4.99,
  description:
    "A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.",
  comments: [
    {
      rating: 5,
      comment: 'Imagine all the eatables, living in conFusion!',
      author: 'John Lemon',
      date: '2012-10-16T17:57:28.556Z'
    }
  ]
};

const dish1 = {
  _id: '1',
  name: 'Zucchipakoda',
  image: 'images/zucchipakoda.png',
  category: 'appetizer',
  featured: false,
  label: '',
  price: 1.99,
  description: 'Deep fried Zucchini with chickpea batter',
  comments: []
};

const allDishes = [dish0, dish1];

const featuredPromotion = {
  _id: 'p0',
  name: "Weekend Chef's Tasting",
  image: 'images/buffet.png',
  label: 'Limited Time',
  price: 19.99,
  featured: true,
  description: 'A special sampling menu for the weekend.'
};

const featuredLeader = {
  _id: 'l0',
  name: 'Peter Pan',
  image: 'images/alberto.png',
  designation: 'Chief Epicurious Officer',
  abbr: 'CEO',
  featured: true,
  description: 'Our award-winning head of culinary operations.'
};

const allLeaders = [
  featuredLeader,
  {
    _id: 'l1',
    name: 'Dhanasekaran Witherspoon',
    image: 'images/alberto.png',
    designation: 'CFO',
    abbr: 'CFO',
    featured: false,
    description: 'The numbers guy.'
  }
];

export async function installApiMock(page: Page): Promise<void> {
  await page.route('http://localhost:8000/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;
    const method = req.method();

    const json = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(data)
      });

    if (path.startsWith('/images/') || path === '/images' || path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      return route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: tinyPng
      });
    }

    if (method === 'POST' && path === '/feedback') {
      return json({ ok: true });
    }

    if (method !== 'GET') {
      return json({ error: 'not found' }, 404);
    }

    if (path === '/dishes' && url.searchParams.get('featured') === 'true') {
      return json([dish0]);
    }
    if (path === '/dishes') {
      return json(allDishes);
    }
    if (path === '/dishes/0') {
      return json(dish0);
    }
    if (path === '/dishes/1') {
      return json(dish1);
    }
    if (path === '/promotions' && url.searchParams.get('featured') === 'true') {
      return json([featuredPromotion]);
    }
    if (path === '/promotions') {
      return json([featuredPromotion]);
    }
    if (path === '/leaders' && url.searchParams.get('featured') === 'true') {
      return json([featuredLeader]);
    }
    if (path === '/leaders') {
      return json(allLeaders);
    }

    return json({ error: 'not found' }, 404);
  });
}
