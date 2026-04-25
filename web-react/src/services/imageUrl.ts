import { baseURL } from '../shared/baseurl';

// Mirror of src/app/services/image-url.service.ts. Keeps the same input/output
// behaviour so an identical wire-format response from the backend produces an
// identical rendered <img src> on both stacks.
export function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/')) {
    return `${baseURL}${imageUrl.substring(1)}`;
  }
  return `${baseURL}images/${imageUrl}`;
}
