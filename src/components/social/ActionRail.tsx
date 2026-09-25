import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, type IoniconName } from '@/components/ui';
import { formatCount } from '@/lib/format';
import { colors, spacing } from '@/theme';

type Props = {
  liked: boolean;
  saved: boolean;
  likes: number;
  comments: number;
  shares: number;
  onMore: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
};

function RailButton({ icon, color = colors.text, count, label, selected, onPress }: {
  icon: IoniconName;
  color?: string;
  count?: number;
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count != null ? `${label}, ${formatCount(count)}` : label}
      accessibilityState={selected != null ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={25} color={color} />
      {count != null ? (
        <AppText variant="micro" allowFontScaling={false}>
          {formatCount(count)}
        </AppText>
      ) : null}
    </Pressable>
  );
}

/** Frosted vertical action bar on the right edge of the full-screen player. */
export function ActionRail({ liked, saved, likes, comments, shares, onMore, onLike, onComment, onShare, onSave }: Props) {
  return (
    <View style={styles.rail}>
      <RailButton icon="ellipsis-horizontal-circle-outline" label="More options" onPress={onMore} />
      <RailButton
        icon={liked ? 'heart' : 'heart-outline'}
        color={liked ? colors.brand : colors.text}
        count={likes}
        label={liked ? 'Unlike' : 'Like'}
        selected={liked}
        onPress={onLike}
      />
      <RailButton icon="chatbubble-ellipses-outline" count={comments} label="Comments" onPress={onComment} />
      <RailButton icon="paper-plane-outline" count={shares} label="Share" onPress={onShare} />
      <RailButton
        icon={saved ? 'bookmark' : 'bookmark-outline'}
        color={saved ? colors.brand : colors.text}
        label={saved ? 'Remove from saved' : 'Save story'}
        selected={saved}
        onPress={onSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: 58,
    paddingVertical: spacing.sm,
    borderRadius: 29,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.glassLight,
  },
  btn: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 2 },
  pressed: { opacity: 0.55 },
});
