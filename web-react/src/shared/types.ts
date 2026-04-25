// Mirror of the Angular shared/* models, used after the response from the API
// has been normalized (the wire format uses _id and a numeric price).

export interface Comment {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface Dish {
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
}

export interface Leader {
  id: string;
  name: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
  description: string;
}

export interface Promotion {
  id: string;
  name: string;
  image: string;
  label: string;
  price: string;
  featured: boolean;
  description: string;
}

export interface Feedback {
  firstname: string;
  lastname: string;
  telnum: number;
  email: string;
  agree: boolean;
  contacttype: string;
  message: string;
}

export const ContactType = ['None', 'Tel', 'Email'] as const;
export type ContactTypeT = (typeof ContactType)[number];
