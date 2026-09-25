import Ionicons from '@expo/vector-icons/Ionicons';
import { useEvent, useEventListener } from 'expo';
import { Image } from 'expo-image';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionRail } from '@/components/social/ActionRail';
import { CommentBar } from '@/components/social/CommentBar';
import { CreatorInfo } from '@/components/social/CreatorInfo';
import { ProgressLine } from '@/components/social/ProgressLine';
import { AppText, EmptyState, FocusStatusBar, GlassButton, useToast } from '@/components/ui';
import { getAuthor } from '@/data/authors';
import { getStory, SAMPLE_STORIES } from '@/data/stories';
import type { Author, Story } from '@/data/types';
import { useSocial } from '@/features/social/SocialContext';
import { isSafeMediaUrl } from '@/lib/url';
import { colors, radius, spacing } from '@/theme';

/** Route: /discover/video?storyId=… (full-screen player). */
export default function VideoScreen() {
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  // Route params are user-controllable (deep links): only known ids are accepted.
  const story = getStory(typeof storyId === 'string' ? storyId : undefined);
  const author = getAuthor(story?.authorId);

  if (!story || !author) return <NotFound />;
  // Keyed so switching to the next story remounts a fresh player.
  return <Player key={story.id} story={story} author={author} />;
}

function Player({ story, author }: { story: Story; author: Author }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const social = useSocial();
  const isFocused = useIsFocused();

  const uri = isSafeMediaUrl(story.videoUrl) ? story.videoUrl : null;
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.timeUpdateEventInterval = 0.25;
  });

  const [userPaused, setUserPaused] = useState(false);
  const [firstFrame, setFirstFrame] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEventListener(player, 'timeUpdate', (e) => setCurrentTime(e.currentTime));

  const shouldPlay = isFocused && !userPaused;
  useEffect(() => {
    if (shouldPlay) player.play();
    else player.pause();
  }, [player, shouldPlay]);

  const liked = social.isLiked(story.id);
  const saved = social.isSaved(story.id);
  const duration = player.duration || 0;
  const failed = !uri || status === 'error';
  const loading = !failed && (status === 'loading' || !firstFrame);

  const index = SAMPLE_STORIES.findIndex((s) => s.id === story.id);
  const next = SAMPLE_STORIES[(index + 1) % SAMPLE_STORIES.length];

  const share = async () => {
    try {
      await Share.share({ message: `${story.headline} (${story.location})\n\nShared from BWStory` });
    } catch {
      toast('Couldn’t open the share sheet', 'error');
    }
  };

  const openAuthor = () => {
    setUserPaused(true);
    router.push({ pathname: '/discover/video/user', params: { authorId: author.id } });
  };

  return (
    <View style={styles.screen}>
      <FocusStatusBar style="light" />

      {isSafeMediaUrl(story.posterUrl) && !firstFrame ? (
        <Image source={{ uri: story.posterUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : null}
      {uri ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          onFirstFrameRender={() => setFirstFrame(true)}
        />
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={userPaused ? 'Play video' : 'Pause video'}
        onPress={() => setUserPaused((p) => !p)}
        style={[StyleSheet.absoluteFill, styles.center]}
      >
        {failed ? (
          <View style={styles.errorBox}>
            <Ionicons name="cloud-offline-outline" size={30} color={colors.onBrand} />
            <AppText variant="label" color="textInverse">Couldn’t load this video</AppText>
            <Pressable
              accessibilityRole="button"
              onPress={() => uri && player.replaceAsync(uri).catch(() => {})}
              style={styles.retry}
            >
              <Ionicons name="refresh" size={16} color={colors.text} />
              <AppText variant="label">Try again</AppText>
            </Pressable>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color={colors.onBrand} />
        ) : userPaused ? (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={32} color={colors.onBrand} style={styles.playNudge} />
          </View>
        ) : null}
      </Pressable>

      <View style={[styles.topBar, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        <GlassButton shape="rounded" icon="arrow-back" iconSize={22} accessibilityLabel="Back" onPress={() => router.back()} />
        <GlassButton
          shape="rounded"
          icon="camera-outline"
          iconSize={22}
          accessibilityLabel="Record a reply story"
          onPress={() => toast('Reply stories are coming soon')}
        />
      </View>

      <View style={[styles.rightColumn, { bottom: insets.bottom + 156 }]} pointerEvents="box-none">
        <ActionRail
          liked={liked}
          saved={saved}
          likes={story.likes + (liked ? 1 : 0)}
          comments={story.comments}
          shares={story.shares}
          onMore={() => toast('Post options are coming soon')}
          onLike={() => social.toggleLike(story.id)}
          onComment={() => toast('Comment threads are coming soon. Add yours below')}
          onShare={share}
          onSave={() => {
            social.toggleSave(story.id);
            toast(saved ? 'Removed from saved' : 'Saved to your stories', 'success');
          }}
        />
        {next && next.id !== story.id ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Next story: ${next.headline}`}
            onPress={() => router.replace({ pathname: '/discover/video', params: { storyId: next.id } })}
            style={styles.nextTile}
          >
            {isSafeMediaUrl(next.posterUrl) ? (
              <Image source={{ uri: next.posterUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : null}
            <View style={styles.nextBadge}>
              <Ionicons name="play-forward" size={10} color={colors.onBrand} />
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.info, { bottom: insets.bottom + 104 }]} pointerEvents="box-none">
        <CreatorInfo
          story={story}
          author={author}
          following={social.isFollowing(author.id)}
          onOpenAuthor={openAuthor}
          onToggleFollow={() => social.toggleFollow(author.id)}
        />
      </View>

      <View style={[styles.progress, { bottom: insets.bottom + 88 }]} pointerEvents="none">
        <ProgressLine progress={duration > 0 ? currentTime / duration : 0} />
      </View>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }} style={[styles.comment, { bottom: insets.bottom + spacing.lg }]}>
        <CommentBar onSubmit={() => toast('Comment posted', 'success')} />
      </KeyboardStickyView>
    </View>
  );
}

function NotFound() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
      <FocusStatusBar style="light" />
      <View style={styles.notFoundCard}>
        <EmptyState
          icon="videocam-off-outline"
          title="Story not found"
          message="This story may have been removed."
          actionLabel="Back to Discover"
          onAction={() => router.replace('/discover')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  center: { alignItems: 'center', justifyContent: 'center' },
  topBar: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
  rightColumn: { position: 'absolute', right: spacing.md, alignItems: 'center', gap: spacing.lg },
  nextTile: {
    width: 44,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'visible',
    backgroundColor: colors.media,
  },
  nextBadge: {
    position: 'absolute',
    right: -7,
    bottom: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.onBrand,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { position: 'absolute', left: spacing.lg, right: 90 },
  progress: { position: 'absolute', left: spacing.lg, right: spacing.lg },
  comment: { position: 'absolute', left: spacing.lg, right: spacing.lg },
  playBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.mediaScrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playNudge: { marginLeft: 4 },
  errorBox: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.mediaScrim },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  notFoundCard: { margin: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.surface },
});
