import { http, HttpResponse } from 'msw';

const base = 'http://localhost:8000';

const dishes = [
  {
    _id: '0',
    name: 'Uthappizza',
    image: 'images/uthappizza.png',
    category: 'mains',
    featured: true,
    label: 'Hot',
    price: 4.99,
    description: 'A unique combination of Indian Uthappam and Italian pizza.',
    comments: [
      {
        rating: 5,
        comment: 'Amazing',
        author: 'John',
        createdAt: '2020-01-01T00:00:00.000Z',
      },
    ],
  },
];

const leaders = [
  {
    _id: '0',
    name: 'Peter Pan',
    image: 'images/alberto.png',
    designation: 'Chief Epicurious Officer',
    abbr: 'CEO',
    featured: true,
    description: 'Our CEO, Peter, credits his hardworking East Asian immigrant parents.',
  },
];

const promotions = [
  {
    _id: '0',
    name: 'Weekend Grand Buffet',
    image: 'images/buffet.png',
    label: 'New',
    price: 19.99,
    featured: true,
    description: 'Featuring mouthwatering combinations.',
  },
];

export const handlers = [
  http.get(`${base}/dishes`, ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(dishes.filter((d) => d.featured));
    }
    return HttpResponse.json(dishes);
  }),
  http.get(`${base}/dishes/:id`, ({ params }) => {
    const dish = dishes.find((d) => d._id === params.id);
    return HttpResponse.json(dish ?? {}, { status: dish ? 200 : 404 });
  }),
  http.put(`${base}/dishes/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...body, id: params.id });
  }),
  http.get(`${base}/leaders`, ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(leaders.filter((l) => l.featured));
    }
    return HttpResponse.json(leaders);
  }),
  http.get(`${base}/promotions`, ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(promotions.filter((p) => p.featured));
    }
    return HttpResponse.json(promotions);
  }),
  http.post(`${base}/feedback`, async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(payload, { status: 201 });
  }),
  http.get('/dishes', ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(dishes.filter((d) => d.featured));
    }
    return HttpResponse.json(dishes);
  }),
  http.get('/dishes/:id', ({ params }) => {
    const dish = dishes.find((d) => d._id === params.id);
    return HttpResponse.json(dish ?? {}, { status: dish ? 200 : 404 });
  }),
  http.put('/dishes/:id', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...body, id: params.id });
  }),
  http.get('/leaders', ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(leaders.filter((l) => l.featured));
    }
    return HttpResponse.json(leaders);
  }),
  http.get('/promotions', ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    if (featured === 'true') {
      return HttpResponse.json(promotions.filter((p) => p.featured));
    }
    return HttpResponse.json(promotions);
  }),
  http.post('/feedback', async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(payload, { status: 201 });
  }),
];
