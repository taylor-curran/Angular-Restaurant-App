import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Menu } from '../Menu';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_DISHES } from '../../test/fixtures';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

function renderMenu() {
  return render(
    <MemoryRouter initialEntries={['/menu']}>
      <Routes>
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('<Menu>', () => {
  it('shows loading state, then a card per dish from GET /dishes', async () => {
    mock = installFetchMock({ 'GET /dishes': { body: RAW_DISHES } });
    renderMenu();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('dish-card-0')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('dish-card-1')).toBeInTheDocument();
    expect(screen.getByText('UTHAPPIZZA')).toBeInTheDocument();
    expect(screen.getByText('ZUCCHIPAKODA')).toBeInTheDocument();
    expect(mock.calls[0]).toEqual({ method: 'GET', url: '/dishes', body: undefined });
  });

  it('shows error section when GET /dishes fails', async () => {
    mock = installFetchMock({ 'GET /dishes': { status: 500, text: 'down' } });
    renderMenu();
    await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument());
    expect(screen.getByText('Menu Temporarily Unavailable')).toBeInTheDocument();
  });
});
