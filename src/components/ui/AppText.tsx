import { Text, type TextProps } from 'react-native';

import { colors, typography, type ColorToken, type TypographyVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
};

/**
 * Text with the app's type scale applied. Font scaling stays on for accessibility,
 * capped so large system sizes don't break fixed-height layouts.
 */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[typography[variant], { color: colors[color] }, style]}
    />
  );
}
