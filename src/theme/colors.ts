/**
 * Colour tokens. `brand` is sampled from the BWStory app header (#143442).
 * Text colours keep at least 4.5:1 contrast on `surface` and `background`.
 */
export const colors = {
  brand: '#143442',
  brandPressed: '#0C2530',
  brandSoft: '#E6EEF1',
  onBrand: '#FFFFFF',
  onBrandMuted: 'rgba(255,255,255,0.72)',

  accent: '#E0282E',
  like: '#E0282E',
  success: '#1E7F5C',
  successSoft: '#E4F4ED',
  danger: '#B3261E',
  dangerSoft: '#FCE9E7',

  background: '#F4F6F7',
  surface: '#FFFFFF',
  field: '#EEF1F3',
  border: '#E1E6E9',
  borderStrong: '#C6CFD4',

  text: '#15212A',
  textMuted: '#4F5D66',
  textSubtle: '#66747C',
  textInverse: '#FFFFFF',

  media: '#1C2A31',
  scrim: 'rgba(0,0,0,0.38)',
  shadow: '#0B1D26',
} as const;

export type ColorToken = keyof typeof colors;
