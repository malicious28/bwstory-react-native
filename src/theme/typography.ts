import type { TextStyle } from 'react-native';

/** Font family names registered in the root layout via `useFonts`. */
export const fonts = {
  regular: 'SourceSans3_400Regular',
  medium: 'SourceSans3_500Medium',
  semibold: 'SourceSans3_600SemiBold',
  bold: 'SourceSans3_700Bold',
} as const;

export const typography = {
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  heading: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 18, letterSpacing: 0.2 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 17, letterSpacing: 0.2 },
  micro: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
