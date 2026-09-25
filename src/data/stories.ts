import type { Story } from './types';

/**
 * Sample feed. People, headlines and numbers are fictional; the clips are public test videos
 * (test-videos.co.uk) and covers (picsum.photos) stand in for real story footage.
 */
const VIDEO = 'https://test-videos.co.uk/vids';
const CLIPS = {
  bunny: `${VIDEO}/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`,
  jellyfish: `${VIDEO}/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4`,
  sintel: `${VIDEO}/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4`,
};
const cover = (id: number) => `https://picsum.photos/id/${id}/800/1000`;

export const SAMPLE_STORIES: Story[] = [
  {
    id: 's1',
    authorId: 'u1',
    coAuthorIds: ['u2'],
    tag: 'Noida Metro',
    headline: 'Aqua Line extension gets final approval; work to begin this winter',
    summary:
      'The 11 km stretch will add five stations between Sector 51 and Knowledge Park V. Officials expect the first section to open within three years, cutting commute times for thousands of daily riders.',
    location: 'Sec-15, Noida',
    publishedAt: '2026-07-07T09:30:00+05:30',
    views: 25300,
    likes: 10700,
    comments: 2300,
    shares: 1200,
    videoUrl: CLIPS.bunny,
    posterUrl: cover(1011),
  },
  {
    id: 's2',
    authorId: 'u2',
    coAuthorIds: [],
    tag: 'Startups',
    headline: 'Local startups show off electric two-wheeler prototypes at weekend expo',
    summary:
      'Fourteen early-stage teams presented designs ranging from cargo scooters to swappable-battery bikes. Several said they are in talks with regional distributors.',
    location: 'Knowledge Park, Greater Noida',
    publishedAt: '2026-07-06T18:10:00+05:30',
    views: 18400,
    likes: 2120,
    comments: 370,
    shares: 140,
    videoUrl: CLIPS.jellyfish,
    posterUrl: cover(1015),
  },
  {
    id: 's3',
    authorId: 'u3',
    coAuthorIds: [],
    tag: 'Monsoon',
    headline: 'Monsoon showers bring temperatures down by 6°C across Delhi-NCR',
    summary:
      'The weather department expects light to moderate rain through the week. Commuters are advised to check for waterlogging on low-lying stretches before heading out.',
    location: 'Connaught Place, Delhi',
    publishedAt: '2026-07-06T07:45:00+05:30',
    views: 124000,
    likes: 9800,
    comments: 1440,
    shares: 860,
    videoUrl: CLIPS.sintel,
    posterUrl: cover(1025),
  },
  {
    id: 's4',
    authorId: 'u4',
    coAuthorIds: ['u1'],
    tag: 'Clean Air',
    headline: 'School students build low-cost air quality sensors for their neighbourhood',
    summary:
      'A group of Class 11 students assembled 20 sensors for under ₹1,500 each and now publish hourly readings for residents on a shared noticeboard.',
    location: 'Indirapuram, Ghaziabad',
    publishedAt: '2026-07-05T16:20:00+05:30',
    views: 31200,
    likes: 4550,
    comments: 580,
    shares: 310,
    videoUrl: CLIPS.bunny,
    posterUrl: cover(1031),
  },
  {
    id: 's5',
    authorId: 'u5',
    coAuthorIds: [],
    tag: 'Cricket',
    headline: 'Community cricket league final draws a record crowd',
    summary:
      'More than 3,000 residents turned up for the final, which went down to the last over. Organisers plan to add a women’s division next season.',
    location: 'Sec-21A Stadium, Noida',
    publishedAt: '2026-07-04T20:05:00+05:30',
    views: 56700,
    likes: 7340,
    comments: 960,
    shares: 420,
    videoUrl: CLIPS.jellyfish,
    posterUrl: cover(1043),
  },
  {
    id: 's6',
    authorId: 'u1',
    coAuthorIds: [],
    tag: 'Markets',
    headline: 'Weekly farmers’ market returns with more than 60 stalls',
    summary:
      'Growers from nearby villages are selling seasonal produce, millets and cold-pressed oils every Sunday morning until the end of October.',
    location: 'Sec-18, Noida',
    publishedAt: '2026-07-03T08:00:00+05:30',
    views: 9800,
    likes: 1200,
    comments: 90,
    shares: 45,
    videoUrl: CLIPS.sintel,
    posterUrl: cover(1050),
  },
];

export function getStory(id: string | null | undefined): Story | undefined {
  return id ? SAMPLE_STORIES.find((s) => s.id === id) : undefined;
}

export function storiesBy(authorId: string): Story[] {
  return SAMPLE_STORIES.filter((s) => s.authorId === authorId);
}
