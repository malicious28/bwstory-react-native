import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, type IoniconName } from '@/components/ui';
import { formatCount } from '@/lib/format';
import { colors, hitTarget, spacing } from '@/theme';

type Props = {
  liked: boolean;
  likes: number;
  comments: number;
  onToggleLike: () => void;
  onShare: () => void;
  onComment: () => void;
};

function Action({
  icon,
  color,
  count,
  label,
  selected,
  onPress,
}: {
  icon: IoniconName;
  color: string;
  count?: number;
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count != null ? `${label}, ${count}` : label}
      accessibilityState={selected != null ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={24} color={color} />
      {count != null ? (
        <AppText variant="label" color="textMuted" allowFontScaling={false}>
          {formatCount(count)}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export function StoryActions({ liked, likes, comments, onToggleLike, onShare, onComment }: Props) {
  return (
    <View style={styles.row}>
      <Action
        icon={liked ? 'heart' : 'heart-outline'}
        color={liked ? colors.like : colors.brand}
        count={likes + (liked ? 1 : 0)}
        label={liked ? 'Unlike' : 'Like'}
        selected={liked}
        onPress={onToggleLike}
      />
      <Action icon="chatbubble-outline" color={colors.brand} count={comments} label="Comments" onPress={onComment} />
      <Action icon="share-social-outline" color={colors.brand} label="Share" onPress={onShare} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginLeft: -spacing.sm },
  action: {
    minHeight: hitTarget,
    minWidth: hitTarget,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  pressed: { opacity: 0.6 },
});
