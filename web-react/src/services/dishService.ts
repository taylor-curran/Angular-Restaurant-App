import { Dish } from '../shared/types';
import { baseURL } from '../shared/baseurl';
import { getImageUrl } from './imageUrl';
import { httpGet, httpPut } from './http';

interface RawComment {
  rating: number;
  comment: string;
  author: string;
  date?: string;
  createdAt?: string;
}

interface RawDish {
  _id: string;
  name: string;
  image: string;
  category: string;
  featured: boolean;
  label: string;
  price: string | number;
  description: string;
  comments?: RawComment[];
}

function mapDish(dish: RawDish): Dish {
  return {
    id: dish._id,
    name: dish.name,
    image: getImageUrl(dish.image),
    category: dish.category,
    featured: dish.featured,
    label: dish.label,
    price: String(dish.price),
    description: dish.description,
    comments: (dish.comments || []).map((c) => ({
      rating: c.rating,
      comment: c.comment,
      author: c.author,
      date: c.createdAt || c.date || '',
    })),
  };
}

export async function getDishes(): Promise<Dish[]> {
  const dishes = await httpGet<RawDish[]>(`${baseURL}dishes`);
  return dishes.map(mapDish);
}

export async function getDish(id: string): Promise<Dish> {
  const dish = await httpGet<RawDish>(`${baseURL}dishes/${id}`);
  return mapDish(dish);
}

export async function getFeaturedDish(): Promise<Dish> {
  const dishes = await httpGet<RawDish[]>(`${baseURL}dishes?featured=true`);
  return mapDish(dishes[0]);
}

export async function getDishIds(): Promise<string[]> {
  try {
    const dishes = await getDishes();
    return dishes.map((d) => d.id);
  } catch {
    return [];
  }
}

export async function putDish(dish: Dish): Promise<Dish> {
  // Mirrors DishService.putDish: PUT /dishes/:id with the (already mapped)
  // dish payload — exactly what the Angular app does so the request body and
  // path are identical.
  return httpPut<Dish>(`${baseURL}dishes/${dish.id}`, dish);
}
