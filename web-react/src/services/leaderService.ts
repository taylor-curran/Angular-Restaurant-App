import { Leader } from '../shared/types';
import { baseURL } from '../shared/baseurl';
import { getImageUrl } from './imageUrl';
import { httpGet } from './http';

interface RawLeader {
  _id: string;
  name: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
  description: string;
}

function mapLeader(l: RawLeader): Leader {
  return {
    id: l._id,
    name: l.name,
    image: getImageUrl(l.image),
    designation: l.designation,
    abbr: l.abbr,
    featured: l.featured,
    description: l.description,
  };
}

export async function getLeaders(): Promise<Leader[]> {
  const leaders = await httpGet<RawLeader[]>(`${baseURL}leaders`);
  return leaders.map(mapLeader);
}

export async function getFeaturedLeader(): Promise<Leader> {
  const leaders = await httpGet<RawLeader[]>(`${baseURL}leaders?featured=true`);
  return mapLeader(leaders[0]);
}
