import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, initialsOf } from '@/components/ui';
import { isSafeMediaUrl } from '@/lib/url';
import { colors, fonts } from '@/theme';

export const HERO_HEIGHT = 460;
/** How far the identity block rises into the fade. */
export const HERO_OVERLAP = 130;

type Props = {
  name: string;
  /** Remote cover (allow-listed) or a local file URI for the user's own photo. */
  imageUri?: string | null;
  tone?: string;
  height?: number;
  children?: ReactNode;
};

const LOCAL_URI = /^(file|content):\/\//;

/**
 * Full-bleed cover photo that fades into the dark page, shared by creator and own profile
 * pages. Without a photo it shows large initials on the brand colour.
 */
export function ProfileHero({ name, imageUri, tone = colors.brand, height = HERO_HEIGHT, children }: Props) {
  const uri = imageUri && (LOCAL_URI.test(imageUri) || isSafeMediaUrl(imageUri)) ? imageUri : null;
  return (
    <View style={[styles.hero, { height }]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} accessibilityLabel={`${name}, cover photo`} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: tone }]}>
          <AppText allowFontScaling={false} style={styles.initials}>
            {initialsOf(name)}
          </AppText>
        </View>
      )}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(13,29,36,0)', 'rgba(13,29,36,0.75)', colors.night]}
        locations={[0, 0.55, 1]}
        style={styles.fade}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: HERO_HEIGHT, backgroundColor: colors.night },
  fallback: { alignItems: 'center', justifyContent: 'center', paddingBottom: HERO_OVERLAP },
  initials: { fontFamily: fonts.display, fontSize: 120, lineHeight: 140, color: 'rgba(255,255,255,0.9)' },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 230 },
});
