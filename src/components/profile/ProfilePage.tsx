import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusStatusBar } from '@/components/ui';
import { colors, spacing } from '@/theme';

import { HERO_OVERLAP, ProfileHero } from './ProfileHero';

type Props = {
  name: string;
  coverUri?: string | null;
  tone?: string;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  /** Extra space at the bottom, e.g. to clear the tab bar. */
  bottomInset?: number;
  children: ReactNode;
};

/**
 * Shared layout for creator and own profile pages: dark page, cover hero that fades in,
 * content rising into the fade, and floating top controls that stay put while scrolling.
 */
export function ProfilePage({ name, coverUri, tone, topLeft, topRight, bottomInset = 0, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <FocusStatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + bottomInset + spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero name={name} imageUri={coverUri} tone={tone} />
        <View style={styles.content}>{children}</View>
      </ScrollView>
      <View style={[styles.topBar, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        <View>{topLeft}</View>
        <View>{topRight}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  content: { marginTop: -HERO_OVERLAP, paddingHorizontal: spacing.lg, gap: spacing.lg },
  topBar: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
});
