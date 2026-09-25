import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, GlassButton, type IoniconName } from '@/components/ui';
import { getAuthor } from '@/data/authors';
import type { Author, Story } from '@/data/types';
import { formatCount, formatRelative } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme';

import { FeedMedia } from './FeedMedia';
import { VerifiedBadge } from './VerifiedBadge';

type Props = {
  story: Story;
  active: boolean;
  liked: boolean;
  saved: boolean;
  onOpen: (story: Story) => void;
  onOpenAuthor: (authorId: string) => void;
  onToggleLike: (storyId: string) => void;
  onToggleSave: (storyId: string) => void;
  onComment: (story: Story) => void;
  onShare: (story: Story) => void;
  onMore: (story: Story) => void;
};

/** One icon (+ optional count) inside the see-through action pill. */
function PillAction({ icon, label, count, color = colors.onBrand, selected, onPress }: {
  icon: IoniconName;
  label: string;
  count?: number;
  color?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count != null ? `${label}, ${formatCount(count)}` : label}
      accessibilityState={selected != null ? { selected } : undefined}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={({ pressed }) => [styles.pillAction, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={color} />
      {count != null ? (
        <AppText variant="label" color="textInverse" allowFontScaling={false}>
          {formatCount(count)}
        </AppText>
      ) : null}
    </Pressable>
  );
}

/**
 * Feed post: rounded media card with the author on top and one see-through action bar at the
 * bottom (like count lives next to the heart), then a two-line caption underneath.
 */
export const FeedPostCard = memo(function FeedPostCard({
  story,
  active,
  liked,
  saved,
  onOpen,
  onOpenAuthor,
  onToggleLike,
  onToggleSave,
  onComment,
  onShare,
  onMore,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const author = getAuthor(story.authorId);
  if (!author) return null;

  const coAuthors = story.coAuthorIds.map(getAuthor).filter((a): a is Author => !!a);
  const likes = story.likes + (liked ? 1 : 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <FeedMedia posterUrl={story.posterUrl} videoUrl={story.videoUrl} preview={active} />

        {/* The whole media area opens the full-screen player. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Watch full screen: ${story.headline}`}
          onPress={() => onOpen(story)}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.topRow} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${author.name}${author.verified ? ', verified' : ''}. Open profile`}
            onPress={() => onOpenAuthor(author.id)}
            style={({ pressed }) => [styles.authorChip, pressed && styles.pressed]}
          >
            <Avatar name={author.name} uri={author.avatarUrl} tone={author.tone} size={32} />
            <View style={styles.authorText}>
              <View style={styles.nameRow}>
                <AppText variant="label" color="textInverse" numberOfLines={1}>
                  {author.handle}
                </AppText>
                {author.verified ? <VerifiedBadge size={14} /> : null}
              </View>
              {coAuthors.length > 0 ? (
                <AppText variant="caption" numberOfLines={1} style={styles.byline}>
                  with {coAuthors.map((a) => a.name).join(', ')}
                </AppText>
              ) : null}
            </View>
          </Pressable>

          <View style={styles.topActions}>
            <GlassButton tone="shade" size={40} icon="expand-outline" iconSize={18} accessibilityLabel="Open full screen" onPress={() => onOpen(story)} />
            <GlassButton tone="shade" size={40} icon="ellipsis-horizontal" iconSize={18} accessibilityLabel="More options" onPress={() => onMore(story)} />
          </View>
        </View>

        <View style={styles.bottomRow} pointerEvents="box-none">
          <View style={styles.pill}>
            <PillAction
              icon={liked ? 'heart' : 'heart-outline'}
              color={liked ? colors.likeOnDark : colors.onBrand}
              label={liked ? 'Unlike' : 'Like'}
              count={likes}
              selected={liked}
              onPress={() => onToggleLike(story.id)}
            />
            <PillAction icon="chatbubble-outline" label="Comments" count={story.comments} onPress={() => onComment(story)} />
            <PillAction icon="paper-plane-outline" label="Share" onPress={() => onShare(story)} />
          </View>
          <GlassButton
            tone="shade"
            size={44}
            iconSize={20}
            icon={saved ? 'bookmark' : 'bookmark-outline'}
            accessibilityLabel={saved ? 'Remove from saved' : 'Save story'}
            accessibilityState={{ selected: saved }}
            onPress={() => onToggleSave(story.id)}
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityHint={expanded ? 'Shows less of the caption' : 'Shows the full caption'}
        onPress={() => setExpanded((e) => !e)}
        style={styles.caption}
      >
        <AppText variant="body" numberOfLines={expanded ? undefined : 2}>
          <AppText variant="bodyStrong" style={styles.heavy}>
            {author.handle}{' '}
          </AppText>
          {story.headline}
          {expanded ? `. ${story.summary}` : ''}
        </AppText>
        <AppText variant="caption" color="textSubtle">
          {formatRelative(story.publishedAt)} · {story.location}
        </AppText>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    height: 380,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.media,
  },
  topRow: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  authorChip: {
    flexShrink: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: 4,
    paddingRight: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.glassShade,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassShadeBorder,
  },
  authorText: { flexShrink: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  byline: { color: colors.nightText },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  bottomRow: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    height: 44,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.glassShade,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassShadeBorder,
  },
  pillAction: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  caption: { paddingHorizontal: spacing.xs, gap: spacing.xs },
  heavy: { fontFamily: fonts.heavy },
  pressed: { opacity: 0.6 },
});
