import { describe, it, expect } from 'vitest';
import { getImageUrl } from '../imageUrl';

// Parity test mirror of src/app/services/image-url.service.spec.ts. The base
// URL differs between stacks (Angular calls the API absolutely; we proxy via
// Vite), so the assertions are adjusted to the React baseURL = '/'.
describe('imageUrl.getImageUrl', () => {
  it('returns absolute http URL unchanged', () => {
    const u = 'http://localhost:8000/images/uthappizza.png';
    expect(getImageUrl(u)).toBe(u);
  });

  it('returns absolute https URL unchanged', () => {
    const u = 'https://cdn.example.com/x.png';
    expect(getImageUrl(u)).toBe(u);
  });

  it('keeps relative paths anchored to baseURL', () => {
    expect(getImageUrl('/images/uthappizza.png')).toBe('/images/uthappizza.png');
  });

  it('expands bare filenames to /images/<name>', () => {
    expect(getImageUrl('uthappizza.png')).toBe('/images/uthappizza.png');
  });

  it('returns empty string for empty/null/undefined', () => {
    expect(getImageUrl('')).toBe('');
    expect(getImageUrl(null as unknown as string)).toBe('');
    expect(getImageUrl(undefined)).toBe('');
  });
});
