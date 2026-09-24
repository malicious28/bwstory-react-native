import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { fonts } from '@/theme';

import { AppText } from './AppText';

// Muted, white-text-safe tones (all ≥ 4.5:1 against #FFFFFF).
const PALETTE = ['#2F6B5B', '#8A4B2A', '#3D5A99', '#7A3E6E', '#5B6320', '#1F6480', '#9A3B3B'];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

function toneFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length] ?? PALETTE[0]!;
}

type Props = {
  name: string;
  uri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Photo avatar with an initials fallback; decorative, so hidden from screen readers. */
export function Avatar({ name, uri, size = 36, style }: Props) {
  const box = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, box, { backgroundColor: toneFor(name) }, style]}
    >
      {uri ? (
        <Image source={{ uri }} style={box} contentFit="cover" transition={150} />
      ) : (
        <AppText
          allowFontScaling={false}
          color="textInverse"
          style={{ fontFamily: fonts.semibold, fontSize: Math.round(size * 0.38), lineHeight: Math.round(size * 0.46) }}
        >
          {initialsOf(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
