import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_DISHES } from '../../test/fixtures';
import { getDish, getDishes, getFeaturedDish, putDish } from '../dishService';

let mock: ReturnType<typeof installFetchMock>;

afterEach(() => mock?.restore());

describe('dishService HTTP contract', () => {
  it('GET /dishes -> normalized list with id/price/comments mapped', async () => {
    mock = installFetchMock({ 'GET /dishes': { body: RAW_DISHES } });
    const dishes = await getDishes();
    expect(mock.calls).toEqual([{ method: 'GET', url: '/dishes', body: undefined }]);
    expect(dishes).toHaveLength(2);
    expect(dishes[0]).toMatchObject({
      id: '0',
      name: 'Uthappizza',
      image: '/assets/images/uthappizza.png',
      category: 'mains',
      featured: true,
      label: 'Hot',
      price: '4.99',
    });
    expect(dishes[0].comments[0]).toMatchObject({
      rating: 5,
      author: 'John Lemon',
      date: '2012-10-16T17:57:28.556094Z',
    });
  });

  it('GET /dishes/:id -> single dish', async () => {
    mock = installFetchMock({ 'GET /dishes/0': { body: RAW_DISHES[0] } });
    const dish = await getDish('0');
    expect(mock.calls[0]).toEqual({ method: 'GET', url: '/dishes/0', body: undefined });
    expect(dish.id).toBe('0');
    expect(dish.comments).toHaveLength(1);
  });

  it('GET /dishes?featured=true -> first featured', async () => {
    mock = installFetchMock({
      'GET /dishes?featured=true': { body: [RAW_DISHES[0]] },
    });
    const dish = await getFeaturedDish();
    expect(mock.calls[0].url).toBe('/dishes?featured=true');
    expect(dish.id).toBe('0');
  });

  it('PUT /dishes/:id -> sends the dish body and resolves with response', async () => {
    const updated = {
      id: '0',
      name: 'Uthappizza',
      image: '/x.png',
      category: 'mains',
      featured: true,
      label: 'Hot',
      price: '4.99',
      description: 'desc',
      comments: [
        {
          rating: 4,
          comment: 'New review',
          author: 'Tester',
          date: '2024-01-01T00:00:00.000Z',
        },
      ],
    };
    mock = installFetchMock({ 'PUT /dishes/0': { body: updated } });
    const result = await putDish(updated);
    expect(mock.calls[0].method).toBe('PUT');
    expect(mock.calls[0].url).toBe('/dishes/0');
    expect(mock.calls[0].body).toEqual(updated);
    expect(result.id).toBe('0');
  });

  it('propagates HTTP errors with "<status> - <statusText> <body>"', async () => {
    mock = installFetchMock({ 'GET /dishes': { status: 500, text: 'boom' } });
    await expect(getDishes()).rejects.toThrow(/500/);
  });
});
