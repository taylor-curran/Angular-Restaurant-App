import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

function renderApp(initialEntries: string[] = ['/']) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('React migration parity', () => {
  it('redirects root path to home', async () => {
    renderApp(['/']);
    expect(await screen.findByRole('heading', { name: /welcome to culinary excellence/i })).toBeInTheDocument();
  });

  it('loads menu dishes and category filter works', async () => {
    renderApp(['/menu']);
    expect(await screen.findByRole('heading', { name: /our culinary masterpieces/i, level: 2 })).toBeInTheDocument();
    expect(await screen.findByText(/Uthappizza/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /mains/i }));
    await waitFor(() => {
      expect(screen.getByText(/Uthappizza/i)).toBeInTheDocument();
    });
  });

  it('validates dish comment form and posts full dish update', async () => {
    renderApp(['/dishdetail/0']);
    expect(await screen.findByRole('heading', { name: /uthappizza/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
    expect(await screen.findByText(/author name is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'React Tester' } });
    fireEvent.change(screen.getByLabelText(/your review/i), {
      target: { value: 'Great parity with Angular implementation.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));

    await waitFor(() => {
      expect(screen.getByText(/great parity with angular implementation/i)).toBeInTheDocument();
    });
  });

  it('submits contact feedback and shows response summary', async () => {
    renderApp(['/contactus']);
    expect(await screen.findByRole('heading', { name: /we value your opinion/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(/your feedback/i), {
      target: { value: 'Wonderful meal and excellent service.' },
    });

    const submitButton = screen.getByRole('button', { name: /send feedback/i });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);
    expect(await screen.findByText(/thank you!/i)).toBeInTheDocument();
    expect(await screen.findByText(/ada lovelace/i)).toBeInTheDocument();
  });
});
