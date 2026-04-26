import { baseURL } from './baseUrl';
import { mapHttpError } from './http';
import type { Dish, Feedback, Leader, Promotion } from './types';

type ApiDish = {
  _id: string;
  name: string;
  image: string;
  category: string;
  featured: boolean;
  label: string;
  price: number;
  description: string;
  comments?: Array<{
    rating: number;
    comment: string;
    author: string;
    createdAt?: string;
    date?: string;
  }>;
};

type ApiLeader = {
  _id: string;
  name: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
  description: string;
};

type ApiPromotion = {
  _id: string;
  name: string;
  image: string;
  label: string;
  price: number;
  featured: boolean;
  description: string;
};

function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${baseURL}${imageUrl.slice(1)}`;
  return `${baseURL}images/${imageUrl}`;
}

function mapDish(dish: ApiDish): Dish {
  return {
    id: dish._id,
    name: dish.name,
    image: getImageUrl(dish.image),
    category: dish.category,
    featured: dish.featured,
    label: dish.label,
    price: String(dish.price),
    description: dish.description,
    comments: (dish.comments ?? []).map((comment) => ({
      rating: comment.rating,
      comment: comment.comment,
      author: comment.author,
      date: comment.createdAt ?? comment.date ?? new Date().toISOString(),
    })),
  };
}

function mapLeader(leader: ApiLeader): Leader {
  return {
    id: leader._id,
    name: leader.name,
    image: getImageUrl(leader.image),
    designation: leader.designation,
    abbr: leader.abbr,
    featured: leader.featured,
    description: leader.description,
  };
}

function mapPromotion(promotion: ApiPromotion): Promotion {
  return {
    id: promotion._id,
    name: promotion.name,
    image: getImageUrl(promotion.image),
    label: promotion.label,
    price: String(promotion.price),
    featured: promotion.featured,
    description: promotion.description,
  };
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${baseURL}${path.replace(/^\//, '')}`);
  if (!response.ok) {
    throw new Error(mapHttpError(response.status, response.statusText, await response.text()));
  }
  return (await response.json()) as T;
}

export async function getDishes(): Promise<Dish[]> {
  const dishes = await getJson<ApiDish[]>('/dishes');
  return dishes.map(mapDish);
}

export async function getDish(id: string): Promise<Dish> {
  const dish = await getJson<ApiDish>(`/dishes/${id}`);
  return mapDish(dish);
}

export async function getFeaturedDish(): Promise<Dish> {
  const dishes = await getJson<ApiDish[]>('/dishes?featured=true');
  return mapDish(dishes[0]);
}

export async function putDish(dish: Dish): Promise<Dish> {
  const response = await fetch(`${baseURL}dishes/${dish.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dish),
  });
  if (!response.ok) {
    throw new Error(mapHttpError(response.status, response.statusText, await response.text()));
  }
  const data = (await response.json()) as Dish;
  return data;
}

export async function getLeaders(): Promise<Leader[]> {
  const leaders = await getJson<ApiLeader[]>('/leaders');
  return leaders.map(mapLeader);
}

export async function getFeaturedLeader(): Promise<Leader> {
  const leaders = await getJson<ApiLeader[]>('/leaders?featured=true');
  return mapLeader(leaders[0]);
}

export async function getPromotions(): Promise<Promotion[]> {
  const promotions = await getJson<ApiPromotion[]>('/promotions');
  return promotions.map(mapPromotion);
}

export async function getFeaturedPromotion(): Promise<Promotion> {
  const promotions = await getJson<ApiPromotion[]>('/promotions?featured=true');
  return mapPromotion(promotions[0]);
}

export async function postFeedback(feedback: Feedback): Promise<Feedback> {
  const response = await fetch(`${baseURL}feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  if (!response.ok) {
    throw new Error(mapHttpError(response.status, response.statusText, await response.text()));
  }
  return (await response.json()) as Feedback;
}

export const dishService = {
  getDishes,
  getDish,
  getFeaturedDish,
  getDishIds: async (): Promise<string[]> => (await getDishes()).map((dish) => dish.id),
  putDish,
};

export const leaderService = {
  getLeaders,
  getFeaturedLeader,
};

export const promotionService = {
  getPromotions,
  getFeaturedPromotion,
};

export const feedbackService = {
  postFeedback,
};
