import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { isSafeMediaUrl } from '@/lib/url';
import { colors } from '@/theme';

type Props = {
  posterUrl: string;
  videoUrl: string;
  /** Only the most visible card previews its video (muted, looping). */
  preview: boolean;
};

/** Cover image, upgraded to a silent looping preview while the card is the active one. */
export function FeedMedia({ posterUrl, videoUrl, preview }: Props) {
  const poster = isSafeMediaUrl(posterUrl) ? posterUrl : null;
  const video = isSafeMediaUrl(videoUrl) ? videoUrl : null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {poster ? <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} /> : null}
      {preview && video ? <SilentPreview uri={video} /> : null}
    </View>
  );
}

function SilentPreview({ uri }: { uri: string }) {
  const [ready, setReady] = useState(false);
  // Playback starts in setup; no pause-on-unmount: useVideoPlayer releases the player
  // itself when this unmounts, and touching a released player throws.
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={[StyleSheet.absoluteFill, !ready && styles.hidden]}
      contentFit="cover"
      nativeControls={false}
      onFirstFrameRender={() => setReady(true)}
    />
  );
}

const styles = StyleSheet.create({
  hidden: { opacity: 0, backgroundColor: colors.media },
});
