import { Text } from 'react-native';

import { colors, fonts } from '@/theme';

/** "BWStory" logotype: navy "BW", teal "Story". */
export function Wordmark({ size = 32 }: { size?: number }) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="BWStory"
      allowFontScaling={false}
      style={{ fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.15, color: colors.brand, letterSpacing: -0.5 }}
    >
      BW<Text style={{ color: colors.brandTeal }}>Story</Text>
    </Text>
  );
}
