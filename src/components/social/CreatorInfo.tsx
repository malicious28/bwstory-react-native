import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar } from '@/components/ui';
import type { Author, Story } from '@/data/types';
import { formatStoryDate } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme';

import { VerifiedBadge } from './VerifiedBadge';

type Props = {
  story: Story;
  author: Author;
  following: boolean;
  onOpenAuthor: () => void;
  onToggleFollow: () => void;
};

const shadow = { textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 8, textShadowOffset: { width: 0, height: 1 } };

/** Tag, creator row, headline and expandable summary over the bottom of the video. */
export function CreatorInfo({ story, author, following, onOpenAuthor, onToggleFollow }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.tag}>
        <AppText variant="micro" color="textInverse">
          {story.tag}
        </AppText>
      </View>

      <View style={styles.creatorRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${author.name}${author.verified ? ', verified' : ''}, @${author.handle}. Open profile`}
          onPress={onOpenAuthor}
          style={({ pressed }) => [styles.creator, pressed && styles.pressed]}
        >
          <View style={styles.ring}>
            <Avatar name={author.name} uri={author.avatarUrl} tone={author.tone} size={40} />
            {author.verified ? (
              <View style={styles.badge}>
                <VerifiedBadge size={14} outline={colors.onBrand} />
              </View>
            ) : null}
          </View>
          <View style={styles.names}>
            <AppText variant="heading" color="textInverse" numberOfLines={1} style={shadow}>
              {author.name}
            </AppText>
            <View style={styles.inline}>
              <Ionicons name="person-outline" size={12} color={colors.nightText} />
              <AppText variant="caption" numberOfLines={1} style={[shadow, { color: colors.nightText }]}>
                @{author.handle}
              </AppText>
            </View>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: following }}
          accessibilityLabel={following ? `Unfollow ${author.name}` : `Follow ${author.name}`}
          onPress={onToggleFollow}
          hitSlop={8}
          style={[styles.follow, following && styles.following]}
        >
          <AppText variant="micro" style={{ color: following ? colors.onBrand : colors.brand, fontFamily: fonts.heavy }}>
            {following ? 'Following' : 'Follow'}
          </AppText>
        </Pressable>
      </View>

      <AppText variant="bodyStrong" color="textInverse" style={shadow}>
        {story.headline}
      </AppText>
      {expanded ? (
        <AppText variant="body" style={[shadow, { color: colors.nightText }]}>
          {story.summary}
        </AppText>
      ) : null}
      <View style={styles.inline}>
        <Ionicons name="location-outline" size={13} color={colors.nightText} />
        <AppText variant="caption" style={[shadow, { color: colors.nightText }]}>
          {story.location} · {formatStoryDate(story.publishedAt)}
        </AppText>
      </View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded((e) => !e)} hitSlop={8}>
        <AppText variant="label" style={[shadow, { color: colors.nightText }]}>
          {expanded ? 'Show less' : 'Read more…'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, alignItems: 'flex-start' },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.28)' },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, maxWidth: '100%' },
  creator: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, flexShrink: 1, minHeight: 48 },
  ring: { padding: 2, borderRadius: 24, borderWidth: 2, borderColor: colors.onBrand },
  badge: { position: 'absolute', right: -5, bottom: -4 },
  names: { flexShrink: 1, gap: 1 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  follow: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.onBrand,
    backgroundColor: colors.onBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  following: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.7 },
});
