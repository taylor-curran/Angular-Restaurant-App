import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DishDetail } from '../DishDetail';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_DISHES } from '../../test/fixtures';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

function renderAt(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/dishdetail/${id}`]}>
      <Routes>
        <Route path="/dishdetail/:id" element={<DishDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('<DishDetail>', () => {
  it('renders the dish from GET /dishes/:id and lists every comment', async () => {
    mock = installFetchMock({
      'GET /dishes': { body: RAW_DISHES },
      'GET /dishes/0': { body: RAW_DISHES[0] },
    });
    renderAt('0');
    await waitFor(() => expect(screen.getByTestId('dish-card')).toBeInTheDocument());
    expect(screen.getByText('UTHAPPIZZA')).toBeInTheDocument();
    expect(screen.getByText(/Indian-Italian fusion pizza/i)).toBeInTheDocument();
    expect(screen.getByTestId('comment-0')).toBeInTheDocument();
    expect(screen.getByText(/John Lemon/)).toBeInTheDocument();
    const dishCalls = mock.calls.filter((c) => c.url.startsWith('/dishes'));
    expect(dishCalls.some((c) => c.url === '/dishes/0')).toBe(true);
  });

  it('keeps Submit Review disabled until author + comment are valid', async () => {
    mock = installFetchMock({
      'GET /dishes': { body: RAW_DISHES },
      'GET /dishes/0': { body: RAW_DISHES[0] },
    });
    renderAt('0');
    await waitFor(() => expect(screen.getByTestId('comment-form')).toBeInTheDocument());
    const submit = screen.getByTestId('submit-review') as HTMLButtonElement;
    expect(submit).toBeDisabled();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Your Name/i), 'Ada');
    await user.type(screen.getByLabelText(/Your Review/i), 'Loved it.');
    expect(submit).toBeEnabled();
  });

  it('PUTs /dishes/:id with the dish body augmented by the new comment', async () => {
    let putBody: any = null;
    mock = installFetchMock({
      'GET /dishes': { body: RAW_DISHES },
      'GET /dishes/0': { body: RAW_DISHES[0] },
      'PUT /dishes/0': (_url, init) => {
        putBody = init?.body ? JSON.parse(init.body as string) : null;
        return { body: putBody };
      },
    });
    renderAt('0');
    await waitFor(() => expect(screen.getByTestId('dish-card')).toBeInTheDocument());
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Your Name/i), 'Tester');
    await user.type(screen.getByLabelText(/Your Review/i), 'New review');
    await user.click(screen.getByTestId('submit-review'));

    await waitFor(() => {
      const put = mock.calls.find((c) => c.method === 'PUT');
      expect(put).toBeTruthy();
    });
    const put = mock.calls.find((c) => c.method === 'PUT')!;
    expect(put.url).toBe('/dishes/0');
    const sent = put.body as any;
    expect(sent.id).toBe('0');
    expect(sent.comments).toHaveLength(2);
    expect(sent.comments[1]).toMatchObject({
      author: 'Tester',
      comment: 'New review',
      rating: 5,
    });
    await waitFor(() => expect(screen.getAllByText(/New review/).length).toBeGreaterThan(0));
  });
});
