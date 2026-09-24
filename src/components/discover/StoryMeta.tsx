import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { formatCount, formatStoryDate } from '@/lib/format';
import { colors, spacing } from '@/theme';

type Props = { publishedAt: string; location: string; views: number };

/** "7th July            📍 Sec-15, Noida | 253 Views" */
export function StoryMeta({ publishedAt, location, views }: Props) {
  const viewsLabel = `${formatCount(views)} ${views === 1 ? 'View' : 'Views'}`;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${formatStoryDate(publishedAt)}, ${location}, ${viewsLabel}`}
    >
      <AppText variant="caption" color="textMuted">
        {formatStoryDate(publishedAt)}
      </AppText>
      <View style={styles.right}>
        <Ionicons name="location-outline" size={13} color={colors.textMuted} />
        <AppText variant="caption" color="textMuted" numberOfLines={1} style={styles.location}>
          {location}
        </AppText>
        <View style={styles.divider} />
        <AppText variant="caption" color="textMuted">
          {viewsLabel}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  location: { flexShrink: 1 },
  divider: { width: 1, height: 14, backgroundColor: colors.borderStrong, marginHorizontal: spacing.xs },
});
