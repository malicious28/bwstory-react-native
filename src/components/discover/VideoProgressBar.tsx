import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = { progress: number };

/** Thin red scrub line along the bottom edge of the video (display only). */
export function VideoProgressBar({ progress }: Props) {
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
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  fill: { height: 4, backgroundColor: colors.accent },
});
