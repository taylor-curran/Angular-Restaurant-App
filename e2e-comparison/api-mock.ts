/**
 * API payloads for Playwright network mocking (aligns with web-react MSW test data).
 * Image paths are relative; clients resolve to http://localhost:8000/...
 */
export const mockDishes = [
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
  {
    _id: '1',
    name: 'Zucchipakoda',
    image: 'images/zucchipakoda.png',
    category: 'appetizer',
    featured: false,
    label: 'New',
    price: 1.99,
    description: 'Deep fried Zucchini with chickpea batter.',
    comments: [] as { rating: number; comment: string; author: string; createdAt?: string; date?: string }[],
  },
] as const;

export const mockLeaders = [
  {
    _id: '0',
    name: 'Peter Pan',
    image: 'images/alberto.png',
    designation: 'Chief Epicurious Officer',
    abbr: 'CEO',
    featured: true,
    description: 'Our CEO, Peter, credits his hardworking East Asian immigrant parents.',
  },
] as const;

export const mockPromotions = [
  {
    _id: '0',
    name: 'Weekend Grand Buffet',
    image: 'images/buffet.png',
    label: 'New',
    price: 19.99,
    featured: true,
    description: 'Featuring mouthwatering combinations.',
  },
] as const;
