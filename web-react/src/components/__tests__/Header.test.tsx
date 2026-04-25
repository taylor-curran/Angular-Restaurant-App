import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';

describe('<Header>', () => {
  it('exposes the four primary nav links at the same paths as Angular', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const links = ['/home', '/about', '/menu', '/contactus'];
    for (const path of links) {
      const link = screen.getAllByRole('link').find((a) => (a as HTMLAnchorElement).getAttribute('href') === path);
      expect(link, `expected nav link to ${path}`).toBeTruthy();
    }
    expect(screen.getByTestId('brand')).toHaveAttribute('href', '/home');
  });
});
