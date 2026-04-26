export type Comment = {
  rating: number;
  comment: string;
  author: string;
  date: string;
};

export type Dish = {
  id: string;
  name: string;
  image: string;
  category: string;
  featured: boolean;
  label: string;
  price: string;
  description: string;
  comments: Comment[];
  favorite?: boolean;
  spicy?: boolean;
};

export type Promotion = {
  id: string;
  name: string;
  image: string;
  label: string;
  price: string;
  featured: boolean;
  description: string;
};

export type Leader = {
  id: string;
  name: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
  description: string;
};

export type Feedback = {
  firstname: string;
  lastname: string;
  telnum: number;
  email: string;
  agree: boolean;
  contacttype: string;
  message: string;
};

export const CONTACT_TYPES = ['None', 'Tel', 'Email'] as const;
export const contactTypes = CONTACT_TYPES;
