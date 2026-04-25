import { Promotion } from '../shared/types';
import { baseURL } from '../shared/baseurl';
import { getImageUrl } from './imageUrl';
import { httpGet } from './http';

interface RawPromotion {
  _id: string;
  name: string;
  image: string;
  label: string;
  price: string | number;
  featured: boolean;
  description: string;
}

function mapPromotion(p: RawPromotion): Promotion {
  return {
    id: p._id,
    name: p.name,
    image: getImageUrl(p.image),
    label: p.label,
    price: String(p.price),
    featured: p.featured,
    description: p.description,
  };
}

export async function getFeaturedPromotion(): Promise<Promotion> {
  const promotions = await httpGet<RawPromotion[]>(`${baseURL}promotions?featured=true`);
  return mapPromotion(promotions[0]);
}
