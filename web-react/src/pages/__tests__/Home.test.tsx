import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_DISHES, RAW_LEADERS, RAW_PROMOTIONS } from '../../test/fixtures';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

describe('<Home>', () => {
  it('fetches the three featured endpoints in parallel and renders one of each', async () => {
    mock = installFetchMock({
      'GET /dishes?featured=true': { body: [RAW_DISHES[0]] },
      'GET /promotions?featured=true': { body: RAW_PROMOTIONS },
      'GET /leaders?featured=true': { body: [RAW_LEADERS[1]] },
    });
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('UTHAPPIZZA')).toBeInTheDocument());
    expect(screen.getByText('WEEKEND GRAND BUFFET')).toBeInTheDocument();
    expect(screen.getByText('ALBERTO SOMAYYA')).toBeInTheDocument();
    const urls = mock.calls.map((c) => c.url).sort();
    expect(urls).toEqual([
      '/dishes?featured=true',
      '/leaders?featured=true',
      '/promotions?featured=true',
    ]);
    expect(mock.calls.every((c) => c.method === 'GET')).toBe(true);
  });
});
