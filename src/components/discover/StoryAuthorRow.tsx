import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar } from '@/components/ui';
import type { Author } from '@/data/types';
import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  author: Author;
  following: boolean;
  onToggleFollow: () => void;
};

export const StoryAuthorRow = memo(function StoryAuthorRow({ author, following, onToggleFollow }: Props) {
  return (
    <View style={styles.row}>
      <Avatar name={author.name} uri={author.avatarUrl} size={36} />
      <AppText variant="bodyStrong" numberOfLines={1} style={styles.name}>
        {author.name}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: following }}
        accessibilityLabel={following ? `Unfollow ${author.name}` : `Follow ${author.name}`}
        onPress={onToggleFollow}
        hitSlop={{ top: 4, bottom: 4 }}
        style={({ pressed }) => [styles.follow, following ? styles.following : styles.notFollowing, pressed && styles.pressed]}
      >
        <AppText variant="label" color={following ? 'textMuted' : 'text'} style={!following && styles.bold}>
          {following ? 'Following' : 'Follow'}
        </AppText>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  name: { flex: 1 },
  follow: {
    minHeight: 36,
    minWidth: 96,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFollowing: { borderWidth: 1.5, borderColor: colors.text, backgroundColor: colors.surface },
  following: { backgroundColor: colors.brandSoft },
  bold: { fontFamily: fonts.semibold },
  pressed: { opacity: 0.7 },
});
