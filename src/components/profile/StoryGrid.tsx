import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { Story } from '@/data/types';
import { formatCount } from '@/lib/format';
import { isSafeMediaUrl } from '@/lib/url';
import { colors, radius, spacing } from '@/theme';

type Props = { stories: Story[]; onOpen: (story: Story) => void };

/** Two-column grid of story covers with view counts. */
export function StoryGrid({ stories, onOpen }: Props) {
  return (
    <View style={styles.grid}>
      {stories.map((s) => (
        <Pressable
          key={s.id}
          accessibilityRole="button"
          accessibilityLabel={`Watch: ${s.headline}, ${formatCount(s.views)} views`}
          onPress={() => onOpen(s)}
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
        >
          {isSafeMediaUrl(s.posterUrl) ? (
            <Image source={{ uri: s.posterUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          ) : null}
          <View style={styles.views}>
            <Ionicons name="play" size={10} color={colors.onBrand} />
            <AppText variant="micro" color="textInverse" allowFontScaling={false}>
              {formatCount(s.views)}
            </AppText>
          </View>
          <View style={styles.caption}>
            <AppText variant="micro" color="textInverse" numberOfLines={2}>
              {s.headline}
            </AppText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47.8%',
    aspectRatio: 0.78,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.media,
  },
  views: {
    position: 'absolute',
    left: spacing.sm + 2,
    top: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.mediaScrim,
  },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.sm + 2,
    backgroundColor: colors.mediaScrim,
  },
  pressed: { opacity: 0.8 },
});
