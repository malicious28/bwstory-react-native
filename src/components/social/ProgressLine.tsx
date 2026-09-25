import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

/** Thin white playback line for the full-screen player. */
export function ProgressLine({ progress }: { progress: number }) {
  const pct = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)) * 100;
  return (
    <View
      style={styles.track}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Playback progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
    >
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  fill: { height: 3, borderRadius: 2, backgroundColor: colors.onBrand },
});
