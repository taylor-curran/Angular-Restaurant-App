import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { About } from '../About';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_LEADERS } from '../../test/fixtures';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

describe('<About>', () => {
  it('renders one card per leader returned by GET /leaders', async () => {
    mock = installFetchMock({ 'GET /leaders': { body: RAW_LEADERS } });
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('leadership-grid')).toBeInTheDocument());
    expect(screen.getByTestId('leader-card-0')).toBeInTheDocument();
    expect(screen.getByTestId('leader-card-3')).toBeInTheDocument();
    expect(screen.getByText('Peter Pan')).toBeInTheDocument();
    expect(screen.getByText('Alberto Somayya')).toBeInTheDocument();
    expect(mock.calls[0]).toEqual({ method: 'GET', url: '/leaders', body: undefined });
  });

  it('shows error UI on failure with retry that re-issues the request', async () => {
    let n = 0;
    mock = installFetchMock({
      'GET /leaders': () => (n++ === 0 ? { status: 500, text: 'boom' } : { body: RAW_LEADERS }),
    });
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument());
    screen.getByText(/Try Again/i).click();
    await waitFor(() => expect(screen.getByTestId('leadership-grid')).toBeInTheDocument());
    expect(mock.calls.filter((c) => c.url === '/leaders')).toHaveLength(2);
  });
});
