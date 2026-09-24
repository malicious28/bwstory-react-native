import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Story } from '@/data/types';
import { colors, radius, shadow, spacing } from '@/theme';

import { StoryActions } from './StoryActions';
import { StoryAuthorRow } from './StoryAuthorRow';
import { StoryHeadline } from './StoryHeadline';
import { StoryMeta } from './StoryMeta';
import { StoryVideo } from './StoryVideo';

type Props = {
  story: Story;
  active: boolean;
  allowPlayback: boolean;
  following: boolean;
  liked: boolean;
  onActivate: (storyId: string) => void;
  onToggleFollow: (authorId: string) => void;
  onToggleLike: (storyId: string) => void;
  onShare: (story: Story) => void;
  onComment: (story: Story) => void;
};

/**
 * One feed item: author row, then a card with the video, meta line, headline and actions.
 * Memoised with id-based callbacks so a like on one card doesn't re-render the others.
 */
export const StoryCard = memo(function StoryCard({
  story,
  active,
  allowPlayback,
  following,
  liked,
  onActivate,
  onToggleFollow,
  onToggleLike,
  onShare,
  onComment,
}: Props) {
  return (
    <View style={styles.item}>
      <StoryAuthorRow author={story.author} following={following} onToggleFollow={() => onToggleFollow(story.author.id)} />
      <View style={styles.card}>
        <StoryVideo
          videoUrl={story.videoUrl}
          posterUrl={story.posterUrl}
          active={active}
          allowPlayback={allowPlayback}
          title={story.headline}
          onActivate={() => onActivate(story.id)}
        />
        <View style={styles.body}>
          <StoryMeta publishedAt={story.publishedAt} location={story.location} views={story.views} />
          <StoryHeadline headline={story.headline} summary={story.summary} />
          <StoryActions
            liked={liked}
            likes={story.likes}
            comments={story.comments}
            onToggleLike={() => onToggleLike(story.id)}
            onShare={() => onShare(story)}
            onComment={() => onComment(story)}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  item: { paddingTop: spacing.sm },
  card: {
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
});
