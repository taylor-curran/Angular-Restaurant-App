import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Contact } from '../Contact';
import { installFetchMock } from '../../test/mockFetch';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

function renderContact() {
  return render(
    <MemoryRouter initialEntries={['/contactus']}>
      <Routes>
        <Route path="/contactus" element={<Contact />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('<Contact> feedback form', () => {
  it('keeps the submit button disabled until the form is valid', async () => {
    const user = userEvent.setup();
    renderContact();
    const submit = screen.getByTestId('submit-feedback') as HTMLButtonElement;
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(/First Name/i), 'Ada');
    await user.type(screen.getByLabelText(/Last Name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/Phone Number/i), '12345');
    await user.type(screen.getByLabelText(/Email Address/i), 'ada@example.com');
    expect(submit).toBeEnabled();
  });

  it('shows the email validation message when the email is invalid', async () => {
    const user = userEvent.setup();
    renderContact();
    const email = screen.getByLabelText(/Email Address/i);
    await user.type(email, 'not-an-email');
    (email as HTMLElement).blur();
    await waitFor(() => expect(screen.getByText(/Email not in valid format/i)).toBeInTheDocument());
  });

  it('shows the telnum pattern message when phone has letters', async () => {
    const user = userEvent.setup();
    renderContact();
    const tel = screen.getByLabelText(/Phone Number/i);
    await user.type(tel, '123abc');
    (tel as HTMLElement).blur();
    await waitFor(() =>
      expect(screen.getByText(/Tel\. number must contain only numbers/i)).toBeInTheDocument(),
    );
  });

  it('POSTs /feedback with the exact body the form collected', async () => {
    mock = installFetchMock({
      'POST /feedback': { body: { id: 1 } },
    });
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByLabelText(/First Name/i), 'Ada');
    await user.type(screen.getByLabelText(/Last Name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/Phone Number/i), '12345');
    await user.type(screen.getByLabelText(/Email Address/i), 'ada@example.com');
    await user.click(screen.getByTestId('submit-feedback'));

    await waitFor(() => expect(mock.calls).toHaveLength(1));
    expect(mock.calls[0].method).toBe('POST');
    expect(mock.calls[0].url).toBe('/feedback');
    expect(mock.calls[0].body).toEqual({
      firstname: 'Ada',
      lastname: 'Lovelace',
      telnum: 12345,
      email: 'ada@example.com',
      agree: false,
      contacttype: 'None',
      message: '',
    });
  });
});
