// Wire-format fixtures (the shape the API returns) shared between service and
// component tests. Mirrors the rows in /workspace/db.json.
export const RAW_DISHES = [
  {
    _id: '0',
    name: 'Uthappizza',
    image: '/assets/images/uthappizza.png',
    category: 'mains',
    featured: true,
    label: 'Hot',
    price: '4.99',
    description: 'Indian-Italian fusion pizza.',
    comments: [
      {
        rating: 5,
        comment: 'Imagine all the eatables, living in conFusion!',
        author: 'John Lemon',
        date: '2012-10-16T17:57:28.556094Z',
      },
    ],
  },
  {
    _id: '1',
    name: 'Zucchipakoda',
    image: '/assets/images/zucchipakoda.png',
    category: 'appetizer',
    featured: false,
    label: '',
    price: '1.99',
    description: 'Deep fried zucchini.',
    comments: [],
  },
];

export const RAW_LEADERS = [
  {
    _id: '0',
    name: 'Peter Pan',
    image: '/assets/images/alberto.png',
    designation: 'Chief Epicurious Officer',
    abbr: 'CEO',
    featured: false,
    description: 'CEO description',
  },
  {
    _id: '3',
    name: 'Alberto Somayya',
    image: '/assets/images/alberto.png',
    designation: 'Executive Chef',
    abbr: 'EC',
    featured: true,
    description: 'Executive chef description',
  },
];

export const RAW_PROMOTIONS = [
  {
    _id: '0',
    name: 'Weekend Grand Buffet',
    image: '/assets/images/buffet.png',
    label: 'New',
    price: '19.99',
    featured: true,
    description: 'Featured buffet',
  },
];
