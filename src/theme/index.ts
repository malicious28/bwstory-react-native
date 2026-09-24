export { colors } from './colors';
export type { ColorToken } from './colors';
export { fonts, typography } from './typography';
export type { TypographyVariant } from './typography';

/** 4-point spacing scale. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

/** Minimum touch target (Material / Apple HIG guidance). */
export const hitTarget = 44;

export const shadow = {
  card: {
    shadowColor: '#0B1D26',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#0B1D26',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
} as const;
