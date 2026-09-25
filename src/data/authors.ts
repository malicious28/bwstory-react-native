import type { Author } from './types';

/** Sample creators. People, bios and numbers are fictional. */
export const AUTHORS: Record<string, Author> = {
  u1: {
    id: 'u1',
    name: 'Amit Saxena',
    handle: 'amitsaxena',
    verified: true,
    bio: 'Reporter covering Noida and Greater Noida: transport, civic issues and the people behind the headlines.',
    location: 'Sec-15, Noida',
    followers: 18400,
    following: 318,
    tone: '#2F6B5B',
  },
  u2: {
    id: 'u2',
    name: 'Nidhi Gupta',
    handle: 'nidhi.gupta',
    verified: true,
    bio: 'Business and startups desk. Founders, funding rounds and the small shops that keep our city running.',
    location: 'Greater Noida',
    followers: 9200,
    following: 402,
    tone: '#8A4B2A',
  },
  u3: {
    id: 'u3',
    name: 'Rahul Mehra',
    handle: 'rahulreports',
    verified: true,
    bio: 'Weather, climate and city life across Delhi-NCR. Updates every morning before your commute.',
    location: 'Delhi',
    followers: 31500,
    following: 211,
    tone: '#3D5A99',
  },
  u4: {
    id: 'u4',
    name: 'Priya Nair',
    handle: 'priyanair',
    verified: false,
    bio: 'Science and education stories from classrooms and labs around Ghaziabad.',
    location: 'Ghaziabad',
    followers: 4100,
    following: 530,
    tone: '#7A3E6E',
  },
  u5: {
    id: 'u5',
    name: 'Karan Singh',
    handle: 'karan.sports',
    verified: false,
    bio: 'Grassroots sport: community leagues, school teams and weekend tournaments.',
    location: 'Noida',
    followers: 6700,
    following: 288,
    tone: '#5B6320',
  },
};

export function getAuthor(id: string | null | undefined): Author | undefined {
  return id && Object.prototype.hasOwnProperty.call(AUTHORS, id) ? AUTHORS[id] : undefined;
}
