/**
 * Colour tokens. `brand` is sampled from the BWStory app header (#143442).
 * Text colours keep at least 4.5:1 contrast on their intended surface.
 */
export const colors = {
  brand: '#143442',
  brandPressed: '#0C2530',
  brandSoft: '#E6EEF1',
  brandTeal: '#2F7A8C',
  onBrand: '#FFFFFF',
  onBrandMuted: 'rgba(255,255,255,0.72)',

  accent: '#E0282E',
  like: '#E0282E',
  success: '#1E7F5C',
  successSoft: '#E4F4ED',
  danger: '#B3261E',
  dangerSoft: '#FCE9E7',

  background: '#FFFFFF',
  surface: '#FFFFFF',
  field: '#EEF1F3',
  border: '#E1E6E9',
  borderStrong: '#C6CFD4',
  ringSeen: '#C7CED2',

  text: '#14212A',
  textMuted: '#4A565C',
  textSubtle: '#66747C',
  textInverse: '#FFFFFF',

  /** Dark "night" surfaces used by full-screen video and profile pages. */
  night: '#0D1D24',
  nightCard: 'rgba(255,255,255,0.06)',
  nightField: 'rgba(255,255,255,0.08)',
  nightBorder: 'rgba(255,255,255,0.16)',
  nightText: '#E8EEF0',
  nightMuted: '#9FB0B7',
  nightDanger: '#FFB4AB',

  /** Translucent controls over photos and video. */
  glass: 'rgba(255,255,255,0.24)',
  glassLight: 'rgba(255,255,255,0.82)',
  mediaScrim: 'rgba(12,26,33,0.6)',

  media: '#1C2A31',
  scrim: 'rgba(0,0,0,0.38)',
  shadow: '#0B1D26',
} as const;

export type ColorToken = keyof typeof colors;
