import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Avatar, GlassButton, type IoniconName } from '@/components/ui';
import { getAuthor } from '@/data/authors';
import type { Author, Story } from '@/data/types';
import { formatCount, formatRelative } from '@/lib/format';
import { colors, fonts, hitTarget, radius, spacing } from '@/theme';

import { AvatarStack } from './AvatarStack';
import { FeedMedia } from './FeedMedia';
import { VerifiedBadge } from './VerifiedBadge';

type Props = {
  story: Story;
  active: boolean;
  liked: boolean;
  /** People the viewer follows who liked this post (for the social proof row). */
  likedBy: Author[];
  onOpen: (story: Story) => void;
  onOpenAuthor: (authorId: string) => void;
  onToggleLike: (storyId: string) => void;
  onComment: (story: Story) => void;
  onShare: (story: Story) => void;
  onReact: (story: Story) => void;
  onMore: (story: Story) => void;
};

function NotchAction({ icon, label, color = colors.text, onPress, selected }: {
  icon: IoniconName;
  label: string;
  color?: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected != null ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.notchBtn, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={26} color={color} />
    </Pressable>
  );
}

/** Feed post in the "social" layout: rounded media card with overlays and an action cut-out. */
export const FeedPostCard = memo(function FeedPostCard({
  story,
  active,
  liked,
  likedBy,
  onOpen,
  onOpenAuthor,
  onToggleLike,
  onComment,
  onShare,
  onReact,
  onMore,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const author = getAuthor(story.authorId);
  if (!author) return null;

  const coAuthors = story.coAuthorIds.map(getAuthor).filter((a): a is Author => !!a);
  const byline = [author, ...coAuthors].map((a) => a.name).join(', ');
  const likes = story.likes + (liked ? 1 : 0);
  const reactors = likedBy.slice(0, 2);

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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${author.name}${author.verified ? ', verified' : ''}. Open profile`}
          onPress={() => onOpenAuthor(author.id)}
          style={styles.authorRow}
        >
          <View style={styles.avatarRing}>
            <Avatar name={author.name} uri={author.avatarUrl} tone={author.tone} size={40} />
          </View>
          <View style={styles.authorText}>
            <View style={styles.nameRow}>
              <AppText variant="heading" color="textInverse" numberOfLines={1} style={styles.shadowText}>
                {author.handle}
              </AppText>
              {author.verified ? <VerifiedBadge size={15} /> : null}
            </View>
            <View style={styles.nameRow}>
              <Ionicons name="people-outline" size={13} color={colors.onBrand} />
              <AppText variant="caption" color="textInverse" numberOfLines={1} style={[styles.shadowText, styles.byline]}>
                {byline}
              </AppText>
            </View>
          </View>
        </Pressable>

        <View style={styles.topActions}>
          <GlassButton tone="light" size={36} icon="expand-outline" iconSize={17} accessibilityLabel="Open full screen" onPress={() => onOpen(story)} />
          <GlassButton tone="light" size={36} icon="ellipsis-vertical" iconSize={17} accessibilityLabel="More options" onPress={() => onMore(story)} />
        </View>

        {reactors.length > 0 ? (
          <View style={styles.reactors} pointerEvents="none">
            {reactors.map((p) => (
              <View key={p.id} style={styles.reactor}>
                <Avatar name={p.name} uri={p.avatarUrl} tone={p.tone} size={26} />
                <View style={styles.reactorHeart}>
                  <Ionicons name="heart" size={8} color={colors.onBrand} />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.notch}>
          <NotchAction
            icon={liked ? 'heart' : 'heart-outline'}
            color={liked ? colors.like : colors.text}
            label={liked ? 'Unlike' : 'Like'}
            selected={liked}
            onPress={() => onToggleLike(story.id)}
          />
          <NotchAction icon="chatbubble-outline" label={`Comments, ${story.comments}`} onPress={() => onComment(story)} />
          <NotchAction icon="paper-plane-outline" label="Share" onPress={() => onShare(story)} />
          <NotchAction icon="happy-outline" label="React" onPress={() => onReact(story)} />
        </View>

        <View style={styles.likedPill} accessible accessibilityLabel={`${formatCount(likes)} likes`}>
          {likedBy.length > 0 ? <AvatarStack people={likedBy.slice(0, 3)} size={22} /> : null}
          <AppText variant="micro" allowFontScaling={false}>
            {formatCount(likes)} Liked
          </AppText>
        </View>
      </View>

      <View style={styles.meta}>
        <AppText variant="caption" color="textSubtle">
          {formatRelative(story.publishedAt)} · {story.location}
        </AppText>
        {likedBy.length > 0 ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {likedBy
              .slice(0, 2)
              .map((p) => `@${p.handle}`)
              .join(', ')}{' '}
            and others liked this post!
          </AppText>
        ) : null}
        <AppText variant="body" numberOfLines={expanded ? undefined : 2}>
          <AppText variant="bodyStrong" style={styles.heavy}>@{author.handle} </AppText>
          {story.headline}
          {expanded ? `. ${story.summary}` : ''}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((e) => !e)}
          hitSlop={8}
          style={styles.moreBtn}
        >
          <AppText variant="caption" color="textSubtle">
            {expanded ? 'Show less' : '…more'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
});

const NOTCH_H = 54;

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg },
  card: {
    height: 340,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.media,
  },
  authorRow: {
    position: 'absolute',
    left: spacing.md + 2,
    top: spacing.md + 2,
    right: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  avatarRing: { borderWidth: 2, borderColor: colors.onBrand, borderRadius: 24 },
  authorText: { flexShrink: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  byline: { flexShrink: 1 },
  shadowText: { textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } },
  topActions: { position: 'absolute', right: spacing.md + 2, top: spacing.lg, flexDirection: 'row', gap: spacing.sm },
  reactors: { position: 'absolute', left: spacing.lg, bottom: NOTCH_H + spacing.md, gap: spacing.sm },
  reactor: { borderWidth: 2, borderColor: colors.onBrand, borderRadius: 15 },
  reactorHeart: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.onBrand,
    backgroundColor: colors.like,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: NOTCH_H,
    paddingLeft: spacing.xs,
    paddingRight: spacing.md,
    paddingTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopRightRadius: 24,
  },
  notchBtn: { width: hitTarget, height: hitTarget, alignItems: 'center', justifyContent: 'center' },
  likedPill: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    height: 34,
    paddingLeft: 4,
    paddingRight: spacing.md,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.glassLight,
  },
  meta: { paddingHorizontal: spacing.xs, paddingTop: spacing.sm, gap: 3 },
  heavy: { fontFamily: fonts.heavy },
  moreBtn: { alignSelf: 'flex-start' },
  pressed: { opacity: 0.6 },
});
