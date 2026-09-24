import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEvent, useEventListener } from 'expo';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, IconButton } from '@/components/ui';
import { formatClock } from '@/lib/format';
import { isSafeMediaUrl } from '@/lib/url';
import { colors, radius, spacing } from '@/theme';

import { VideoProgressBar } from './VideoProgressBar';

const CONTROLS_HIDE_MS = 2500;
const SEEK_SECONDS = 10;

type Props = {
  videoUrl: string;
  posterUrl: string;
  /** Only the active (most visible) card mounts a player; the rest show their cover. */
  active: boolean;
  /** False while the screen is blurred so audio never leaks across tabs. */
  allowPlayback: boolean;
  title: string;
  onActivate: () => void;
  overlay?: ReactNode;
};

export function StoryVideo({ videoUrl, posterUrl, active, allowPlayback, title, onActivate, overlay }: Props) {
  const safeVideo = isSafeMediaUrl(videoUrl) ? videoUrl : null;
  const safePoster = isSafeMediaUrl(posterUrl) ? posterUrl : null;

  return (
    <View style={styles.frame}>
      {active && safeVideo ? (
        <ActivePlayer uri={safeVideo} posterUri={safePoster} allowPlayback={allowPlayback} title={title} />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play video: ${title}`}
          disabled={!safeVideo}
          onPress={onActivate}
          style={StyleSheet.absoluteFill}
        >
          {safePoster ? <Image source={{ uri: safePoster }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} /> : null}
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
          <View style={styles.center}>
            {safeVideo ? (
              <View style={styles.bigPlay}>
                <Ionicons name="play" size={30} color={colors.onBrand} style={styles.playNudge} />
              </View>
            ) : (
              <AppText variant="label" color="textInverse">Video unavailable</AppText>
            )}
          </View>
        </Pressable>
      )}
      {overlay}
    </View>
  );
}

type PlayerProps = { uri: string; posterUri: string | null; allowPlayback: boolean; title: string };

function ActivePlayer({ uri, posterUri, allowPlayback, title }: PlayerProps) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    // Muted autoplay is the feed convention; sound is one tap away.
    p.muted = true;
    p.timeUpdateEventInterval = 0.25;
  });

  const [userPaused, setUserPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  // Bumped on every control tap so the hide timer restarts.
  const [interaction, setInteraction] = useState(0);
  const [firstFrame, setFirstFrame] = useState(false);

  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEventListener(player, 'timeUpdate', (e) => setCurrentTime(e.currentTime));

  const shouldPlay = allowPlayback && !userPaused;

  useEffect(() => {
    if (shouldPlay) player.play();
    else player.pause();
  }, [player, shouldPlay]);

  // The player is an imperative native object; expo-video exposes `muted` only as a setter.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    player.muted = muted;
  }, [player, muted]);

  // Auto-hide controls while playing; keep them up while paused.
  useEffect(() => {
    if (!controlsVisible || !isPlaying) return;
    const t = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_MS);
    return () => clearTimeout(t);
  }, [controlsVisible, isPlaying, interaction]);

  const duration = player.duration || 0;
  const loading = status === 'loading' || (status === 'idle' && shouldPlay);
  const failed = status === 'error';

  const showControls = () => {
    setControlsVisible(true);
    setInteraction((n) => n + 1);
  };
  const togglePlay = () => {
    setUserPaused(isPlaying);
    showControls();
  };
  const seek = (delta: number) => {
    player.seekBy(delta);
    showControls();
  };
  const toggleMute = () => {
    setMuted((m) => !m);
    showControls();
  };
  const retry = () => {
    setUserPaused(false);
    player.replaceAsync(uri).catch(() => {});
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        onFirstFrameRender={() => setFirstFrame(true)}
        accessible
        accessibilityLabel={`Video: ${title}`}
      />
      {!firstFrame && posterUri ? (
        <Image source={{ uri: posterUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : null}

      {/* Tap anywhere on the video to show / hide controls. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={controlsVisible ? 'Hide video controls' : 'Show video controls'}
        onPress={() => setControlsVisible((v) => !v)}
        style={StyleSheet.absoluteFill}
      />

      {failed ? (
        <View style={[StyleSheet.absoluteFill, styles.scrim, styles.center, styles.stack]}>
          <Ionicons name="cloud-offline-outline" size={30} color={colors.onBrand} />
          <AppText variant="label" color="textInverse">Couldn’t load this video</AppText>
          <Pressable accessibilityRole="button" onPress={retry} style={styles.retry}>
            <Ionicons name="refresh" size={16} color={colors.text} />
            <AppText variant="label">Try again</AppText>
          </Pressable>
        </View>
      ) : null}

      {!failed && loading ? (
        <View pointerEvents="none" style={styles.center}>
          <ActivityIndicator size="large" color={colors.onBrand} />
        </View>
      ) : null}

      {!failed && !loading && controlsVisible ? (
        <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, styles.controlsLayer]}>
          <View pointerEvents="box-none" style={styles.transport}>
            <IconButton accessibilityLabel={`Back ${SEEK_SECONDS} seconds`} onPress={() => seek(-SEEK_SECONDS)} style={styles.transportBtn}>
              <MaterialIcons name="replay-10" size={34} color={colors.onBrand} />
            </IconButton>
            <IconButton
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? 'pause' : 'play'}
              size={40}
              color={colors.onBrand}
              onPress={togglePlay}
              style={styles.transportBtn}
            />
            <IconButton accessibilityLabel={`Forward ${SEEK_SECONDS} seconds`} onPress={() => seek(SEEK_SECONDS)} style={styles.transportBtn}>
              <MaterialIcons name="forward-10" size={34} color={colors.onBrand} />
            </IconButton>
          </View>
          <IconButton
            accessibilityLabel={muted ? 'Unmute' : 'Mute'}
            icon={muted ? 'volume-mute' : 'volume-high'}
            size={26}
            color={colors.onBrand}
            onPress={toggleMute}
          />
        </View>
      ) : null}

      <View pointerEvents="none" style={styles.footer}>
        <View style={styles.timePill}>
          <AppText variant="micro" color="textInverse" allowFontScaling={false}>
            {formatClock(currentTime)}/{formatClock(duration)}
          </AppText>
        </View>
        {/* Always-visible mute hint so users know sound is off. */}
        {muted && !controlsVisible ? (
          <View style={styles.timePill}>
            <Ionicons name="volume-mute" size={14} color={colors.onBrand} />
          </View>
        ) : null}
      </View>
      <View pointerEvents="none" style={styles.progress}>
        <VideoProgressBar progress={duration > 0 ? currentTime / duration : 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.media,
    overflow: 'hidden',
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  scrim: { backgroundColor: colors.scrim },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  stack: { gap: spacing.sm },
  bigPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(20,52,66,0.72)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playNudge: { marginLeft: 4 },
  controlsLayer: { backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  transport: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxxl },
  transportBtn: { width: 56, height: 56 },
  footer: { position: 'absolute', left: spacing.md, bottom: spacing.md, flexDirection: 'row', gap: spacing.sm },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  progress: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
});
